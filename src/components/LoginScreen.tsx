import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (accessCode: string) => void;
  error: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, error }) => {
  const [accessCode, setAccessCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(accessCode);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 mt-8">Bienvenue !</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Veuillez entrer votre code d'accès pour commencer.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="accessCode" className="sr-only">
              Code d'accès
            </label>
            <input
              id="accessCode"
              name="accessCode"
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm dark:bg-gray-700"
              placeholder="CODE D'ACCÈS"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-colors duration-300"
            >
              Entrer dans le jeu
            </button>
          </div>
        </form>
         <p className="text-xs text-gray-400 dark:text-gray-500 mt-8">
            Jeu conçu par Chalom Bayit Le LAB
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;