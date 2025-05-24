import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Edit, PlusCircle, FileText, Save, Check, Calendar, Upload, Download, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Employe, AvantageType } from "./GestionEmployes";
import { calculerPaie } from "@/utils/paie/CalculateurPaie";
import { genererBulletinPDF } from "@/utils/paie/GenerateurPDF";
import DetailPaieMensuelleForm from "@/components/employes/paie/DetailPaieMensuelleForm";

const PreparationPaie = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [moisPaie, setMoisPaie] = useState<string>(new Date().toISOString().substring(0, 7)); // Format YYYY-MM
  const [employeSelectionne, setEmployeSelectionne] = useState<Employe | null>(null);
  const [openEmployeDetail, setOpenEmployeDetail] = useState(false);
  const [statusFiltre, setStatusFiltre] = useState<string>("tous");
  const [showInformation, setShowInformation] = useState(true);

  const employes: Employe[] = [
    {
      id: "1",
      nom: "El Alaoui",
      prenom: "Mohamed",
      matricule: "EMP-2023-0042",
      salaire: 15000,
      salaireBase: 15000,
      cin: "BE789456",
      email: "m.elalaoui@example.com",
      telephone: "0661234567",
      adresse: {
        rue: "123 Avenue Hassan II",
        ville: "Casablanca",
        pays: "Maroc",
        codePostal: "20000"
      },
      dateEmbauche: "2022-01-15",
      poste: "Développeur Frontend",
      departement: "Informatique",
      typeContrat: "CDI",
      status: "Actif",
      primes: [
        { id: "1", nom: "Prime d'ancienneté", montant: 500, type: "fixe", frequence: "mensuelle" },
        { id: "2", nom: "Prime de rendement", montant: 5, type: "pourcentage", frequence: "annuelle" }
      ],
      avantages: [
        { id: "1", nom: "Téléphone mobile", type: "telephone", valeur: 500, description: "iPhone SE" }
      ],
      modePaiement: "Virement bancaire",
      affiliationCimr: true,
      tauxCimr: 3,
      documents: {
        contratSigne: true,
        cin: true,
        rib: true
      }
    },
    {
      id: "2",
      nom: "Benani",
      prenom: "Leila",
      matricule: "EMP-2023-0043",
      salaire: 18000,
      salaireBase: 18000,
      cin: "BE123456",
      email: "l.benani@example.com",
      telephone: "0667891234",
      adresse: {
        rue: "45 Rue des Orangers",
        ville: "Rabat",
        pays: "Maroc",
        codePostal: "10000"
      },
      dateEmbauche: "2021-05-10",
      poste: "Responsable Marketing",
      departement: "Marketing",
      typeContrat: "CDI",
      status: "Actif",
      primes: [
        { id: "1", nom: "Prime d'ancienneté", montant: 700, type: "fixe", frequence: "mensuelle" }
      ],
      avantages: [
        { id: "1", nom: "Voiture de fonction", type: "voiture", valeur: 2000, description: "Dacia Duster" }
      ],
      modePaiement: "Virement bancaire",
      affiliationCimr: true,
      tauxCimr: 4,
      documents: {
        contratSigne: true,
        cin: true,
        rib: true
      }
    }
  ];

  const [donneesPreparationPaie, setDonneesPreparationPaie] = useState<{
    [employeId: string]: {
      salaireBase: number;
      primes: Array<{ id: string; nom: string; montant: number; type: string }>;
      avantages: Array<{ id: string; nom: string; valeur: number; type: string }>;
      absences: Array<{ id: string; type: string; jours: number; deduction: number }>;
      statut: "en_attente" | "valide" | "paye";
      notes: string;
      calculBrut: number;
      calculNet: number;
    };
  }>({
    "1": {
      salaireBase: 15000,
      primes: [
        { id: "1", nom: "Prime d'ancienneté", montant: 500, type: "fixe" },
        { id: "2", nom: "Prime exceptionnelle", montant: 1000, type: "fixe" }
      ],
      avantages: [
        { id: "1", nom: "Téléphone mobile", valeur: 500, type: "telephone" }
      ],
      absences: [],
      statut: "en_attente",
      notes: "",
      calculBrut: 17000,
      calculNet: 14280
    },
    "2": {
      salaireBase: 18000,
      primes: [
        { id: "1", nom: "Prime d'ancienneté", montant: 700, type: "fixe" }
      ],
      avantages: [
        { id: "1", nom: "Voiture de fonction", valeur: 2000, type: "voiture" }
      ],
      absences: [
        { id: "1", type: "nonjustifiee", jours: 2, deduction: 1385 }
      ],
      statut: "en_attente",
      notes: "Absence à déduire pour 2 jours",
      calculBrut: 19315,
      calculNet: 16224
    }
  });

  const employesFiltres = employes.filter(emp => {
    if (statusFiltre === "tous") return true;
    const statusPaie = donneesPreparationPaie[emp.id]?.statut || "en_attente";
    return statusFiltre === statusPaie;
  });

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-MA', { 
      style: 'currency', 
      currency: 'MAD',
      maximumFractionDigits: 2
    }).format(montant);
  };

  const formatMois = (dateStr: string) => {
    const [annee, mois] = dateStr.split('-');
    const date = new Date(parseInt(annee), parseInt(mois) - 1, 1);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const calculerTotalPrimes = (employeId: string) => {
    return donneesPreparationPaie[employeId]?.primes.reduce((total, prime) => total + prime.montant, 0) || 0;
  };

  const calculerTotalAvantages = (employeId: string) => {
    return donneesPreparationPaie[employeId]?.avantages.reduce((total, avantage) => total + avantage.valeur, 0) || 0;
  };

  const calculerTotalAbsences = (employeId: string) => {
    return donneesPreparationPaie[employeId]?.absences.reduce((total, absence) => total + absence.deduction, 0) || 0;
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "valide":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Validé</Badge>;
      case "paye":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Payé</Badge>;
      default:
        return <Badge variant="outline">Non défini</Badge>;
    }
  };

  const ouvrirDetailEmploye = (employe: Employe) => {
    setEmployeSelectionne(employe);
    setOpenEmployeDetail(true);
  };

  const updateDonneesPaie = (employeId: string, donnees: any) => {
    setDonneesPreparationPaie(prev => ({
      ...prev,
      [employeId]: {
        ...prev[employeId],
        ...donnees
      }
    }));
    setOpenEmployeDetail(false);
    
    toast({
      title: "Données mises à jour",
      description: "Les données de paie ont été mises à jour avec succès",
    });
  };

  const validerPaieMois = () => {
    const nouveauDonnees = { ...donneesPreparationPaie };
    
    Object.keys(nouveauDonnees).forEach(id => {
      if (nouveauDonnees[id].statut === "en_attente") {
        nouveauDonnees[id].statut = "valide";
      }
    });
    
    setDonneesPreparationPaie(nouveauDonnees);
    
    toast({
      title: "Paie validée",
      description: `La paie du mois de ${formatMois(moisPaie)} a été validée avec succès pour tous les employés.`,
    });
  };

  const genererTousBulletins = async () => {
    toast({
      title: "Génération en cours",
      description: "Les bulletins de paie sont en cours de génération...",
    });
    
    setTimeout(() => {
      toast({
        title: "Bulletins générés",
        description: `Les bulletins de paie du mois de ${formatMois(moisPaie)} ont été générés avec succès.`,
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Préparation de la paie</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <Select 
              value={moisPaie} 
              onValueChange={setMoisPaie}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sélectionner un mois" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-04">Avril 2023</SelectItem>
                <SelectItem value="2023-05">Mai 2023</SelectItem>
                <SelectItem value="2023-06">Juin 2023</SelectItem>
                <SelectItem value="2023-07">Juillet 2023</SelectItem>
                <SelectItem value="2023-08">Août 2023</SelectItem>
                <SelectItem value="2023-09">Septembre 2023</SelectItem>
                <SelectItem value="2023-10">Octobre 2023</SelectItem>
                <SelectItem value="2023-11">Novembre 2023</SelectItem>
                <SelectItem value="2023-12">Décembre 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={validerPaieMois} className="bg-green-600 hover:bg-green-700">
            <Check className="mr-2 h-4 w-4" /> Valider la paie du mois
          </Button>
          
          <Button variant="outline" onClick={genererTousBulletins}>
            <FileText className="mr-2 h-4 w-4" /> Générer bulletins
          </Button>
        </div>
      </div>

      {showInformation && (
        <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-400">
          <InfoIcon className="h-4 w-4" />
          <div className="flex justify-between w-full">
            <AlertTitle>Information sur le salaire de base</AlertTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowInformation(false)} className="h-6 px-2">
              ×
            </Button>
          </div>
          <AlertDescription className="mt-2">
            <p className="mb-2">Le salaire de base indiqué ci-dessous est automatiquement récupéré depuis la fiche employé :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Il s'agit d'un élément contractuel fixe défini lors de la création de l'employé</li>
              <li>Il ne devrait pas être modifié à chaque cycle de paie</li>
              <li>Pour une modification permanente, veuillez utiliser le module "Mise à jour salaire" dans la fiche employé</li>
              <li>Les ajustements ponctuels doivent être saisis comme primes ou retenues</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Employés - Paie {formatMois(moisPaie)}</CardTitle>
            
            <Select 
              value={statusFiltre} 
              onValueChange={setStatusFiltre}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="valide">Validé</SelectItem>
                <SelectItem value="paye">Payé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>
            Gestion des éléments de rémunération et préparation des bulletins de paie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Salaire base</TableHead>
                <TableHead>Primes</TableHead>
                <TableHead>Avantages</TableHead>
                <TableHead>Absences</TableHead>
                <TableHead>Brut</TableHead>
                <TableHead>Net estimé</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employesFiltres.map((employe) => (
                <TableRow key={employe.id}>
                  <TableCell className="font-medium">
                    {employe.prenom} {employe.nom}
                    <div className="text-xs text-gray-500">
                      {employe.matricule}
                    </div>
                  </TableCell>
                  <TableCell>{formatMontant(donneesPreparationPaie[employe.id]?.salaireBase || 0)}</TableCell>
                  <TableCell>{formatMontant(calculerTotalPrimes(employe.id))}</TableCell>
                  <TableCell>{formatMontant(calculerTotalAvantages(employe.id))}</TableCell>
                  <TableCell>
                    {calculerTotalAbsences(employe.id) > 0 ? 
                      <span className="text-red-600">- {formatMontant(calculerTotalAbsences(employe.id))}</span> :
                      "-"
                    }
                  </TableCell>
                  <TableCell>{formatMontant(donneesPreparationPaie[employe.id]?.calculBrut || 0)}</TableCell>
                  <TableCell className="font-medium">{formatMontant(donneesPreparationPaie[employe.id]?.calculNet || 0)}</TableCell>
                  <TableCell>{getStatutBadge(donneesPreparationPaie[employe.id]?.statut || "en_attente")}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => ouvrirDetailEmploye(employe)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/employe/${employe.id}`)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {employesFiltres.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    Aucun employé trouvé avec le filtre sélectionné
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={openEmployeDetail} onOpenChange={setOpenEmployeDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {employeSelectionne && (
            <>
              <DialogHeader>
                <DialogTitle>Détail de la paie - {employeSelectionne.prenom} {employeSelectionne.nom}</DialogTitle>
                <DialogDescription>
                  Modifier les éléments de paie pour le mois de {formatMois(moisPaie)}
                </DialogDescription>
              </DialogHeader>
              
              <Alert className="mt-4 mb-4 bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-400">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Rappel important</AlertTitle>
                <AlertDescription>
                  Le salaire de base provient de la fiche employé. Pour une modification permanente, veuillez mettre à jour la fiche employé directement.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4">
                <DetailPaieMensuelleForm 
                  employe={employeSelectionne}
                  donneesPaie={donneesPreparationPaie[employeSelectionne.id]}
                  onSave={(donnees) => updateDonneesPaie(employeSelectionne.id, donnees)}
                  moisPaie={moisPaie}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreparationPaie;
