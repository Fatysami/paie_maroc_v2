
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, SendHorizonal, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EtatPaie {
  id: string;
  nom: string;
  description: string;
  periodes: string[];
  dernierTelechargement: string;
}

interface EtatsDeclarationsTabProps {
  etatsPaie: EtatPaie[];
}

const EtatsDeclarationsTab: React.FC<EtatsDeclarationsTabProps> = ({ etatsPaie }) => {
  const { toast } = useToast();

  // Extraire le mois et l'année à partir de la période
  const getPeriodeLabels = (periodeStr: string) => {
    const [annee, mois] = periodeStr.split('-');
    const moisNoms = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    return {
      moisNom: moisNoms[parseInt(mois) - 1],
      annee
    };
  };

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

  // Télécharger un état de paie
  const telechargerEtatPaie = async (etatId: string) => {
    toast({
      title: "Téléchargement en cours",
      description: "L'état de paie est en cours de téléchargement..."
    });

    // Simuler le téléchargement
    setTimeout(() => {
      toast({
        title: "Téléchargement terminé",
        description: "L'état de paie a été téléchargé avec succès."
      });
    }, 1800);
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">États de paie et déclarations sociales/fiscales</h3>
        <Button 
          variant="outline" 
          size="sm"
        >
          <FileCheck className="mr-2 h-4 w-4" />
          Générer tous les états
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du document</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Périodes disponibles</TableHead>
              <TableHead>Dernier téléchargement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {etatsPaie.map((etat) => (
              <TableRow key={etat.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell className="font-medium">
                  {etat.nom}
                </TableCell>
                <TableCell>
                  {etat.description}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {etat.periodes.map((periode) => {
                      const { moisNom, annee } = getPeriodeLabels(periode);
                      return (
                        <Badge key={periode} variant="outline" className="text-xs">
                          {moisNom} {annee}
                        </Badge>
                      );
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  {formatDate(etat.dernierTelechargement)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => telechargerEtatPaie(etat.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                    >
                      <SendHorizonal className="h-4 w-4" />
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

export default EtatsDeclarationsTab;
