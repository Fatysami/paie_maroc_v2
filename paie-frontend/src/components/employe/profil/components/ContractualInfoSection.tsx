
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { CalendarIcon, FileText, Pencil } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ContractType } from "@/pages/GestionEmployes";

interface ContractualInfoProps {
  salaireBase?: number;
  typeContrat?: ContractType;
  poste?: string;
  departement?: string;
  dateEmbauche?: string;
  dureeContrat?: number;
  onUpdate?: (updatedData: Partial<ContractualInfoProps>) => void;
}

const ContractualInfoSection: React.FC<ContractualInfoProps> = ({
  salaireBase = 0,
  typeContrat = "CDI",
  poste = "",
  departement = "",
  dateEmbauche = "",
  dureeContrat = 0,
  onUpdate
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formState, setFormState] = useState({
    salaireBase,
    typeContrat,
    poste,
    departement,
    dateEmbauche,
    dureeContrat,
    uniteDuree: "mois" as "mois" | "annee"
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dateEmbauche ? new Date(dateEmbauche) : undefined
  );

  const handleOpenEditDialog = () => {
    setFormState({
      salaireBase,
      typeContrat,
      poste,
      departement,
      dateEmbauche,
      dureeContrat,
      uniteDuree: "mois"
    });
    
    if (dateEmbauche) {
      setSelectedDate(new Date(dateEmbauche));
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
    if (onUpdate) {
      const updatedData = {
        salaireBase: formState.salaireBase,
        typeContrat: formState.typeContrat,
        poste: formState.poste,
        departement: formState.departement,
        dateEmbauche: formState.dateEmbauche,
        dureeContrat: formState.typeContrat === "CDD" ? formState.dureeContrat : undefined
      };
      
      onUpdate(updatedData);
    }
    
    setIsEditDialogOpen(false);
    toast.success("Informations contractuelles mises à jour avec succès");
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Non spécifiée";
    return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
  };

  const getContractTypeLabel = (type: ContractType) => {
    switch (type) {
      case "CDI": return "Contrat à Durée Indéterminée";
      case "CDD": return "Contrat à Durée Déterminée";
      case "Intérim": return "Intérim";
      case "Freelance": return "Freelance";
      case "Stage": return "Stage";
      default: return "Non spécifié";
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Informations contractuelles</CardTitle>
          <CardDescription>
            Paramètres du contrat de l'employé
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          onClick={handleOpenEditDialog}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" /> Modifier contrat
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Poste</Label>
                <p className="font-medium">{poste || "Non spécifié"}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Département</Label>
                <p className="font-medium">{departement || "Non spécifié"}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Type de contrat</Label>
                <p className="font-medium">{getContractTypeLabel(typeContrat)}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Salaire de base</Label>
                <p className="font-medium">{salaireBase?.toLocaleString() || "0"} MAD</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Date d'embauche</Label>
                <p className="font-medium">{formatDate(dateEmbauche)}</p>
              </div>
              
              {typeContrat === "CDD" && (
                <div>
                  <Label className="text-sm text-muted-foreground">Durée du contrat</Label>
                  <p className="font-medium">
                    {dureeContrat || "Non spécifié"} {dureeContrat === 1 ? "mois" : "mois"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier les informations contractuelles</DialogTitle>
              <DialogDescription>
                Modifiez les détails de votre contrat de travail.
              </DialogDescription>
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

export default ContractualInfoSection;
