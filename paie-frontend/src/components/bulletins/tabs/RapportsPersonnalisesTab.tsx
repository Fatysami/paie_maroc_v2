
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Edit, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Rapport {
  id: string;
  nom: string;
  description: string;
  format: string;
  dernierTelechargement: string;
}

interface RapportsPersonnalisesTabProps {
  rapports: Rapport[];
}

const RapportsPersonnalisesTab: React.FC<RapportsPersonnalisesTabProps> = ({ rapports }) => {
  const { toast } = useToast();

  // Formatter la date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Télécharger un rapport personnalisé
  const telechargerRapport = async (rapportId: string) => {
    toast({
      title: "Téléchargement en cours",
      description: "Le rapport est en cours de téléchargement..."
    });

    // Simuler le téléchargement
    setTimeout(() => {
      toast({
        title: "Téléchargement terminé",
        description: "Le rapport a été téléchargé avec succès."
      });
    }, 1500);
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Rapports personnalisés</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau rapport
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du rapport</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Dernier téléchargement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rapports.map((rapport) => (
              <TableRow key={rapport.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell className="font-medium">
                  {rapport.nom}
                </TableCell>
                <TableCell>
                  {rapport.description}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="uppercase">
                    {rapport.format}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDate(rapport.dernierTelechargement)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => telechargerRapport(rapport.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default RapportsPersonnalisesTab;
