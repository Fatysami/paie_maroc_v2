
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { BulletinData } from "./types/bulletinTypes";

type BulletinPreviewProps = {
  bulletinData: BulletinData;
  onClose: () => void;
  onPrint: () => void;
  onDownload: () => void;
};

const BulletinPreview = ({ 
  bulletinData, 
  onClose, 
  onPrint, 
  onDownload 
}: BulletinPreviewProps) => {
  const calculateTotalCotisations = () => {
    if (!bulletinData || !bulletinData.elements) return 0;
    
    return bulletinData.elements
      .filter(el => el.type === "cotisation")
      .reduce((acc, el) => acc + el.montant, 0);
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-white p-8 rounded-md shadow-lg max-w-3xl mx-auto print:shadow-none">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold">ENTREPRISE EXEMPLE SARL</h1>
            <p className="text-sm text-gray-600">RC: 123456 • IF: 40567890 • CNSS: 1234567</p>
            <p className="text-sm text-gray-600">123 Boulevard Mohammed V, Casablanca</p>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-lg">BULLETIN DE PAIE</h2>
            <p className="text-sm">Période: {bulletinData.mois} {bulletinData.annee}</p>
            <p className="text-sm">Date d'édition: {bulletinData.dateGeneration}</p>
          </div>
        </div>

        <div className="border-2 border-gray-300 rounded-md p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Nom:</span> ALAMI Mohammed</p>
              <p><span className="font-medium">Matricule:</span> EMP001</p>
              <p><span className="font-medium">CIN:</span> AB123456</p>
              <p><span className="font-medium">Poste:</span> Développeur Senior</p>
            </div>
            <div>
              <p><span className="font-medium">Date d'embauche:</span> 01/01/2020</p>
              <p><span className="font-medium">Département:</span> Informatique</p>
              <p><span className="font-medium">N° CNSS:</span> 123456789</p>
              <p><span className="font-medium">N° AMO:</span> AMO123456</p>
            </div>
          </div>
        </div>

        <table className="w-full mb-6 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Désignation</th>
              <th className="border border-gray-300 p-2 text-right">Base / Taux</th>
              <th className="border border-gray-300 p-2 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {bulletinData.elements.map((element, index) => (
              <tr key={index} className={element.type === "cotisation" || element.type === "retenue" ? "bg-gray-50" : ""}>
                <td className="border border-gray-300 p-2">{element.nom}</td>
                <td className="border border-gray-300 p-2 text-right">
                  {element.type === "prime" && element.tauxOuQuantite && element.tauxOuQuantite > 1 
                    ? `${element.tauxOuQuantite}%` 
                    : element.type === "cotisation" 
                      ? `${element.tauxOuQuantite}%` 
                      : "-"}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {element.montant.toLocaleString('fr-FR')} MAD
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-200 font-bold">
              <td className="border border-gray-300 p-2">TOTAL BRUT</td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2 text-right">
                {bulletinData.montantBrut.toLocaleString('fr-FR')} MAD
              </td>
            </tr>
            <tr className="bg-gray-200 font-bold">
              <td className="border border-gray-300 p-2">TOTAL COTISATIONS</td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2 text-right">
                {calculateTotalCotisations().toLocaleString('fr-FR')} MAD
              </td>
            </tr>
            <tr className="bg-gray-800 text-white font-bold">
              <td className="border border-gray-900 p-2">NET À PAYER</td>
              <td className="border border-gray-900 p-2"></td>
              <td className="border border-gray-900 p-2 text-right">
                {bulletinData.montantNet.toLocaleString('fr-FR')} MAD
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="flex justify-between mb-6">
          <div className="w-1/2">
            <p className="font-medium mb-2">Mode de paiement:</p>
            <p>Virement bancaire</p>
            <p>Banque: BMCE Bank</p>
            <p>RIB: 123456789012345678901234</p>
          </div>
          <div className="w-1/2 text-right">
            <p className="font-medium mb-2">Cumuls année {bulletinData.annee}:</p>
            <p>Brut: 62,500.00 MAD</p>
            <p>Cotisations: 12,450.00 MAD</p>
            <p>Net: 50,050.00 MAD</p>
          </div>
        </div>

        <div className="text-xs text-gray-500 border-t pt-4">
          <p>Ce bulletin de paie doit être conservé sans limitation de durée (Art. 370 du Code du travail marocain).</p>
          <p>Pour toute réclamation concernant ce bulletin, veuillez vous adresser au service RH dans un délai de 15 jours.</p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onClose}>
          Retour au détail
        </Button>
        <Button onClick={onPrint}>
          <Printer className="mr-2 h-4 w-4" /> Imprimer
        </Button>
        <Button onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" /> Télécharger PDF
        </Button>
      </div>
    </div>
  );
};

export default BulletinPreview;
