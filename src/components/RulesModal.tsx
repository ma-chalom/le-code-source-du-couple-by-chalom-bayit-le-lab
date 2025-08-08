import React from 'react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b dark:border-gray-600">
             <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">Règles du Jeu</h2>
        </div>
       
        <div className="p-6 space-y-6 overflow-y-auto text-gray-700 dark:text-gray-300">
            <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-fuchsia-500">Le Code Source du Couple</h3>
                <p className="italic">Le Jeu pour faire une mise à jour de votre relation !</p>
                <p className="mt-4">
                    Bienvenue dans Chalom Bayit Le LAB ! Votre couple est un logiciel complexe. Pour qu'il fonctionne à merveille, il faut le mettre à jour, régulièrement réviser son "code source". Ce jeu est votre outil Agile pour une connexion optimale.
                </p>
            </div>

            <div className="border-t dark:border-gray-600 pt-4">
                <h3 className="text-lg font-semibold mb-3 text-cyan-500">Comment Jouer :</h3>
                <dl className="space-y-4">
                    <div>
                        <dt className="font-bold">1. Préparation :</dt>
                        <dd className="pl-5 list-item list-inside">Installez-vous confortablement.</dd>
                        <dd className="pl-5 list-item list-inside">Sans distraction !</dd>
                    </div>
                    <div>
                        <dt className="font-bold">2. La Pioche :</dt>
                        <dd className="pl-5 list-item list-inside">À tour de rôle, piochez une carte. Il y a 3 thèmes : NousDeux (Découverte), Confidences (Profondeur) et Avenir (Projet).</dd>
                    </div>
                    <div>
                        <dt className="font-bold">3. L'Exécution du Code :</dt>
                        <dd className="pl-5 list-item list-inside">Le joueur qui pioche lit la question à voix haute à son partenaire.</dd>
                        <dd className="pl-5 list-item list-inside">Le partenaire répond honnêtement et avec bienveillance.</dd>
                        <dd className="pl-5 list-item list-inside">Écoutez activement : Ne coupez pas la parole, laissez l'autre s'exprimer pleinement.</dd>
                    </div>
                     <div>
                        <dt className="font-bold">4. Le Débrief (Facultatif) :</dt>
                        <dd className="pl-5 list-item list-inside">Le joueur qui a posé la question peut partager sa propre réponse, poser une question de suivi ou simplement dire "Merci pour ton partage".</dd>
                    </div>
                </dl>
            </div>
            
            <div className="border-t dark:border-gray-600 pt-4">
                 <h3 className="text-lg font-semibold mb-3 text-yellow-500">Conseils pour un "Code" impeccable :</h3>
                 <ul className="space-y-2 list-disc list-inside">
                     <li><span className="font-bold">Soyez Agile !</span> Adaptez le jeu à votre envie : une seule question, 10 minutes, ou une soirée entière. Si une question est trop intense, passez et revenez-y plus tard.</li>
                     <li><span className="font-bold">Zéro Bug = Zéro Jugement :</span> Créez un espace de confiance absolue. Tout est permis sauf le jugement.</li>
                     <li><span className="font-bold">Mises à Jour Régulières :</span> Jouez souvent ! Réviser, c'est grandir ensemble et éviter les "bugs" relationnels.</li>
                 </ul>
            </div>
        </div>

        <div className="p-4 border-t dark:border-gray-600 text-center">
            <button onClick={onClose} className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-8 rounded-lg transition-colors">
                Fermer
            </button>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;