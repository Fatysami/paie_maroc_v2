import React, { useState } from "react";
import EmployeLayout from "@/components/employe/EmployeLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download, FileText, Search, Filter, Calendar, FileArchive } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import BulletinDetail from "@/components/employe/paie/BulletinDetail";
import { useToast } from "@/hooks/use-toast";
import HistoriqueCompletTable from "@/components/employe/paie/HistoriqueCompletTable";
import ExportOptionsDialog, { ExportOptions } from "@/components/employe/paie/ExportOptionsDialog";
import { exporterBulletin, exporterBulletinsMultiples, telechargerFichier } from "@/components/employe/paie/BulletinExportService";

interface Bulletin {
  id: string;
  mois: string;
  annee: string;
  employeId: string;
  dateGeneration: string;
  datePaiement: string;
  montantBrut: number;
  montantNet: number;
  statut: "payé" | "en attente" | "erreur";
  elements: Array<{
    type: "cotisation" | "salaire" | "prime" | "avantage" | "retenue";
    nom: string;
    montant: number;
    tauxOuQuantite?: number;
  }>;
}

interface BulletinHistorique {
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

const BulletinsPaie = () => {
  const [selectedBulletinId, setSelectedBulletinId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [bulkExportDialogOpen, setBulkExportDialogOpen] = useState(false);
  const [selectedBulletinsForExport, setSelectedBulletinsForExport] = useState<string[]>([]);
  const { toast } = useToast();

  const bulletins: Bulletin[] = [
    { 
      id: "1", 
      mois: "Mai", 
      annee: "2023", 
      employeId: "emp-001",
      montantBrut: 12500, 
      montantNet: 9875.45, 
      dateGeneration: "31/05/2023", 
      datePaiement: "02/06/2023", 
      statut: "payé",
      elements: [
        { type: "salaire", nom: "Salaire de base", montant: 12500 },
        { type: "cotisation", nom: "CNSS", montant: 450, tauxOuQuantite: 3.6 },
        { type: "cotisation", nom: "AMO", montant: 250, tauxOuQuantite: 2.0 },
        { type: "cotisation", nom: "IR", montant: 1924.55, tauxOuQuantite: 15.4 }
      ]
    },
    { 
      id: "2", 
      mois: "Avril", 
      annee: "2023", 
      employeId: "emp-001",
      montantBrut: 12500, 
      montantNet: 9650.20, 
      dateGeneration: "30/04/2023", 
      datePaiement: "03/05/2023", 
      statut: "payé",
      elements: [
        { type: "salaire", nom: "Salaire de base", montant: 12500 },
        { type: "cotisation", nom: "CNSS", montant: 450, tauxOuQuantite: 3.6 },
        { type: "cotisation", nom: "AMO", montant: 250, tauxOuQuantite: 2.0 },
        { type: "cotisation", nom: "IR", montant: 2149.80, tauxOuQuantite: 17.2 }
      ]
    },
    { 
      id: "3", 
      mois: "Mars", 
      annee: "2023", 
      employeId: "emp-001",
      montantBrut: 12500, 
      montantNet: 9875.45, 
      dateGeneration: "31/03/2023", 
      datePaiement: "03/04/2023", 
      statut: "payé",
      elements: [
        { type: "salaire", nom: "Salaire de base", montant: 12500 },
        { type: "cotisation", nom: "CNSS", montant: 450, tauxOuQuantite: 3.6 },
        { type: "cotisation", nom: "AMO", montant: 250, tauxOuQuantite: 2.0 },
        { type: "cotisation", nom: "IR", montant: 1924.55, tauxOuQuantite: 15.4 }
      ]
    },
    { 
      id: "4", 
      mois: "Février", 
      annee: "2023", 
      employeId: "emp-001",
      montantBrut: 10000, 
      montantNet: 7925.30, 
      dateGeneration: "28/02/2023", 
      datePaiement: "03/03/2023", 
      statut: "payé",
      elements: [
        { type: "salaire", nom: "Salaire de base", montant: 10000 },
        { type: "cotisation", nom: "CNSS", montant: 400, tauxOuQuantite: 4.0 },
        { type: "cotisation", nom: "AMO", montant: 200, tauxOuQuantite: 2.0 },
        { type: "cotisation", nom: "IR", montant: 1474.70, tauxOuQuantite: 14.7 }
      ]
    },
    { 
      id: "5", 
      mois: "Janvier", 
      annee: "2023", 
      employeId: "emp-001",
      montantBrut: 10000, 
      montantNet: 7925.30, 
      dateGeneration: "31/01/2023", 
      datePaiement: "03/02/2023", 
      statut: "payé",
      elements: [
        { type: "salaire", nom: "Salaire de base", montant: 10000 },
        { type: "cotisation", nom: "CNSS", montant: 400, tauxOuQuantite: 4.0 },
        { type: "cotisation", nom: "AMO", montant: 200, tauxOuQuantite: 2.0 },
        { type: "cotisation", nom: "IR", montant: 1474.70, tauxOuQuantite: 14.7 }
      ]
    },
    { 
      id: "6", 
      mois: "Décembre", 
      annee: "2022", 
      employeId: "emp-001",
      montantBrut: 10000, 
      montantNet: 7925.30, 
      dateGeneration: "31/12/2022", 
      datePaiement: "03/01/2023", 
      statut: "payé",
      elements: [
        { type: "salaire", nom: "Salaire de base", montant: 10000 },
        { type: "cotisation", nom: "CNSS", montant: 400, tauxOuQuantite: 4.0 },
        { type: "cotisation", nom: "AMO", montant: 200, tauxOuQuantite: 2.0 },
        { type: "cotisation", nom: "IR", montant: 1474.70, tauxOuQuantite: 14.7 }
      ]
    }
  ];

  const [filters, setFilters] = useState({
    annee: "2023",
    mois: "all",
    recherche: ""
  });

  const annees = ["2023", "2022", "2021"];

  const filteredBulletins = bulletins.filter(bulletin => {
    if (filters.annee && bulletin.annee !== filters.annee) return false;
    
    if (filters.mois && filters.mois !== "all" && bulletin.mois.toLowerCase() !== filters.mois.toLowerCase()) return false;
    
    if (filters.recherche && !bulletin.mois.toLowerCase().includes(filters.recherche.toLowerCase())) return false;
    
    return true;
  });

  const handleViewBulletin = (id: string) => {
    setSelectedBulletinId(id);
    setIsDialogOpen(true);
  };

  const handleExportBulletin = (id: string) => {
    setSelectedBulletinId(id);
    setSelectedBulletinsForExport([id]);
    setExportDialogOpen(true);
  };

  const handleBulkExport = () => {
    setSelectedBulletinsForExport(filteredBulletins.map(b => b.id));
    setBulkExportDialogOpen(true);
  };

  const handleExportOptions = async (options: ExportOptions) => {
    if (selectedBulletinId) {
      const bulletin = bulletins.find(b => b.id === selectedBulletinId);
      if (!bulletin) return;

      toast({
        title: "Export en cours",
        description: `Export au format ${options.format.toUpperCase()} en cours...`,
      });

      try {
        const blob = await exporterBulletin(bulletin, options);
        const fileName = `bulletin-${bulletin.mois.toLowerCase()}-${bulletin.annee}.${options.format === 'excel' ? 'xlsx' : options.format}`;
        telechargerFichier(blob, fileName);

        toast({
          title: "Export terminé",
          description: "Le bulletin a été exporté avec succès.",
        });
      } catch (error) {
        toast({
          title: "Erreur d'export",
          description: "Une erreur s'est produite lors de l'export.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBulkExportOptions = async (options: ExportOptions) => {
    const selectedBulletins = bulletins.filter(b => 
      selectedBulletinsForExport.includes(b.id)
    );

    if (selectedBulletins.length === 0) return;

    toast({
      title: "Export en cours",
      description: `Export de ${selectedBulletins.length} bulletins en cours...`,
    });

    try {
      const blob = await exporterBulletinsMultiples(selectedBulletins, options);
      const fileName = options.format === 'pdf' 
        ? `bulletins-paie-${filters.annee}.zip` 
        : `bulletins-paie-${filters.annee}.${options.format === 'excel' ? 'xlsx' : options.format}`;
      
      telechargerFichier(blob, fileName);

      toast({
        title: "Export terminé",
        description: `${selectedBulletins.length} bulletins ont été exportés avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'export multiple.",
        variant: "destructive",
      });
    }
  };

  const getSelectedBulletin = () => {
    return bulletins.find(b => b.id === selectedBulletinId);
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "payé":
        return <Badge className="bg-green-500">Payé</Badge>;
      case "en attente":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">En attente</Badge>;
      case "erreur":
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const convertToHistoriqueFormat = (bulletin: Bulletin): BulletinHistorique => {
    return {
      id: bulletin.id,
      periode: {
        mois: bulletin.mois,
        annee: bulletin.annee
      },
      dateGeneration: bulletin.dateGeneration,
      datePaiement: bulletin.datePaiement,
      montantBrut: bulletin.montantBrut,
      montantNet: bulletin.montantNet,
      statut: bulletin.statut
    };
  };

  const historiqueComplet: BulletinHistorique[] = [
    ...bulletins.map(convertToHistoriqueFormat),
    {
      id: "7",
      periode: {
        mois: "Décembre",
        annee: "2022"
      },
      dateGeneration: "31/12/2022",
      datePaiement: "03/01/2023",
      montantBrut: 10000,
      montantNet: 7925.30,
      statut: "payé"
    },
    {
      id: "8",
      periode: {
        mois: "Novembre",
        annee: "2022"
      },
      dateGeneration: "30/11/2022",
      datePaiement: "03/12/2022",
      montantBrut: 10000,
      montantNet: 7925.30,
      statut: "payé"
    },
    {
      id: "9",
      periode: {
        mois: "Octobre",
        annee: "2022"
      },
      dateGeneration: "31/10/2022",
      datePaiement: "03/11/2022",
      montantBrut: 10000,
      montantNet: 7925.30,
      statut: "payé"
    },
    {
      id: "10",
      periode: {
        mois: "Décembre",
        annee: "2021"
      },
      dateGeneration: "31/12/2021",
      datePaiement: "03/01/2022",
      montantBrut: 9500,
      montantNet: 7520.15,
      statut: "payé"
    }
  ];

  return (
    <EmployeLayout title="Mes bulletins de paie">
      <div className="space-y-6">
        <Tabs defaultValue="bulletins" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bulletins">Bulletins récents</TabsTrigger>
            <TabsTrigger value="historique">Historique complet</TabsTrigger>
            <TabsTrigger value="analyse">Analyse salariale</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bulletins" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Rechercher un bulletin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="grid w-full sm:max-w-sm items-center gap-1.5">
                    <Select 
                      defaultValue={filters.annee}
                      onValueChange={(value) => setFilters({...filters, annee: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Année" />
                      </SelectTrigger>
                      <SelectContent>
                        {annees.map(annee => (
                          <SelectItem key={annee} value={annee}>{annee}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid w-full sm:max-w-sm items-center gap-1.5">
                    <Select 
                      value={filters.mois} 
                      onValueChange={(value) => setFilters({...filters, mois: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Mois (Tous)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les mois</SelectItem>
                        <SelectItem value="janvier">Janvier</SelectItem>
                        <SelectItem value="février">Février</SelectItem>
                        <SelectItem value="mars">Mars</SelectItem>
                        <SelectItem value="avril">Avril</SelectItem>
                        <SelectItem value="mai">Mai</SelectItem>
                        <SelectItem value="juin">Juin</SelectItem>
                        <SelectItem value="juillet">Juillet</SelectItem>
                        <SelectItem value="août">Août</SelectItem>
                        <SelectItem value="septembre">Septembre</SelectItem>
                        <SelectItem value="octobre">Octobre</SelectItem>
                        <SelectItem value="novembre">Novembre</SelectItem>
                        <SelectItem value="décembre">Décembre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="relative w-full flex-1">
                    <Input 
                      type="text" 
                      placeholder="Rechercher..." 
                      className="pl-10" 
                      value={filters.recherche}
                      onChange={(e) => setFilters({...filters, recherche: e.target.value})}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">Période</th>
                      <th className="py-3 px-4 text-left font-medium">Montant brut</th>
                      <th className="py-3 px-4 text-left font-medium">Montant net</th>
                      <th className="py-3 px-4 text-left font-medium">Date génération</th>
                      <th className="py-3 px-4 text-left font-medium">Date paiement</th>
                      <th className="py-3 px-4 text-left font-medium">Statut</th>
                      <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBulletins.length > 0 ? (
                      filteredBulletins.map((bulletin) => (
                        <tr key={bulletin.id} className="border-t hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-medium">{bulletin.mois} {bulletin.annee}</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div>{bulletin.montantBrut.toLocaleString('fr-FR')} MAD</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-medium">{bulletin.montantNet.toLocaleString('fr-FR')} MAD</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div>{bulletin.dateGeneration}</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div>{bulletin.datePaiement}</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {getStatutBadge(bulletin.statut)}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewBulletin(bulletin.id)}>
                                <Eye className="h-4 w-4 mr-1" /> Voir
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleExportBulletin(bulletin.id)}>
                                <FileArchive className="h-4 w-4 mr-1" /> Exporter
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-4 px-4 text-center text-muted-foreground">
                          Aucun bulletin ne correspond à vos critères de recherche
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end mb-2 gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleBulkExport}
              >
                <FileArchive className="h-4 w-4" /> Exporter tous
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Affichage de {filteredBulletins.length} bulletin(s) sur {bulletins.length}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={filters.annee === "2023"}>
                  Précédent
                </Button>
                <Button variant="outline" disabled={filters.annee === "2021"}>
                  Suivant
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="historique" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique complet des bulletins</CardTitle>
              </CardHeader>
              <CardContent>
                <HistoriqueCompletTable 
                  bulletins={historiqueComplet}
                  onViewBulletin={handleViewBulletin}
                  onExportBulletin={handleExportBulletin}
                  getStatutBadge={getStatutBadge}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analyse" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Salaire moyen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">9,230.25 MAD</div>
                  <p className="text-sm text-muted-foreground">sur les 6 derniers mois</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Total perçu en 2023</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">43,251.70 MAD</div>
                  <p className="text-sm text-muted-foreground">pour 5 mois travaillés</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">IR annuel estimé</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,355.45 MAD</div>
                  <p className="text-sm text-muted-foreground">projection annuelle</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Évolution de votre rémunération</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
                  <div className="text-center p-6">
                    <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="font-medium text-lg mb-2">Graphique d'évolution</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Le graphique d'évolution de votre rémunération sera disponible lorsque vous aurez au moins 6 mois d'historique.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Détail du bulletin de paie</DialogTitle>
              <DialogDescription>
                Vous pouvez visualiser, télécharger ou imprimer ce bulletin
              </DialogDescription>
            </DialogHeader>
            <BulletinDetail bulletin={getSelectedBulletin()} />
          </DialogContent>
        </Dialog>
        
        <ExportOptionsDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          onExport={handleExportOptions}
          bulletinIds={selectedBulletinsForExport}
          isBulkExport={false}
        />
        
        <ExportOptionsDialog
          open={bulkExportDialogOpen}
          onOpenChange={setBulkExportDialogOpen}
          onExport={handleBulkExportOptions}
          bulletinIds={selectedBulletinsForExport}
          isBulkExport={true}
        />
      </div>
    </EmployeLayout>
  );
};

export default BulletinsPaie;
