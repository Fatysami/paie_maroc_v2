
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ContratInfoCardProps {
  poste: string;
  departement: string;
  salaireBase: number;
  dateEmbauche?: string;
  typeContrat: string;
  onEditClick: () => void;
  adresse?: string;
  situationFamiliale?: string;
  manager?: string;
}

const ContratInfoCard: React.FC<ContratInfoCardProps> = ({
  poste,
  departement,
  salaireBase,
  dateEmbauche,
  typeContrat,
  onEditClick,
  adresse,
  situationFamiliale,
  manager
}) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Non spécifiée";
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case "CDI": return "Contrat à Durée Indéterminée";
      case "CDD": return "Contrat à Durée Déterminée";
      case "Intérim": return "Intérim";
      case "Freelance": return "Freelance";
      case "Stage": return "Stage";
      default: return type;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Informations contractuelles</CardTitle>
          <CardDescription>
            Paramètres du contrat de l'employé
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          onClick={onEditClick}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" /> Modifier contrat
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Poste</p>
            <p className="font-medium">{poste || "Non spécifié"}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Salaire de base</p>
            <p className="font-medium">{salaireBase?.toLocaleString() || "0"} MAD</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Département</p>
            <p className="font-medium">{departement || "Non spécifié"}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Date d'embauche</p>
            <p className="font-medium">{formatDate(dateEmbauche)}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Type de contrat</p>
            <p className="font-medium">{getContractTypeLabel(typeContrat)}</p>
          </div>

          {adresse && (
            <div>
              <p className="text-sm text-muted-foreground">Adresse</p>
              <p className="font-medium">{adresse}</p>
            </div>
          )}
          
          {situationFamiliale && (
            <div>
              <p className="text-sm text-muted-foreground">Situation familiale</p>
              <p className="font-medium">{situationFamiliale}</p>
            </div>
          )}
          
          {manager && (
            <div>
              <p className="text-sm text-muted-foreground">Manager</p>
              <p className="font-medium">{manager}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContratInfoCard;
