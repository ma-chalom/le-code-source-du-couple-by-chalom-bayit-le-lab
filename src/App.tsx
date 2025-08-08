import React, { useState, useEffect, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import GameScreen from './components/GameScreen';
import AdminScreen from './components/AdminScreen';
import PlayerSetupScreen from './components/PlayerSetupScreen';
import { DEFAULT_VALID_ACCESS_CODES, ADMIN_SECRET_CODE } from './constants';
import { SessionLog, PlayerData, PlayerScores } from './types';

type View = 'login' | 'player_setup' | 'game';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Persisted state
  const [players, setPlayers] = useState<PlayerData | null>(null);
  const [scores, setScores] = useState<PlayerScores>({ player1: 0, player2: 0 });
  const [seenCardIds, setSeenCardIds] = useState<number[]>([]);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [accessCodes, setAccessCodes] = useState<string[]>([]);
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const safelyParseJSON = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (error) {
      console.error(`Failed to parse ${key} from localStorage`, error);
      return fallback;
    }
  };

  useEffect(() => {
    setPlayers(safelyParseJSON('players', null));
    setScores(safelyParseJSON('scores', { player1: 0, player2: 0 }));
    setSeenCardIds(safelyParseJSON('seenCardIds', []));
    setSessionLogs(safelyParseJSON('sessionLogs', []));
    setAccessCodes(safelyParseJSON('accessCodes', DEFAULT_VALID_ACCESS_CODES));
  }, []);

  const saveToStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage`, error);
    }
  }, []);

  const handleLogin = (accessCode: string) => {
    const code = accessCode.toUpperCase();
    if (code === ADMIN_SECRET_CODE) {
      setIsAdmin(true);
      setLoginError(null);
    } else if (accessCodes.includes(code)) {
      const newSession: SessionLog = {
        id: crypto.randomUUID(),
        accessCode: code,
        loginTime: new Date().toISOString(),
        cardsViewed: 0,
        players: players || undefined,
      };
      const updatedLogs = [...sessionLogs, newSession];
      setSessionLogs(updatedLogs);
      saveToStorage('sessionLogs', updatedLogs);
      setCurrentSessionId(newSession.id);
      
      if (players) {
        setCurrentView('game');
      } else {
        setCurrentView('player_setup');
      }
      setLoginError(null);

    } else {
      setLoginError("Code d'accès invalide. Veuillez réessayer.");
    }
  };

  const handlePlayerSetup = (player1: string, player2: string) => {
    const newPlayers = { player1, player2 };
    setPlayers(newPlayers);
    saveToStorage('players', newPlayers);

    // Update current session log with player names
     if (currentSessionId) {
        setSessionLogs(prevLogs => {
          const updatedLogs = prevLogs.map(log => 
            log.id === currentSessionId ? { ...log, players: newPlayers } : log
          );
          saveToStorage('sessionLogs', updatedLogs);
          return updatedLogs;
        });
    }

    setCurrentView('game');
  };

  const updateCurrentSession = useCallback((cardsViewed: number) => {
    if (!currentSessionId) return;
    setSessionLogs(prevLogs => {
      const updatedLogs = prevLogs.map(log => 
        log.id === currentSessionId ? { ...log, cardsViewed } : log
      );
      saveToStorage('sessionLogs', updatedLogs);
      return updatedLogs;
    });
  }, [currentSessionId, saveToStorage]);
  
  const handleGameEnd = (playedCardIds: number[]) => {
      const newSeenIds = [...new Set([...seenCardIds, ...playedCardIds])];
      setSeenCardIds(newSeenIds);
      saveToStorage('seenCardIds', newSeenIds);
  };
  
  const handleUpdateScores = (newScores: PlayerScores) => {
      setScores(newScores);
      saveToStorage('scores', newScores);
  };

  const handleLogout = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      if (currentSessionId) {
          setSessionLogs(prevLogs => {
            const updatedLogs = prevLogs.map(log => 
              log.id === currentSessionId ? { ...log, endTime: new Date().toISOString() } : log
            );
            saveToStorage('sessionLogs', updatedLogs);
            return updatedLogs;
          });
      }
      setCurrentSessionId(null);
      setCurrentView('login');
    }
  };

  const handleClearLogs = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer TOUS les journaux de session ?")) {
        setSessionLogs([]);
        saveToStorage('sessionLogs', []);
    }
  }

  const handleResetScores = () => {
    const newScores = { player1: 0, player2: 0 };
    setScores(newScores);
    saveToStorage('scores', newScores);
    alert('Scores réinitialisés !');
  };
  
  const handleResetSeenCards = () => {
    setSeenCardIds([]);
    saveToStorage('seenCardIds', []);
    alert('Cartes réinitialisées ! Vous pouvez maintenant rejouer à toutes les cartes.');
  };

  const handleUpdateAccessCodes = (newCodes: string[]) => {
    const uniqueCodes = [...new Set(newCodes.map(c => c.toUpperCase()))];
    setAccessCodes(uniqueCodes);
    saveToStorage('accessCodes', uniqueCodes);
    alert("La liste des codes d'accès a été mise à jour.");
  };

  const renderView = () => {
    if (isAdmin) {
      return <AdminScreen 
                  logs={sessionLogs} 
                  onLogout={handleLogout} 
                  clearLogs={handleClearLogs}
                  accessCodes={accessCodes}
                  onUpdateAccessCodes={handleUpdateAccessCodes}
              />;
    }

    switch (currentView) {
      case 'player_setup':
        return <PlayerSetupScreen onSetupComplete={handlePlayerSetup} />;
      case 'game':
        if (!players) return <LoginScreen onLogin={handleLogin} error={loginError} />; // Should not happen
        return <GameScreen 
                    players={players} 
                    scores={scores} 
                    seenCardIds={seenCardIds}
                    onLogout={handleLogout} 
                    updateSession={updateCurrentSession}
                    onGameEnd={handleGameEnd}
                    onUpdateScores={handleUpdateScores}
                    onResetScores={handleResetScores}
                    onResetSeenCards={handleResetSeenCards}
                />;
      case 'login':
      default:
        return <LoginScreen onLogin={handleLogin} error={loginError} />;
    }
  };

  return <div className="App">{renderView()}</div>;
};

export default App;