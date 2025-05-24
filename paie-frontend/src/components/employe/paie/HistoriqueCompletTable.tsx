import React from "react";
import { Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface BulletinHistorique {
  id: string;
  periode: {
    mois: string;
    annee: string;
  };
  dateGeneration: string;
  datePaiement: string;
  montantBrut: number;
  montantNet: number;
  statut: "payé" | "en attente" | "erreur";
}

interface HistoriqueCompletTableProps {
  bulletins: BulletinHistorique[];
  onViewBulletin: (bulletinId: string) => void;
  onExportBulletin: (bulletinId: string) => void;
  getStatutBadge: (statut: string) => React.ReactNode;
}

const HistoriqueCompletTable: React.FC<HistoriqueCompletTableProps> = ({
  bulletins,
  onViewBulletin,
  onExportBulletin,
  getStatutBadge,
}) => {
  // Regrouper les bulletins par année
  const bulletinsParAnnee = bulletins.reduce<Record<string, BulletinHistorique[]>>(
    (acc, bulletin) => {
      const annee = bulletin.periode.annee;
      if (!acc[annee]) {
        acc[annee] = [];
      }
      acc[annee].push(bulletin);
      return acc;
    },
    {}
  );

  // Trier les années par ordre décroissant
  const annees = Object.keys(bulletinsParAnnee).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="space-y-8">
      {annees.map((annee) => (
        <div key={annee} className="space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">{annee}</h3>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Période</TableHead>
                  <TableHead>Montant brut</TableHead>
                  <TableHead>Montant net</TableHead>
                  <TableHead>Date génération</TableHead>
                  <TableHead>Date paiement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bulletinsParAnnee[annee]
                  .sort((a, b) => {
                    // Correspond les mois français à un numéro
                    const moisOrdre: Record<string, number> = {
                      "Janvier": 1, "Février": 2, "Mars": 3, "Avril": 4,
                      "Mai": 5, "Juin": 6, "Juillet": 7, "Août": 8,
                      "Septembre": 9, "Octobre": 10, "Novembre": 11, "Décembre": 12
                    };
                    // Tri décroissant par mois
                    return moisOrdre[b.periode.mois] - moisOrdre[a.periode.mois];
                  })
                  .map((bulletin) => (
                    <TableRow key={bulletin.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">{bulletin.periode.mois}</div>
                      </TableCell>
                      <TableCell>
                        {bulletin.montantBrut.toLocaleString('fr-FR')} MAD
                      </TableCell>
                      <TableCell className="font-medium">
                        {bulletin.montantNet.toLocaleString('fr-FR')} MAD
                      </TableCell>
                      <TableCell>{bulletin.dateGeneration}</TableCell>
                      <TableCell>{bulletin.datePaiement}</TableCell>
                      <TableCell>{getStatutBadge(bulletin.statut)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewBulletin(bulletin.id)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onExportBulletin(bulletin.id)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoriqueCompletTable;
