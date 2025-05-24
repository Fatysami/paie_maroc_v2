
import React from "react";
import { BulletinElement } from "./types/bulletinTypes";
import { getTypeElementColor } from "./utils/bulletinUtils";

type BulletinSalaryTableProps = {
  elements: BulletinElement[];
  montantNet: number;
  montantBrut: number;
  calculateTotalCotisations: () => number;
};

const BulletinSalaryTable = ({ 
  elements, 
  montantNet, 
  montantBrut, 
  calculateTotalCotisations 
}: BulletinSalaryTableProps) => {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="py-2 px-4 text-left font-medium">Désignation</th>
            <th className="py-2 px-4 text-right font-medium">Base / Taux</th>
            <th className="py-2 px-4 text-right font-medium">Montant</th>
          </tr>
        </thead>
        <tbody>
          {elements.map((element, index) => (
            <tr key={index} className="border-t hover:bg-muted/50">
              <td className={`py-2 px-4 ${getTypeElementColor(element.type)}`}>
                {element.nom}
              </td>
              <td className="py-2 px-4 text-right">
                {element.type === "prime" && element.tauxOuQuantite && element.tauxOuQuantite > 1 
                  ? `${element.tauxOuQuantite}%` 
                  : element.type === "cotisation" 
                    ? `${element.tauxOuQuantite}%` 
                    : "-"}
              </td>
              <td className={`py-2 px-4 text-right ${element.montant < 0 ? "text-red-600" : ""}`}>
                {element.montant.toLocaleString('fr-FR')} MAD
              </td>
            </tr>
          ))}
          <tr className="bg-muted/20 font-medium">
            <td className="py-2 px-4">Total</td>
            <td className="py-2 px-4"></td>
            <td className="py-2 px-4 text-right">
              {montantNet.toLocaleString('fr-FR')} MAD
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BulletinSalaryTable;
