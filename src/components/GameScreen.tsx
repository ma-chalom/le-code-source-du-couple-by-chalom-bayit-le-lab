import React, { useState, useEffect, useMemo } from 'react';
import { CardData, PlayerData, PlayerScores } from '../types';
import { CARDS } from '../constants';
import Card from './Card';
import GearIcon from './icons/GearIcon';
import QuestionMarkIcon from './icons/QuestionMarkIcon';
import RulesModal from './RulesModal';
import AppLogo from './icons/AppLogo';
import CardBackIcon from './icons/CardBackIcon';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

type GamePhase = 'setup' | 'playing' | 'finished';
type QuestionStep = 'partner_answering' | 'self_answering' | 'round_over';

interface GameScreenProps {
  players: PlayerData;
  scores: PlayerScores;
  seenCardIds: number[];
  onLogout: () => void;
  updateSession: (cardsViewed: number) => void;
  onGameEnd: (playedCardIds: number[]) => void;
  onUpdateScores: (newScores: PlayerScores) => void;
  onResetScores: () => void;
  onResetSeenCards: () => void;
}

const SettingsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onResetScores: () => void;
    onResetSeenCards: () => void;
}> = ({ isOpen, onClose, onResetScores, onResetSeenCards }) => {
    if (!isOpen) return null;

    const handleResetScores = () => {
        if (window.confirm("Êtes-vous sûr de vouloir réinitialiser vos scores ? Cette action est irréversible.")) {
            onResetScores();
            onClose();
        }
    };

    const handleResetSeenCards = () => {
        if (window.confirm("Êtes-vous sûr de vouloir marquer toutes les cartes comme 'non vues' ? Vous recommencerez le jeu depuis le début.")) {
            onResetSeenCards();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">Paramètres</h2>
                <div className="space-y-4">
                    <button onClick={handleResetScores} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Réinitialiser les scores</button>
                    <button onClick={handleResetSeenCards} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Réinitialiser les cartes</button>
                    <button onClick={onClose} className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Fermer</button>
                </div>
            </div>
        </div>
    );
};


const GameScreen: React.FC<GameScreenProps> = ({ players, scores, seenCardIds, onLogout, updateSession, onGameEnd, onUpdateScores, onResetScores, onResetSeenCards }) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [gameSize, setGameSize] = useState<number>(5);
  
  const availableCards = useMemo(() => CARDS.filter(c => !seenCardIds.includes(c.id)), [seenCardIds]);
  
  const [deck, setDeck] = useState<CardData[]>([]);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [playedInSession, setPlayedInSession] = useState<number[]>([]);
  const [turn, setTurn] = useState<1 | 2>(1); // Player 1 starts
  const [questionStep, setQuestionStep] = useState<QuestionStep>('round_over');
  const [localScores, setLocalScores] = useState<PlayerScores>(scores);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  useEffect(() => {
    setLocalScores(scores);
  }, [scores]);


  const startGame = () => {
    if (gameSize > 0 && availableCards.length > 0) {
      const shuffled = shuffleArray(availableCards);
      setDeck(shuffled.slice(0, gameSize));
      setGamePhase('playing');
      setQuestionStep('round_over');
      updateSession(0);
    }
  };

  const handleDrawCard = () => {
    if (deck.length > 0 && questionStep === 'round_over') {
      const newDeck = [...deck];
      const nextCard = newDeck.pop();
      if (nextCard) {
        setDeck(newDeck);
        setCurrentCard(nextCard);
        setPlayedInSession(prev => [...prev, nextCard.id]);
        setIsFlipped(false); // Show back of the card first
        
        setTimeout(() => setIsFlipped(true), 100);
        
        setQuestionStep('partner_answering');
        updateSession(playedInSession.length + 1);
      }
    }
  };

  const handleValidation = (wasCorrect: boolean) => {
    if (wasCorrect) {
        setLocalScores(prevScores => {
            const newScores = { ...prevScores };
            if (questionStep === 'partner_answering') {
                if (turn === 1) newScores.player1++; else newScores.player2++;
            } else { // self_answering
                if (turn === 1) newScores.player2++; else newScores.player1++;
            }
            onUpdateScores(newScores); // Update parent state and localStorage
            return newScores;
        });
    }

    if (questionStep === 'partner_answering') {
      setQuestionStep('self_answering');
    } else {
      setQuestionStep('round_over');
      setTurn(prev => (prev === 1 ? 2 : 1)); // Switch turns for next card
      if (deck.length === 0) {
        setGamePhase('finished');
        onGameEnd(playedInSession);
      }
    }
  };
  
  const resetGame = () => {
    setGamePhase('setup');
    setCurrentCard(null);
    setPlayedInSession([]);
    setTurn(1);
    setIsFlipped(false);
    updateSession(0);
  };
  
  const partnerName = turn === 1 ? players.player2 : players.player1;
  const currentPlayerName = turn === 1 ? players.player1 : players.player2;

  if (gamePhase === 'setup') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Configuration de la partie</h2>
            {availableCards.length > 0 ? (
                <>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Combien de cartes souhaitez-vous jouer ? ({availableCards.length} cartes inédites disponibles)</p>
                    <input
                        type="number"
                        min="1"
                        max={Math.min(15, availableCards.length)}
                        value={gameSize}
                        onChange={(e) => setGameSize(Math.max(1, Math.min(Math.min(15, availableCards.length), parseInt(e.target.value, 10) || 1)))}
                        className="w-full px-4 py-3 mb-6 border border-gray-300 dark:border-gray-600 rounded-md text-center dark:bg-gray-700"
                    />
                    <button onClick={startGame} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-xl text-lg shadow-lg">
                        Commencer à jouer
                    </button>
                </>
            ) : (
                <p className="text-gray-600 dark:text-gray-300 mb-6">Félicitations, vous avez répondu à toutes les questions ! Vous pouvez réinitialiser les cartes depuis les paramètres pour rejouer.</p>
            )}
        </div>
        <button onClick={() => setIsSettingsOpen(true)} className="absolute top-4 right-4 text-gray-500 hover:text-fuchsia-500 transition">
            <GearIcon className="w-8 h-8"/>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 sm:p-6">
       <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
       <SettingsModal 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onResetScores={() => {
                onResetScores();
                // Scores are updated via prop, local state will update via useEffect
            }}
            onResetSeenCards={onResetSeenCards}
       />
      <header className="w-full grid grid-cols-3 items-center mb-6 gap-4">
        <div className="text-left">
            <p className="font-bold text-cyan-500">{players.player1}</p>
            <p className="text-lg font-bold">{localScores.player1} PTS</p>
        </div>
        <div className="text-center">
          <AppLogo className="h-12 sm:h-16 mx-auto" />
        </div>
        <div className="text-right">
            <p className="font-bold text-fuchsia-500">{players.player2}</p>
            <p className="text-lg font-bold">{localScores.player2} PTS</p>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full">
        <div className="w-full max-w-sm flex flex-col items-center">
            <div className="h-96 sm:h-[480px] w-full flex items-center justify-center mb-8">
                {currentCard ? (
                    <Card card={currentCard} isFlipped={isFlipped} />
                ) : gamePhase === 'finished' ? (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-2xl flex flex-col items-center justify-center text-center p-6 shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Partie terminée !</h2>
                        <p className="text-gray-600 dark:text-gray-300">Vous avez terminé les cartes de cette session. Félicitations !</p>
                    </div>
                ) : (
                   <div className="w-full max-w-sm h-full perspective">
                     <div className="relative w-full h-full rounded-2xl shadow-2xl bg-gray-800 overflow-hidden border-4 border-yellow-500">
                       <CardBackIcon />
                     </div>
                   </div>
                )}
            </div>
            
            <div className="w-full h-28 text-center">
            {questionStep === 'round_over' ? (
                gamePhase === 'playing' ? (
                    <button onClick={handleDrawCard} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-4 rounded-xl text-lg shadow-lg transform hover:scale-105 transition">
                        {`Tour de ${currentPlayerName} : Piocher`}
                    </button>
                 ) : (
                    <button onClick={resetGame} className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold py-4 px-4 rounded-xl text-lg shadow-lg transform hover:scale-105 transition">
                        Nouvelle Partie
                    </button>
                 )
            ) : (
                <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                    {questionStep === 'partner_answering' && <p className="mb-2 font-semibold">{`Validation par ${currentPlayerName} : La réponse de ${partnerName} est...`}</p>}
                    {questionStep === 'self_answering' && <p className="mb-2 font-semibold">{`Maintenant, c'est à ${currentPlayerName} de répondre. Validation par ${partnerName} :`}</p>}
                    <div className="flex space-x-4">
                        <button onClick={() => handleValidation(true)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition">Correcte</button>
                        <button onClick={() => handleValidation(false)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition">Incorrecte</button>
                    </div>
                </div>
            )}
            </div>

          <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
            <p>Cartes restantes: {deck.length} / {gameSize}</p>
          </div>
        </div>
      </main>
      <footer className="w-full flex justify-between items-center mt-6">
        <div className="flex items-center space-x-4">
            <button onClick={() => setIsRulesOpen(true)} className="text-gray-500 hover:text-cyan-500 transition">
                <QuestionMarkIcon className="w-6 h-6"/>
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="text-gray-500 hover:text-fuchsia-500 transition">
                <GearIcon className="w-6 h-6"/>
            </button>
        </div>
        <button onClick={onLogout} className="text-xs sm:text-sm bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition">Quitter la session</button>
      </footer>
    </div>
  );
};

export default GameScreen;