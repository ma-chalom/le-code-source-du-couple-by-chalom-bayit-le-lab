import React, { useMemo, useState } from 'react';
import { SessionLog } from '../types';

interface AdminScreenProps {
  logs: SessionLog[];
  onLogout: () => void;
  clearLogs: () => void;
  accessCodes: string[];
  onUpdateAccessCodes: (newCodes: string[]) => void;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ logs, onLogout, clearLogs, accessCodes, onUpdateAccessCodes }) => {
  const [newCode, setNewCode] = useState('');

  const handleClearLogs = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vider le journal des sessions ? Cette action est irréversible.")) {
      clearLogs();
    }
  };

  const handleAddCode = () => {
    if (newCode.trim() === '') return;
    const upperCaseCode = newCode.trim().toUpperCase();
    if (accessCodes.map(c => c.toUpperCase()).includes(upperCaseCode)) {
        alert("Ce code existe déjà.");
        return;
    }
    const updatedCodes = [...accessCodes, upperCaseCode];
    onUpdateAccessCodes(updatedCodes);
    setNewCode('');
  };

  const handleEditCode = (indexToEdit: number) => {
      const oldCode = accessCodes[indexToEdit];
      const newCodeValue = prompt(`Modifier le code d'accès :`, oldCode);
      if (newCodeValue && newCodeValue.trim() !== '' && newCodeValue.trim().toUpperCase() !== oldCode) {
          const updatedCodes = [...accessCodes];
          updatedCodes[indexToEdit] = newCodeValue.trim().toUpperCase();
          onUpdateAccessCodes(updatedCodes);
      }
  };

  const handleDeleteCode = (indexToDelete: number) => {
      if (window.confirm(`Êtes-vous sûr de vouloir supprimer le code "${accessCodes[indexToDelete]}" ?`)) {
          const updatedCodes = accessCodes.filter((_, index) => index !== indexToDelete);
          onUpdateAccessCodes(updatedCodes);
      }
  };

  const uniquePlayers = useMemo(() => {
    const playerSet = new Set<string>();
    logs.forEach(log => {
      if (log.players) {
        playerSet.add(JSON.stringify([log.players.player1, log.players.player2].sort()));
      }
    });
    return Array.from(playerSet).map(str => JSON.parse(str));
  }, [logs]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-600">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Panneau d'administration</h1>
          <button onClick={onLogout} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Déconnexion</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Joueurs Enregistrés</h2>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
                        {uniquePlayers.length > 0 ? (
                            <ul className="space-y-2">
                                {uniquePlayers.map((playerPair, index) => (
                                    <li key={index} className="text-gray-800 dark:text-gray-200 p-2 bg-white dark:bg-gray-600 rounded">
                                        {playerPair[0]} & {playerPair[1]}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Aucun joueur enregistré.</p>
                        )}
                    </div>
                </div>
                 <div>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Gestion des Codes d'Accès</h2>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
                        {accessCodes.length > 0 ? (
                            <ul className="space-y-2">
                                {accessCodes.map((code, index) => (
                                    <li key={index} className="flex items-center justify-between text-gray-800 dark:text-gray-200 p-2 bg-white dark:bg-gray-600 rounded">
                                        <span className="font-mono">{code}</span>
                                        <div className="space-x-2">
                                            <button onClick={() => handleEditCode(index)} className="text-xs text-blue-500 hover:underline">Modifier</button>
                                            <button onClick={() => handleDeleteCode(index)} className="text-xs text-red-500 hover:underline">Supprimer</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-gray-500 dark:text-gray-400">Aucun code d'accès défini.</p>
                        )}
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <input 
                            type="text" 
                            value={newCode}
                            onChange={e => setNewCode(e.target.value)}
                            placeholder="Nouveau code"
                            className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-900"
                        />
                        <button onClick={handleAddCode} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm">Ajouter</button>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Journal des Sessions</h2>
                    <button onClick={handleClearLogs} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Vider le journal</button>
                </div>
                <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3">Joueurs / Code</th>
                        <th scope="col" className="px-6 py-3">Début</th>
                        <th scope="col" className="px-6 py-3">Fin</th>
                        <th scope="col" className="px-6 py-3">Cartes vues</th>
                    </tr>
                    </thead>
                    <tbody className="overflow-y-auto">
                    {logs.length > 0 ? (
                        logs.sort((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime()).map((log) => (
                        <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {log.players ? `${log.players.player1} & ${log.players.player2}` : log.accessCode}
                        </td>
                        <td className="px-6 py-4">
                            {new Date(log.loginTime).toLocaleString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                            {log.endTime ? new Date(log.endTime).toLocaleString('fr-FR') : 'En cours...'}
                        </td>
                        <td className="px-6 py-4 text-center">
                            {log.cardsViewed}
                        </td>
                        </tr>
                    ))) : (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                Aucune session enregistrée.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;