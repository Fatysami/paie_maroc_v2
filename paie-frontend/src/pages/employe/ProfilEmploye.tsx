import React from "react";
import { Link } from "react-router-dom";
import EmployeLayout from "@/components/employe/EmployeLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExternalLink, InfoIcon, FileText, Pencil, Calendar as CalendarIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import InformationsTab from "@/components/employe/profil/InformationsTab";
import DocumentsTab from "@/components/employe/profil/DocumentsTab";
import SecuriteTab from "@/components/employe/profil/SecuriteTab";
import CongesTab from "@/components/employes/conges/CongesTab";
import HistoriqueDetailleTab from "@/components/employes/historique/HistoriqueDetailleTab";
import PaieTab from "@/components/employes/tabs/PaieTab";
import { Employe } from "@/pages/GestionEmployes";
import DetailDocuments from "@/components/employes/DetailDocuments";

const ProfilEmploye = () => {
  const employeId = "1";
  const [isEditSalaireDialogOpen, setIsEditSalaireDialogOpen] = React.useState(false);
  const [formState, setFormState] = React.useState({
    salaireBase: 15000,
    typeContrat: "CDI" as "CDI" | "CDD" | "Intérim" | "Freelance" | "Stage",
    poste: "Développeur Frontend",
    departement: "Informatique",
    dateEmbauche: "2022-01-15",
    dureeContrat: 0,
    uniteDuree: "mois" as "mois" | "annee"
  });
  
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date("2022-01-15")
  );

  const mockEmploye: Employe = {
    id: employeId,
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
  };

  const handleOpenEditDialog = () => {
    setFormState({
      salaireBase: mockEmploye.salaireBase,
      typeContrat: mockEmploye.typeContrat as any,
      poste: mockEmploye.poste,
      departement: mockEmploye.departement,
      dateEmbauche: mockEmploye.dateEmbauche,
      dureeContrat: 0,
      uniteDuree: "mois"
    });
    
    if (mockEmploye.dateEmbauche) {
      setSelectedDate(new Date(mockEmploye.dateEmbauche));
    } else {
      setSelectedDate(undefined);
    }
    
    setIsEditSalaireDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === "salaireBase" || name === "dureeContrat" ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormState(prev => ({
        ...prev,
        dateEmbauche: format(date, "yyyy-MM-dd")
      }));
    }
  };

  const handleSubmit = () => {
    setIsEditSalaireDialogOpen(false);
    toast.success("Informations contractuelles mises à jour avec succès");
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Non spécifiée";
    return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case "CDI": return "Contrat à Durée Indéterminée";
      case "CDD": return "Contrat à Durée Déterminée";
      case "Intérim": return "Intérim";
      case "Freelance": return "Freelance";
      case "Stage": return "Stage";
      default: return "Non spécifié";
    }
  };

  const handleUpdateEmploye = (updatedEmploye: Employe) => {
    toast.success("Informations de l'employé mises à jour avec succès");
  };

  return (
    <EmployeLayout title="Mon profil">
      <div className="space-y-6">
        <div className="flex justify-end mb-2">
          <Link to={`/employes/${employeId}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink size={16} />
              Voir fiche complète
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">Salaire de base</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleOpenEditDialog}
                  className="text-blue-700" 
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Modifier
                </Button>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {mockEmploye.salaireBase.toLocaleString()} MAD
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Dernière modification: {formatDate(mockEmploye.dateEmbauche)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <span className="font-medium">Type de contrat</span>
              </div>
              <div className="text-xl font-bold text-green-600">
                {getContractTypeLabel(mockEmploye.typeContrat)}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {mockEmploye.typeContrat === "CDD" && "Durée: 12 mois"}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-purple-700 mb-1">
                <span className="font-medium">Date d'embauche</span>
              </div>
              <div className="text-xl font-bold text-purple-600">
                {formatDate(mockEmploye.dateEmbauche)}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Poste: {mockEmploye.poste}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="informations" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="paie">Paie</TabsTrigger>
            <TabsTrigger value="conges">Congés et Absences</TabsTrigger>
            <TabsTrigger value="historique">Historique</TabsTrigger>
            <TabsTrigger value="securite">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="informations" className="mt-6">
            <InformationsTab />
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <DetailDocuments 
              employe={mockEmploye} 
              onUpdate={handleUpdateEmploye} 
            />
          </TabsContent>

          <TabsContent value="paie" className="mt-6">
            <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-400">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Information sur le salaire de base</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-2">Le salaire de base est un élément contractuel fixe défini dans la fiche employé et ne change pas tous les mois (sauf promotion, revalorisation, avenant...).</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Il est accessible et modifiable dans l'onglet &quot;Informations professionnelles&quot; de la fiche employé</li>
                  <li>Les bulletins de paie récupèrent automatiquement ce salaire pour le calcul mensuel</li>
                  <li>Il ne doit pas être ressaisi manuellement chaque mois</li>
                  <li>Toute modification est tracée via l'outil &quot;Mise à jour salaire&quot;</li>
                </ul>
              </AlertDescription>
            </Alert>
            <PaieTab employe={mockEmploye} />
          </TabsContent>

          <TabsContent value="conges" className="mt-6">
            <CongesTab employeId={employeId} employeNom={`${mockEmploye.prenom} ${mockEmploye.nom}`} />
          </TabsContent>

          <TabsContent value="historique" className="mt-6">
            <HistoriqueDetailleTab 
              isGlobal={false} 
              employe={{ 
                id: employeId, 
                nom: "El Alaoui", 
                prenom: "Mohamed", 
                matricule: "EMP-2023-0042" 
              }} 
            />
          </TabsContent>

          <TabsContent value="securite" className="mt-6">
            <SecuriteTab />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isEditSalaireDialogOpen} onOpenChange={setIsEditSalaireDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier les informations contractuelles</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaireBase">Salaire de base</Label>
                <Input
                  id="salaireBase"
                  name="salaireBase"
                  type="number"
                  value={formState.salaireBase}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="typeContrat">Type de contrat</Label>
                <Select
                  value={formState.typeContrat}
                  onValueChange={(value) => handleSelectChange("typeContrat", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="Intérim">Intérim</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="poste">Poste</Label>
              <Input
                id="poste"
                name="poste"
                value={formState.poste}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departement">Département</Label>
              <Input
                id="departement"
                name="departement"
                value={formState.departement}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Date de début de contrat</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: fr })
                    ) : (
                      "Sélectionner une date"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {formState.typeContrat === "CDD" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dureeContrat">Durée du contrat</Label>
                  <Input
                    id="dureeContrat"
                    name="dureeContrat"
                    type="number"
                    value={formState.dureeContrat}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uniteDuree">Unité</Label>
                  <Select
                    value={formState.uniteDuree}
                    onValueChange={(value) => handleSelectChange("uniteDuree", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mois">Mois</SelectItem>
                      <SelectItem value="annee">Année(s)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSalaireDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EmployeLayout>
  );
};

export default ProfilEmploye;
