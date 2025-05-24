
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BulletinsHeaderProps {
  periodeSelectionne: string;
}

const BulletinsHeader: React.FC<BulletinsHeaderProps> = ({ periodeSelectionne }) => {
  const navigate = useNavigate();
  
  const allerVersPreparationPaie = () => {
    navigate("/preparation-paie", { state: { periode: periodeSelectionne } });
  };
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Génération des bulletins de paie</h1>
      <div className="flex space-x-2">
        <Button onClick={allerVersPreparationPaie} className="gap-2">
          <Edit size={16} />
          Préparer la paie du mois
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default BulletinsHeader;
