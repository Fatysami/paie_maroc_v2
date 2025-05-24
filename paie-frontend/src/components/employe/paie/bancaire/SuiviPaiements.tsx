
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, Eye, Calendar, Building, Check, AlertTriangle, FileDown, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { formaterRIB } from "../utils/bancaireUtils";

// Données de démonstration pour l'historique des fichiers de virement
const mockFichiersVirement = [
  {
    id: "vir-1",
    nom: "virement_mai_2023.cfv",
    format: "CFV",
    banque: "Attijariwafa Bank",
    dateGeneration: "31/05/2023",
    montantTotal: 45500.75,
    nombreEmployes: 4,
    statut: "validé",
    genereParUserId: "user-1",
    genereParUserNom: "Admin RH",
    paiements: [
      {
        id: "paie-1",
        employeId: "emp-001",
        nom: "ALAMI Mohammed",
        matricule: "EMP-001",
        banque: "Attijariwafa Bank",
        rib: "225 810 0123456789012345",
        montant: 9875.45,
        motif: "Salaire Mai 2023",
        reference: "MAI23-001",
        statut: "payé",
        datePaiement: "02/06/2023",
        bulletinId: "1",
        mois: "Mai",
        annee: "2023",
        dateGeneration: "31/05/2023"
      },
      {
        id: "paie-4",
        employeId: "emp-004",
        nom: "TAZI Ahmed",
        matricule: "EMP-004",
        banque: "Attijariwafa Bank",
        rib: "225 810 9876543210987654",
        montant: 16875.50,
        motif: "Salaire Mai 2023",
        reference: "MAI23-004",
        statut: "payé",
        datePaiement: "02/06/2023",
        bulletinId: "4",
        mois: "Mai",
        annee: "2023",
        dateGeneration: "31/05/2023"
      },
      {
        id: "paie-6",
        employeId: "emp-006",
        nom: "BENNANI Younes",
        matricule: "EMP-006",
        banque: "Attijariwafa Bank",
        rib: "225 810 3456789012345678",
        montant: 18750.80,
        motif: "Salaire Mai 2023",
        reference: "MAI23-006",
        statut: "payé",
        datePaiement: "02/06/2023",
        bulletinId: "6",
        mois: "Mai",
        annee: "2023",
        dateGeneration: "31/05/2023"
      }
    ]
  },
  {
    id: "vir-2",
    nom: "virement_mai_2023_bmce.csv",
    format: "CSV",
    banque: "BMCE Bank",
    dateGeneration: "31/05/2023",
    montantTotal: 6850.20,
    nombreEmployes: 1,
    statut: "validé",
    genereParUserId: "user-1",
    genereParUserNom: "Admin RH",
    paiements: [
      {
        id: "paie-2",
        employeId: "emp-002",
        nom: "BENANI Karim",
        matricule: "EMP-002",
        banque: "BMCE Bank",
        rib: "190 780 0123456789012345",
        montant: 6850.20,
        motif: "Salaire Mai 2023",
        reference: "MAI23-002",
        statut: "payé",
        datePaiement: "02/06/2023",
        bulletinId: "2",
        mois: "Mai",
        annee: "2023",
        dateGeneration: "31/05/2023"
      }
    ]
  },
  {
    id: "vir-3",
    nom: "virement_mai_2023_cih.csv",
    format: "CSV",
    banque: "CIH Bank",
    dateGeneration: "31/05/2023",
    montantTotal: 14500.75,
    nombreEmployes: 1,
    statut: "validé",
    genereParUserId: "user-1",
    genereParUserNom: "Admin RH",
    paiements: [
      {
        id: "paie-3",
        employeId: "emp-003",
        nom: "IDRISSI Sanae",
        matricule: "EMP-003",
        banque: "CIH Bank",
        rib: "230 700 0123456789012345",
        montant: 14500.75,
        motif: "Salaire Mai 2023",
        reference: "MAI23-003",
        statut: "payé",
        datePaiement: "02/06/2023",
        bulletinId: "3",
        mois: "Mai",
        annee: "2023",
        dateGeneration: "31/05/2023"
      }
    ]
  },
  {
    id: "vir-4",
    nom: "virement_avril_2023.cfv",
    format: "CFV",
    banque: "Attijariwafa Bank",
    dateGeneration: "30/04/2023",
    montantTotal: 42800.35,
    nombreEmployes: 4,
    statut: "validé",
    genereParUserId: "user-1",
    genereParUserNom: "Admin RH",
    paiements: [
      {
        id: "paie-10",
        employeId: "emp-001",
        nom: "ALAMI Mohammed",
        matricule: "EMP-001",
        banque: "Attijariwafa Bank",
        rib: "225 810 0123456789012345",
        montant: 9875.45,
        motif: "Salaire Avril 2023",
        reference: "AVR23-001",
        statut: "payé",
        datePaiement: "03/05/2023",
        bulletinId: "10",
        mois: "Avril",
        annee: "2023",
        dateGeneration: "30/04/2023"
      }
      // ... autres paiements inclus dans ce fichier
    ]
  },
  {
    id: "vir-5",
    nom: "virement_juin_2023.cfv",
    format: "CFV",
    banque: "Attijariwafa Bank",
    dateGeneration: "30/06/2023",
    montantTotal: 47820.50,
    nombreEmployes: 5,
    statut: "en_attente",
    genereParUserId: "user-1",
    genereParUserNom: "Admin RH",
    paiements: [
      {
        id: "paie-20",
        employeId: "emp-001",
        nom: "ALAMI Mohammed",
        matricule: "EMP-001",
        banque: "Attijariwafa Bank",
        rib: "225 810 0123456789012345",
        montant: 9875.45,
        motif: "Salaire Juin 2023",
        reference: "JUN23-001",
        statut: "en_attente",
        mois: "Juin",
        annee: "2023",
        dateGeneration: "30/06/2023"
      }
      // ... autres paiements inclus dans ce fichier
    ]
  }
];

const SuiviPaiements = () => {
  const { toast } = useToast();
  
  // États pour les filtres
  const [filtres, setFiltres] = useState({
    mois: "Tous",
    annee: "2023",
    banque: "Toutes",
    statut: "Tous"
  });
  
  const [recherche, setRecherche] = useState("");
  const [fichierSelectionne, setFichierSelectionne] = useState<any | null>(null);
  const [detailsOuverts, setDetailsOuverts] = useState(false);
  
  // Appliquer les filtres aux fichiers de virement
  const fichiersFiltres = mockFichiersVirement.filter(fichier => {
    // Filtre par mois
    if (filtres.mois !== "Tous") {
      const moisFichier = fichier.paiements[0]?.mois;
      if (moisFichier !== filtres.mois) return false;
    }
    
    // Filtre par année
    if (filtres.annee !== "Tous") {
      const anneeFichier = fichier.paiements[0]?.annee;
      if (anneeFichier !== filtres.annee) return false;
    }
    
    // Filtre par banque
    if (filtres.banque !== "Toutes" && fichier.banque !== filtres.banque) {
      return false;
    }
    
    // Filtre par statut
    if (filtres.statut !== "Tous" && fichier.statut !== filtres.statut) {
      return false;
    }
    
    // Filtre par recherche
    if (recherche && !fichier.nom.toLowerCase().includes(recherche.toLowerCase()) && 
        !fichier.paiements.some(p => p.nom.toLowerCase().includes(recherche.toLowerCase()))) {
      return false;
    }
    
    return true;
  });
  
  // Fonction pour afficher les détails d'un fichier
  const handleVoirDetails = (fichier: any) => {
    setFichierSelectionne(fichier);
    setDetailsOuverts(true);
  };
  
  // Fonction pour télécharger à nouveau un fichier
  const handleTelechargerFichier = (fichier: any) => {
    toast({
      title: "Téléchargement du fichier",
      description: `Le fichier ${fichier.nom} est en cours de téléchargement.`
    });
  };
  
  // Fonction pour marquer un paiement comme effectué
  const handleMarquerPaiementEffectue = (paiementId: string) => {
    // Dans un cas réel, mise à jour via API
    toast({
      title: "Paiement mis à jour",
      description: "Le statut du paiement a été mis à jour avec succès."
    });
  };
  
  // Fonction pour marquer tous les paiements comme effectués
  const handleMarquerTousPaiementsEffectues = (fichier: any) => {
    toast({
      title: "Paiements mis à jour",
      description: `Tous les paiements du fichier ${fichier.nom} ont été marqués comme effectués.`
    });
  };
  
  // Classe CSS pour le badge de statut
  const getStatutBadgeClass = (statut: string) => {
    switch (statut) {
      case "payé":
      case "validé":
        return "bg-green-500";
      case "en_attente":
        return "text-yellow-600 border-yellow-600 variant-outline";
      case "rejeté":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  // Icône pour le statut
  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "payé":
      case "validé":
        return <Check className="h-3.5 w-3.5 mr-1" />;
      case "en_attente":
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case "rejeté":
        return <AlertTriangle className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Suivi des paiements salariaux</CardTitle>
        <CardDescription>
          Suivez l'état d'avancement des virements bancaires et marquez-les comme effectués
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="col-span-1 lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un fichier ou un employé..." 
                className="pl-10"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Select
              value={filtres.mois}
              onValueChange={(value) => setFiltres({...filtres, mois: value})}
            >
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tous les mois" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les mois</SelectItem>
                <SelectItem value="Janvier">Janvier</SelectItem>
                <SelectItem value="Février">Février</SelectItem>
                <SelectItem value="Mars">Mars</SelectItem>
                <SelectItem value="Avril">Avril</SelectItem>
                <SelectItem value="Mai">Mai</SelectItem>
                <SelectItem value="Juin">Juin</SelectItem>
                <SelectItem value="Juillet">Juillet</SelectItem>
                <SelectItem value="Août">Août</SelectItem>
                <SelectItem value="Septembre">Septembre</SelectItem>
                <SelectItem value="Octobre">Octobre</SelectItem>
                <SelectItem value="Novembre">Novembre</SelectItem>
                <SelectItem value="Décembre">Décembre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select
              value={filtres.annee}
              onValueChange={(value) => setFiltres({...filtres, annee: value})}
            >
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Toutes les années</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select
              value={filtres.statut}
              onValueChange={(value) => setFiltres({...filtres, statut: value})}
            >
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                <SelectItem value="validé">Payés</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="rejeté">Rejetés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Fichier</th>
                  <th className="px-4 py-3 text-left font-medium">Banque</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-right font-medium">Montant</th>
                  <th className="px-4 py-3 text-center font-medium">Employés</th>
                  <th className="px-4 py-3 text-center font-medium">Statut</th>
                  <th className="px-4 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fichiersFiltres.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      Aucun fichier de virement trouvé pour ces critères
                    </td>
                  </tr>
                ) : (
                  fichiersFiltres.map((fichier) => (
                    <tr key={fichier.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium">{fichier.nom}</div>
                        <div className="text-xs text-muted-foreground">Format: {fichier.format}</div>
                      </td>
                      <td className="px-4 py-3">{fichier.banque}</td>
                      <td className="px-4 py-3">
                        {fichier.dateGeneration}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {fichier.montantTotal.toLocaleString('fr-FR')} MAD
                      </td>
                      <td className="px-4 py-3 text-center">
                        {fichier.nombreEmployes}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={getStatutBadgeClass(fichier.statut)} variant={fichier.statut === "en_attente" ? "outline" : "default"}>
                          {getStatutIcon(fichier.statut)}
                          {fichier.statut === "validé" ? "Payé" : 
                           fichier.statut === "en_attente" ? "En attente" : 
                           fichier.statut === "rejeté" ? "Rejeté" : fichier.statut}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleVoirDetails(fichier)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleTelechargerFichier(fichier)}>
                            <FileDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-4 text-muted-foreground text-sm">
          Total: {fichiersFiltres.length} fichiers de virement
        </div>
        
        {/* Modale pour les détails d'un fichier */}
        <Dialog open={detailsOuverts} onOpenChange={setDetailsOuverts}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Détails du fichier de virement</DialogTitle>
              <DialogDescription>
                {fichierSelectionne?.nom} généré le {fichierSelectionne?.dateGeneration}
              </DialogDescription>
            </DialogHeader>
            
            {fichierSelectionne && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <div className="text-sm text-muted-foreground">Format</div>
                    <div className="font-medium">{fichierSelectionne.format}</div>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <div className="text-sm text-muted-foreground">Montant total</div>
                    <div className="font-medium">{fichierSelectionne.montantTotal.toLocaleString('fr-FR')} MAD</div>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <div className="text-sm text-muted-foreground">Statut</div>
                    <div>
                      <Badge className={getStatutBadgeClass(fichierSelectionne.statut)} variant={fichierSelectionne.statut === "en_attente" ? "outline" : "default"}>
                        {getStatutIcon(fichierSelectionne.statut)}
                        {fichierSelectionne.statut === "validé" ? "Payé" : 
                         fichierSelectionne.statut === "en_attente" ? "En attente" : 
                         fichierSelectionne.statut === "rejeté" ? "Rejeté" : fichierSelectionne.statut}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="paiements">
                  <TabsList className="mb-4">
                    <TabsTrigger value="paiements">Détail des paiements</TabsTrigger>
                    <TabsTrigger value="fichier">Contenu du fichier</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="paiements">
                    <div className="rounded-md border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium">Employé</th>
                            <th className="px-4 py-3 text-left font-medium">RIB</th>
                            <th className="px-4 py-3 text-right font-medium">Montant</th>
                            <th className="px-4 py-3 text-left font-medium">Référence</th>
                            <th className="px-4 py-3 text-center font-medium">Statut</th>
                            {fichierSelectionne.statut === "en_attente" && (
                              <th className="px-4 py-3 text-center font-medium">Actions</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {fichierSelectionne.paiements.map((paiement: any) => (
                            <tr key={paiement.id} className="border-t hover:bg-muted/30">
                              <td className="px-4 py-3">
                                <div className="font-medium">{paiement.nom}</div>
                                <div className="text-xs text-muted-foreground">{paiement.matricule}</div>
                              </td>
                              <td className="px-4 py-3">
                                {formaterRIB(paiement.rib) || (
                                  <Badge variant="outline" className="text-red-500 border-red-500">
                                    <AlertTriangle className="h-3 w-3 mr-1" /> Non renseigné
                                  </Badge>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {paiement.montant.toLocaleString('fr-FR')} MAD
                              </td>
                              <td className="px-4 py-3">{paiement.reference}</td>
                              <td className="px-4 py-3 text-center">
                                <Badge className={getStatutBadgeClass(paiement.statut)} variant={paiement.statut === "en_attente" ? "outline" : "default"}>
                                  {getStatutIcon(paiement.statut)}
                                  {paiement.statut === "payé" ? "Payé" : 
                                   paiement.statut === "en_attente" ? "En attente" : 
                                   paiement.statut === "rejeté" ? "Rejeté" : paiement.statut}
                                </Badge>
                              </td>
                              {fichierSelectionne.statut === "en_attente" && (
                                <td className="px-4 py-3 text-center">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleMarquerPaiementEffectue(paiement.id)}
                                    disabled={paiement.statut === "payé"}
                                  >
                                    <Check className="h-3.5 w-3.5 mr-1" /> Marquer payé
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="fichier">
                    <ScrollArea className="h-72 border rounded-md">
                      <pre className="p-4 text-xs overflow-x-auto whitespace-pre-wrap">
                        {/* Contenu du fichier simulé */}
                        {fichierSelectionne.format === "CFV" ? (
                          `RIB;NOM;MONTANT;MOTIF;REFERENCE
${fichierSelectionne.paiements.map((p: any) => `${p.rib.replace(/[\s-]/g, "")};${p.nom};${p.montant.toFixed(2)};${p.motif};${p.reference}`).join("\n")}`
                        ) : fichierSelectionne.format === "CSV" ? (
                          `Nom,Matricule,Banque,RIB,Montant,Motif,Reference
${fichierSelectionne.paiements.map((p: any) => `"${p.nom}","${p.matricule}","${p.banque}","${p.rib.replace(/[\s-]/g, "")}",${p.montant.toFixed(2)},"${p.motif}","${p.reference}"`).join("\n")}`
                        ) : (
                          // Format TXT ou XML (simplifié)
                          `Contenu du fichier ${fichierSelectionne.nom} au format ${fichierSelectionne.format}
----------------------------------------------------------
${fichierSelectionne.paiements.map((p: any) => `${p.rib.replace(/[\s-]/g, "")} ${p.montant.toFixed(2).padStart(12, '0')} ${p.nom.padEnd(30, ' ')} ${p.reference}`).join("\n")}`
                        )}
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            <DialogFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline" onClick={() => setDetailsOuverts(false)}>
                  Fermer
                </Button>
                
                <div className="flex gap-2">
                  {fichierSelectionne && fichierSelectionne.statut === "en_attente" && (
                    <Button 
                      onClick={() => handleMarquerTousPaiementsEffectues(fichierSelectionne)}
                    >
                      <Check className="h-4 w-4 mr-2" /> Marquer tous comme payés
                    </Button>
                  )}
                  
                  <Button variant="outline" onClick={() => handleTelechargerFichier(fichierSelectionne)}>
                    <FileDown className="h-4 w-4 mr-2" /> Télécharger
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SuiviPaiements;
