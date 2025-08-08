import React from 'react';
import { CardData, Theme } from '../types';

interface CardProps {
  card: CardData | null;
  isFlipped: boolean;
}

export const GameLogo = () => (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <img src="/verso-carte.png" alt="Dos de la carte" className="w-full h-full object-cover" />
    </div>
);

const themeColors: { [key in Theme]: { bg: string; text: string; border: string } } = {
  [Theme.NousDeux]: { bg: 'bg-cyan-500', text: 'text-white', border: 'border-cyan-500' },
  [Theme.Confidences]: { bg: 'bg-fuchsia-500', text: 'text-white', border: 'border-fuchsia-500' },
  [Theme.Avenir]: { bg: 'bg-yellow-600', text: 'text-white', border: 'border-yellow-600' },
};


const Card: React.FC<CardProps> = ({ card, isFlipped }) => {
  const cardColor = card ? themeColors[card.theme] : themeColors[Theme.NousDeux];
  
  return (
    <div className="w-full max-w-sm h-96 sm:h-[480px] perspective">
      <div
        className={`relative w-full h-full transition-transform duration-700 preserve-3d rounded-2xl shadow-2xl ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full backface-hidden bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center border-4 border-yellow-500">
            <img src="/verso-carte.png" alt="Dos de la carte" className="w-full h-full object-cover" />
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full backface-hidden [transform:rotateY(180deg)] bg-white dark:bg-gray-800 rounded-2xl flex flex-col justify-between overflow-hidden">
            {card ? (
                <>
                    <div className="p-6 flex-grow flex flex-col justify-center items-center text-center">
                        <img src="/logo.png" alt="Logo" className="h-16 mb-8"/>
                        <p className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-800 dark:text-gray-100">
                            {card.question}
                        </p>
                    </div>
                    <div className={`w-full p-4 text-center ${cardColor.bg}`}>
                        <p className={`text-xl font-bold ${cardColor.text}`}>
                            {card.theme}
                        </p>
                    </div>
                </>
            ) : (
                <div className="p-6 flex justify-center items-center">
                    <p className="text-gray-500">Le paquet est vide !</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Card;