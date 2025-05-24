
import React from 'react';
import { EntreeHistorique } from './types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HistoriqueItemProps {
  item: EntreeHistorique;
}

const HistoriqueItem: React.FC<HistoriqueItemProps> = ({ item }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold">
            {item.employeNom ? `${item.employeNom} (${item.employeMatricule})` : 'Système'}
          </p>
          <p className="text-sm text-gray-500">
            {format(new Date(item.dateHeure), 'dd MMMM yyyy à HH:mm', { locale: fr })}
          </p>
        </div>
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
          {item.typeModification}
        </span>
      </div>
      
      <p className="text-sm mb-1">
        <span className="font-medium">{item.champModifie}</span> modifié par {item.utilisateur}
      </p>
      
      <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
        <div className="bg-red-50 p-2 rounded">
          <p className="text-xs text-gray-500">Ancienne valeur</p>
          <p className="font-mono">{item.ancienneValeur}</p>
        </div>
        <div className="bg-green-50 p-2 rounded">
          <p className="text-xs text-gray-500">Nouvelle valeur</p>
          <p className="font-mono">{item.nouvelleValeur}</p>
        </div>
      </div>
      
      {item.commentaire && (
        <div className="mt-2 text-sm italic text-gray-600">
          "{item.commentaire}"
        </div>
      )}
    </div>
  );
};

export default HistoriqueItem;
