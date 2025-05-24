
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BulletinsInfoBannerProps {
  moisNom: string;
  annee: string;
}

const BulletinsInfoBanner: React.FC<BulletinsInfoBannerProps> = ({ moisNom, annee }) => {
  const navigate = useNavigate();
  
  const allerVersPreparationPaie = () => {
    navigate("/preparation-paie");
  };
  
  return (
    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4 flex justify-between items-center">
      <div>
        <h3 className="font-medium text-blue-800">Préparation de la paie - {moisNom} {annee}</h3>
        <p className="text-sm text-blue-600">
          Pour préparer et valider les éléments de paie avant génération des bulletins, utilisez l'interface de préparation.
        </p>
      </div>
      <Button 
        variant="outline" 
        className="border-blue-300 text-blue-700 hover:bg-blue-100"
        onClick={allerVersPreparationPaie}
      >
        <Edit className="mr-2 h-4 w-4" />
        Préparer la paie
      </Button>
    </div>
  );
};

export default BulletinsInfoBanner;
