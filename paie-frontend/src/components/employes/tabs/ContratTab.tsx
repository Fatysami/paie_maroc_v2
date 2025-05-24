
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, FileText, Pencil } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Employe, ContractType } from "@/pages/GestionEmployes";

interface ContratTabProps {
  employes: Employe[];
  onUpdateEmploye: (id: string, updatedEmploye: Partial<Employe>) => void;
}

const ContratTab: React.FC<ContratTabProps> = ({ employes, onUpdateEmploye }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEmploye, setCurrentEmploye] = useState<Employe | null>(null);
  const [formState, setFormState] = useState({
    salaireBase: 0,
    typeContrat: "" as ContractType,
    poste: "",
    departement: "",
    dateEmbauche: "",
    dureeContrat: 0,
    uniteDuree: "mois" as "mois" | "annee"
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleOpenEditDialog = (employe: Employe) => {
    setCurrentEmploye(employe);
    setFormState({
      salaireBase: employe.salaireBase || 0,
      typeContrat: employe.typeContrat || "CDI",
      poste: employe.poste || "",
      departement: employe.departement || "",
      dateEmbauche: employe.dateEmbauche || "",
      dureeContrat: employe.dureeContrat || 0,
      uniteDuree: "mois"
    });
    
    if (employe.dateEmbauche) {
      setSelectedDate(new Date(employe.dateEmbauche));
    } else {
      setSelectedDate(undefined);
    }
    
    setIsEditDialogOpen(true);
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
    if (!currentEmploye) return;

    const updatedEmploye: Partial<Employe> = {
      salaireBase: formState.salaireBase,
      typeContrat: formState.typeContrat as ContractType,
      poste: formState.poste,
      departement: formState.departement,
      dateEmbauche: formState.dateEmbauche,
      dureeContrat: formState.typeContrat === "CDD" ? formState.dureeContrat : undefined
    };

    // Appeler la fonction pour mettre à jour l'employé
    onUpdateEmploye(currentEmploye.id, updatedEmploye);
    
    // Fermer la modal et notifier l'utilisateur
    setIsEditDialogOpen(false);
    toast.success("Informations contractuelles mises à jour avec succès");
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Non spécifiée";
    return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
  };

  const getContractTypeBadge = (type: ContractType) => {
    switch (type) {
      case "CDI":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">CDI</Badge>;
      case "CDD":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">CDD</Badge>;
      case "Intérim":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Intérim</Badge>;
      case "Freelance":
        return <Badge variant="outline" className="bg-teal-100 text-teal-800">Freelance</Badge>;
      case "Stage":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Stage</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations contractuelles</CardTitle>
        <CardDescription>
          Gérez les informations contractuelles de vos employés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Type de contrat</TableHead>
                <TableHead>Date d'embauche</TableHead>
                <TableHead>Salaire de base</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employes.map((employe) => (
                <TableRow key={employe.id}>
                  <TableCell className="font-medium">{employe.prenom} {employe.nom}</TableCell>
                  <TableCell>{employe.poste || "Non spécifié"}</TableCell>
                  <TableCell>{employe.departement || "Non spécifié"}</TableCell>
                  <TableCell>{getContractTypeBadge(employe.typeContrat)}</TableCell>
                  <TableCell>{formatDate(employe.dateEmbauche)}</TableCell>
                  <TableCell>{employe.salaireBase.toLocaleString()} MAD</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditDialog(employe)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Modal pour modifier les informations contractuelles */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier les informations contractuelles</DialogTitle>
            </DialogHeader>
            {currentEmploye && (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">
                    {currentEmploye.prenom} {currentEmploye.nom}
                  </h3>
                </div>

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
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ContratTab;
