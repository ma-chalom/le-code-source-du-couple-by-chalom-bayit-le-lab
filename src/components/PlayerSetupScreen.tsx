import React, { useState } from 'react';
import AppLogo from './icons/AppLogo';

interface PlayerSetupScreenProps {
  onSetupComplete: (player1: string, player2: string) => void;
}

const PlayerSetupScreen: React.FC<PlayerSetupScreenProps> = ({ onSetupComplete }) => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (player1.trim() && player2.trim()) {
      onSetupComplete(player1.trim(), player2.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        <AppLogo className="w-48 mx-auto mb-8" />
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Qui joue aujourd'hui ?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Veuillez entrer vos prénoms pour commencer.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="player1" className="sr-only">
              Prénom du Joueur 1
            </label>
            <input
              id="player1"
              name="player1"
              type="text"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm dark:bg-gray-700"
              placeholder="Prénom du Joueur 1"
            />
          </div>
           <div>
            <label htmlFor="player2" className="sr-only">
              Prénom du Joueur 2
            </label>
            <input
              id="player2"
              name="player2"
              type="text"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 sm:text-sm dark:bg-gray-700"
              placeholder="Prénom du Joueur 2"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={!player1.trim() || !player2.trim()}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              C'est parti !
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerSetupScreen;