
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, FileDown, AlertTriangle, CheckCircle, FileText, Filter, Calendar, Building, CreditCard, Users, Eye, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

import { PaiementEmploye, BanqueMarocaine, FormatBancaire } from "../types/paiementTypes";
import { 
  configurationsBanques, 
  formaterRIB, 
  genererFichierVirement, 
  telechargerFichier,
  verifierRIBEmployes,
  detecterMontantsAnormaux
} from "../utils/bancaireUtils";

const banques = configurationsBanques.map(config => config.nom);

// Données de démonstration pour les bulletins de paie
const mockBulletins = [
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
    employe: {
      id: "emp-001",
      nom: "ALAMI Mohammed",
      matricule: "EMP-001",
      banque: "Attijariwafa Bank",
      rib: "225 810 0123456789012345"
    }
  },
  { 
    id: "2", 
    mois: "Mai", 
    annee: "2023", 
    employeId: "emp-002",
    montantBrut: 8500, 
    montantNet: 6850.20,
    dateGeneration: "31/05/2023", 
    datePaiement: "",
    statut: "en attente",
    employe: {
      id: "emp-002",
      nom: "BENANI Karim",
      matricule: "EMP-002",
      banque: "BMCE Bank",
      rib: "190 780 0123456789012345"
    }
  },
  { 
    id: "3", 
    mois: "Mai", 
    annee: "2023", 
    employeId: "emp-003",
    montantBrut: 18000, 
    montantNet: 14500.75,
    dateGeneration: "31/05/2023", 
    datePaiement: "",
    statut: "en attente",
    employe: {
      id: "emp-003",
      nom: "IDRISSI Sanae",
      matricule: "EMP-003",
      banque: "CIH Bank",
      rib: "230 700 0123456789012345"
    }
  },
  { 
    id: "4", 
    mois: "Mai", 
    annee: "2023", 
    employeId: "emp-004",
    montantBrut: 22000, 
    montantNet: 16875.50,
    dateGeneration: "31/05/2023", 
    datePaiement: "",
    statut: "en attente",
    employe: {
      id: "emp-004",
      nom: "TAZI Ahmed",
      matricule: "EMP-004",
      banque: "Attijariwafa Bank",
      rib: "225 810 9876543210987654"
    }
  },
  { 
    id: "5", 
    mois: "Mai", 
    annee: "2023", 
    employeId: "emp-005",
    montantBrut: 8000, 
    montantNet: 6240.30,
    dateGeneration: "31/05/2023", 
    datePaiement: "",
    statut: "en attente",
    employe: {
      id: "emp-005",
      nom: "OUAZZANI Najat",
      matricule: "EMP-005",
      banque: "Crédit Agricole",
      rib: ""  // RIB manquant
    }
  },
  { 
    id: "6", 
    mois: "Mai", 
    annee: "2023", 
    employeId: "emp-006",
    montantBrut: 65000, 
    montantNet: 52500.80, // Montant anormalement élevé
    dateGeneration: "31/05/2023",
    datePaiement: "",
    statut: "en attente",
    employe: {
      id: "emp-006",
      nom: "BENNANI Younes",
      matricule: "EMP-006",
      banque: "Société Générale",
      rib: "275 330 0123456789012345"
    }
  }
];

// Données de démonstration pour les départements
const mockDepartements = [
  { id: "1", nom: "Direction" },
  { id: "2", nom: "Comptabilité & Finance" },
  { id: "3", nom: "Ressources Humaines" },
  { id: "4", nom: "Marketing & Communication" },
  { id: "5", nom: "IT & Développement" },
  { id: "6", nom: "Commercial" }
];

// Mois et années disponibles
const moisDisponibles = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const anneesDisponibles = ["2025", "2024", "2023"];

const GenerationCFV = () => {
  const { toast } = useToast();
  
  // État pour les filtres
  const [filtres, setFiltres] = useState({
    mois: "Mai",
    annee: "2023",
    banque: "Toutes",
    departement: "Tous"
  });
  
  // État pour les données
  const [bulletins, setBulletins] = useState<any[]>([]);
  const [bulletinsSelectionnes, setBulletinsSelectionnes] = useState<any[]>([]);
  const [tousSelectionnes, setTousSelectionnes] = useState(true);
  const [etapeGeneration, setEtapeGeneration] = useState<'selection' | 'verification' | 'generation' | 'confirmation'>('selection');
  const [formatFichier, setFormatFichier] = useState<FormatBancaire>("CFV");
  const [alertesRIB, setAlertesRIB] = useState<PaiementEmploye[]>([]);
  const [alertesMontants, setAlertesMontants] = useState<PaiementEmploye[]>([]);
  const [fichierGenere, setFichierGenere] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Charger les bulletins selon les filtres
  useEffect(() => {
    // Simuler un appel API
    setIsLoading(true);
    setTimeout(() => {
      // Filtrer selon les critères
      const bulletinsFiltres = mockBulletins.filter(bulletin => {
        // Filtre par mois et année
        if (bulletin.mois !== filtres.mois || bulletin.annee !== filtres.annee) {
          return false;
        }
        
        // Filtre par banque
        if (filtres.banque !== "Toutes" && bulletin.employe?.banque !== filtres.banque) {
          return false;
        }
        
        // Dans un cas réel, filtre par département serait ici
        
        return true;
      });
      
      setBulletins(bulletinsFiltres);
      // Par défaut, tous les bulletins sont sélectionnés
      setBulletinsSelectionnes(bulletinsFiltres);
      setIsLoading(false);
    }, 800);
  }, [filtres]);
  
  // Gestion de la sélection des bulletins
  const handleToggleTous = (checked: boolean) => {
    setTousSelectionnes(checked);
    if (checked) {
      setBulletinsSelectionnes(bulletins);
    } else {
      setBulletinsSelectionnes([]);
    }
  };
  
  const handleToggleBulletin = (bulletin: any, checked: boolean) => {
    if (checked) {
      setBulletinsSelectionnes(prev => [...prev, bulletin]);
    } else {
      setBulletinsSelectionnes(prev => prev.filter(b => b.id !== bulletin.id));
      setTousSelectionnes(false);
    }
  };
  
  // Passer à l'étape de vérification
  const handlePasserAVerification = () => {
    if (bulletinsSelectionnes.length === 0) {
      toast({
        title: "Aucun bulletin sélectionné",
        description: "Veuillez sélectionner au moins un bulletin pour générer le fichier.",
        variant: "destructive"
      });
      return;
    }
    
    // Format de fichier selon la banque principale
    // Si plusieurs banques, utiliser le format CSV par défaut
    if (filtres.banque !== "Toutes") {
      const config = configurationsBanques.find(b => b.nom === filtres.banque);
      if (config) {
        setFormatFichier(config.format as FormatBancaire);
      }
    } else {
      setFormatFichier("CSV");
    }
    
    // Transformer les bulletins en objets de paiement
    const paiements = bulletinsSelectionnes.map(bulletin => ({
      id: `paie-${bulletin.id}`,
      employeId: bulletin.employe.id,
      nom: bulletin.employe.nom,
      matricule: bulletin.employe.matricule,
      banque: bulletin.employe.banque,
      rib: bulletin.employe.rib,
      montant: bulletin.montantNet,
      motif: `Salaire ${bulletin.mois} ${bulletin.annee}`,
      reference: `${bulletin.mois.substring(0, 3).toUpperCase()}${bulletin.annee.substring(2)}-${bulletin.employe.matricule.split('-')[1]}`,
      statut: "en_attente" as const,
      bulletinId: bulletin.id,
      mois: bulletin.mois,
      annee: bulletin.annee,
      dateGeneration: new Date().toISOString()
    }));
    
    // Vérifier les RIB manquants ou invalides
    const problemeRIB = verifierRIBEmployes(paiements);
    setAlertesRIB(problemeRIB);
    
    // Vérifier les montants anormaux
    const montantsAnormaux = detecterMontantsAnormaux(paiements, 50000);
    setAlertesMontants(montantsAnormaux);
    
    setEtapeGeneration('verification');
  };
  
  // Générer le fichier
  const handleGenererFichier = () => {
    setIsLoading(true);
    
    // Simuler le traitement
    setTimeout(() => {
      try {
        // Transformer les bulletins en objets de paiement
        const paiements = bulletinsSelectionnes.map(bulletin => ({
          id: `paie-${bulletin.id}`,
          employeId: bulletin.employe.id,
          nom: bulletin.employe.nom,
          matricule: bulletin.employe.matricule,
          banque: bulletin.employe.banque,
          rib: bulletin.employe.rib || "0000000000000000000000000", // Valeur par défaut si RIB manquant
          montant: bulletin.montantNet,
          motif: `Salaire ${bulletin.mois} ${bulletin.annee}`,
          reference: `${bulletin.mois.substring(0, 3).toUpperCase()}${bulletin.annee.substring(2)}-${bulletin.employe.matricule.split('-')[1]}`,
          statut: "en_attente" as const,
          bulletinId: bulletin.id,
          mois: bulletin.mois,
          annee: bulletin.annee,
          dateGeneration: new Date().toISOString()
        }));
        
        // Générer le contenu du fichier
        const contenuFichier = genererFichierVirement(paiements, formatFichier);
        setFichierGenere(contenuFichier);
        
        // Passer à l'étape de confirmation
        setEtapeGeneration('confirmation');
        
        toast({
          title: "Fichier généré avec succès",
          description: `Le fichier ${formatFichier} a été généré pour ${paiements.length} employés.`
        });
      } catch (error) {
        toast({
          title: "Erreur de génération",
          description: "Une erreur est survenue lors de la génération du fichier.",
          variant: "destructive"
        });
        console.error("Erreur de génération:", error);
      }
      
      setIsLoading(false);
    }, 1500);
  };
  
  // Télécharger le fichier
  const handleTelechargerFichier = () => {
    if (!fichierGenere) return;
    
    const prefix = `virement_${filtres.mois.substring(0, 3).toLowerCase()}_${filtres.annee}`;
    telechargerFichier(fichierGenere, formatFichier, prefix);
    
    toast({
      title: "Téléchargement en cours",
      description: "Le fichier est en cours de téléchargement."
    });
  };
  
  // Marquer les paiements comme effectués
  const handleMarquerPaiementsEffectues = () => {
    // Dans un cas réel, mise à jour de la base de données
    toast({
      title: "Paiements marqués comme effectués",
      description: `${bulletinsSelectionnes.length} paiements ont été marqués comme effectués.`
    });
    
    // Réinitialiser le formulaire
    setEtapeGeneration('selection');
    setFichierGenere(null);
  };
  
  // Réinitialiser le processus
  const handleReinitialiser = () => {
    setEtapeGeneration('selection');
    setFichierGenere(null);
    setAlertesRIB([]);
    setAlertesMontants([]);
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Génération de Fichier de Virement Bancaire (CFV)</CardTitle>
        <CardDescription>
          Générez automatiquement les fichiers de virement bancaire pour le paiement des salaires
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {etapeGeneration === 'selection' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <Label className="mb-2 block">Mois</Label>
                <Select
                  value={filtres.mois}
                  onValueChange={(value) => setFiltres({...filtres, mois: value})}
                >
                  <SelectTrigger>
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {moisDisponibles.map((mois) => (
                      <SelectItem key={mois} value={mois}>{mois}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="mb-2 block">Année</Label>
                <Select
                  value={filtres.annee}
                  onValueChange={(value) => setFiltres({...filtres, annee: value})}
                >
                  <SelectTrigger>
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {anneesDisponibles.map((annee) => (
                      <SelectItem key={annee} value={annee}>{annee}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="mb-2 block">Banque</Label>
                <Select
                  value={filtres.banque}
                  onValueChange={(value) => setFiltres({...filtres, banque: value})}
                >
                  <SelectTrigger>
                    <CreditCard className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Toutes">Toutes les banques</SelectItem>
                    {banques.map((banque) => (
                      <SelectItem key={banque} value={banque}>{banque}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="mb-2 block">Département</Label>
                <Select
                  value={filtres.departement}
                  onValueChange={(value) => setFiltres({...filtres, departement: value})}
                >
                  <SelectTrigger>
                    <Building className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tous">Tous les départements</SelectItem>
                    {mockDepartements.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Chargement des bulletins...</span>
              </div>
            ) : (
              <>
                <div className="rounded-md border mb-4">
                  <div className="flex items-center p-4 border-b bg-muted/40">
                    <Checkbox 
                      id="selectAll"
                      checked={tousSelectionnes} 
                      onCheckedChange={(checked) => handleToggleTous(checked as boolean)}
                    />
                    <label htmlFor="selectAll" className="ml-2 font-medium">
                      Sélectionner tous les bulletins ({bulletins.length})
                    </label>
                    <div className="ml-auto text-sm text-muted-foreground">
                      {bulletinsSelectionnes.length} sélectionné(s)
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/20">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium w-8"></th>
                          <th className="px-4 py-3 text-left font-medium">Employé</th>
                          <th className="px-4 py-3 text-left font-medium">Banque</th>
                          <th className="px-4 py-3 text-left font-medium">RIB</th>
                          <th className="px-4 py-3 text-right font-medium">Montant net</th>
                          <th className="px-4 py-3 text-center font-medium">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bulletins.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                              Aucun bulletin trouvé pour ces critères
                            </td>
                          </tr>
                        ) : (
                          bulletins.map((bulletin) => {
                            const isSelected = bulletinsSelectionnes.some(b => b.id === bulletin.id);
                            const employe = bulletin.employe || {};
                            const ribManquant = !employe.rib || employe.rib.trim() === "";
                            const montantEleve = bulletin.montantNet > 50000;
                            
                            return (
                              <tr 
                                key={bulletin.id} 
                                className={`border-t hover:bg-muted/30 transition-colors ${isSelected ? 'bg-muted/20' : ''}`}
                              >
                                <td className="px-4 py-3">
                                  <Checkbox 
                                    checked={isSelected}
                                    onCheckedChange={(checked) => handleToggleBulletin(bulletin, checked as boolean)}
                                  />
                                </td>
                                <td className="px-4 py-3 font-medium">
                                  {employe.nom}
                                  <div className="text-xs text-muted-foreground">{employe.matricule}</div>
                                </td>
                                <td className="px-4 py-3">
                                  {employe.banque || "Non spécifiée"}
                                </td>
                                <td className="px-4 py-3">
                                  {ribManquant ? (
                                    <Badge variant="outline" className="text-red-500 border-red-500">
                                      <AlertTriangle className="h-3 w-3 mr-1" /> RIB manquant
                                    </Badge>
                                  ) : (
                                    formaterRIB(employe.rib)
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className={montantEleve ? "text-amber-600 font-medium" : ""}>
                                    {bulletin.montantNet.toLocaleString('fr-FR')} MAD
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {bulletin.statut === "payé" ? (
                                    <Badge className="bg-green-500">Payé</Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                      En attente
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Total à payer : 
                    <span className="font-bold ml-2">
                      {bulletinsSelectionnes.reduce((sum, b) => sum + b.montantNet, 0).toLocaleString('fr-FR')} MAD
                    </span>
                  </div>
                  <Button 
                    disabled={bulletinsSelectionnes.length === 0} 
                    onClick={handlePasserAVerification}
                  >
                    Générer le fichier de virement
                  </Button>
                </div>
              </>
            )}
          </>
        )}
        
        {etapeGeneration === 'verification' && (
          <>
            <div className="flex items-center mb-4">
              <Button variant="ghost" onClick={handleReinitialiser} className="mr-2">
                <RefreshCw className="h-4 w-4 mr-2" /> Retour
              </Button>
              <h3 className="text-lg font-semibold">Vérification avant génération</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    <Users className="h-4 w-4 inline mr-2" />
                    Employés sélectionnés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bulletinsSelectionnes.length}</div>
                  <p className="text-sm text-muted-foreground">employés à payer</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    <CreditCard className="h-4 w-4 inline mr-2" />
                    Montant total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bulletinsSelectionnes.reduce((sum, b) => sum + b.montantNet, 0).toLocaleString('fr-FR')} MAD
                  </div>
                  <p className="text-sm text-muted-foreground">à virer</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    <FileText className="h-4 w-4 inline mr-2" />
                    Format du fichier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formatFichier}
                    onValueChange={(value) => setFormatFichier(value as FormatBancaire)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CFV">CFV (Attijariwafa)</SelectItem>
                      <SelectItem value="CSV">CSV (Standard)</SelectItem>
                      <SelectItem value="TXT">TXT (Format texte)</SelectItem>
                      <SelectItem value="XML">XML (SEPA)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
            
            {(alertesRIB.length > 0 || alertesMontants.length > 0) && (
              <div className="space-y-4 mb-6">
                <h3 className="font-medium">Alertes à vérifier</h3>
                
                {alertesRIB.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>RIB manquants ou invalides ({alertesRIB.length})</AlertTitle>
                    <AlertDescription>
                      <ScrollArea className="h-32 mt-2">
                        <ul className="pl-5 list-disc space-y-1">
                          {alertesRIB.map((paiement) => (
                            <li key={paiement.id}>
                              {paiement.nom} ({paiement.matricule}) - 
                              {paiement.rib ? "RIB invalide" : "RIB manquant"}
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                      <p className="mt-2 text-sm">
                        Il est recommandé de compléter ces informations avant de générer le fichier.
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
                
                {alertesMontants.length > 0 && (
                  <Alert className="border-amber-300 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Montants inhabituels détectés ({alertesMontants.length})</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      <ScrollArea className="h-32 mt-2">
                        <ul className="pl-5 list-disc space-y-1">
                          {alertesMontants.map((paiement) => (
                            <li key={paiement.id}>
                              {paiement.nom} ({paiement.matricule}) - 
                              {paiement.montant.toLocaleString('fr-FR')} MAD
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                      <p className="mt-2 text-sm">
                        Ces montants dépassent le seuil habituel (50 000 MAD). Veuillez vérifier leur exactitude.
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleReinitialiser}>
                Annuler
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <FileDown className="h-4 w-4 mr-2" /> Générer le fichier
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmer la génération</DialogTitle>
                    <DialogDescription>
                      Vous êtes sur le point de générer un fichier de virement pour {bulletinsSelectionnes.length} employés, 
                      pour un montant total de {bulletinsSelectionnes.reduce((sum, b) => sum + b.montantNet, 0).toLocaleString('fr-FR')} MAD.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {alertesRIB.length > 0 && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Attention</AlertTitle>
                      <AlertDescription>
                        {alertesRIB.length} employé(s) ont des RIB manquants ou invalides. 
                        Le virement pourrait être rejeté par la banque.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => document.querySelector('.dialog-close')?.dispatchEvent(new MouseEvent('click'))}>
                      Annuler
                    </Button>
                    <Button onClick={handleGenererFichier} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          Confirmer la génération
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
        
        {etapeGeneration === 'confirmation' && fichierGenere && (
          <>
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fichier généré avec succès</h3>
              <p className="text-muted-foreground">
                Le fichier de virement pour {bulletinsSelectionnes.length} employés est prêt à être téléchargé
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Format</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="outline" className="text-lg font-normal px-3 py-1">
                    {formatFichier}
                  </Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Transactions</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold">{bulletinsSelectionnes.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Montant total</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold">
                    {bulletinsSelectionnes.reduce((sum, b) => sum + b.montantNet, 0).toLocaleString('fr-FR')} MAD
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="apercu" className="mb-6">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="apercu">Aperçu du fichier</TabsTrigger>
                <TabsTrigger value="liste">Liste des virements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="apercu" className="mt-4">
                <ScrollArea className="h-72 border rounded-md">
                  <pre className="p-4 text-xs overflow-x-auto whitespace-pre-wrap">
                    {fichierGenere}
                  </pre>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="liste" className="mt-4">
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Employé</th>
                        <th className="px-4 py-3 text-left font-medium">Banque</th>
                        <th className="px-4 py-3 text-left font-medium">RIB</th>
                        <th className="px-4 py-3 text-right font-medium">Montant</th>
                        <th className="px-4 py-3 text-left font-medium">Référence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulletinsSelectionnes.map((bulletin) => {
                        const employe = bulletin.employe || {};
                        return (
                          <tr key={bulletin.id} className="border-t hover:bg-muted/30">
                            <td className="px-4 py-3 font-medium">
                              {employe.nom}
                              <div className="text-xs text-muted-foreground">{employe.matricule}</div>
                            </td>
                            <td className="px-4 py-3">{employe.banque}</td>
                            <td className="px-4 py-3">{formaterRIB(employe.rib)}</td>
                            <td className="px-4 py-3 text-right">{bulletin.montantNet.toLocaleString('fr-FR')} MAD</td>
                            <td className="px-4 py-3">
                              {`${bulletin.mois.substring(0, 3).toUpperCase()}${bulletin.annee.substring(2)}-${employe.matricule.split('-')[1]}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleReinitialiser}>
                Générer un autre fichier
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleTelechargerFichier}>
                  <FileDown className="h-4 w-4 mr-2" /> Télécharger le fichier
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <CheckCircle className="h-4 w-4 mr-2" /> Marquer comme payés
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmer le paiement</DialogTitle>
                      <DialogDescription>
                        Cette action marquera tous les bulletins comme "payés" et mettra à jour leur statut.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                      <p className="mb-2 font-medium">Détails:</p>
                      <ul className="space-y-1 text-sm">
                        <li>Nombre d'employés: {bulletinsSelectionnes.length}</li>
                        <li>Montant total: {bulletinsSelectionnes.reduce((sum, b) => sum + b.montantNet, 0).toLocaleString('fr-FR')} MAD</li>
                        <li>Date de paiement: {new Date().toLocaleDateString('fr-FR')}</li>
                      </ul>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => document.querySelector('.dialog-close')?.dispatchEvent(new MouseEvent('click'))}>
                        Annuler
                      </Button>
                      <Button onClick={handleMarquerPaiementsEffectues}>
                        Confirmer le paiement
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GenerationCFV;
