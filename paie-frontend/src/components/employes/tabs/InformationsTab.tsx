import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, User, Briefcase, Award, BookText, GraduationCap, Pencil, FileText, BellRing } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Employe } from "@/pages/GestionEmployes";
import ContratInfoCard from "../ContratInfoCard";
import InformationsContractuellesSection from "./InformationsContractuellesSection";

interface InformationsTabProps {
  employe: Employe;
  onUpdate?: (updated: Employe) => void;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ employe, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmploye, setEditedEmploye] = useState<Employe | null>(null);
  const [isEditContratDialogOpen, setIsEditContratDialogOpen] = useState(false);

  const handleSaveProfile = () => {
    if (editedEmploye && onUpdate) {
      onUpdate(editedEmploye);
    }
    toast.success("Profil mis à jour avec succès");
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    if (!editedEmploye) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      
      const parentObj = editedEmploye[parent as keyof Employe];
      
      if (parentObj && typeof parentObj === 'object' && !Array.isArray(parentObj)) {
        setEditedEmploye({
          ...editedEmploye,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        });
      }
    } else {
      setEditedEmploye({
        ...editedEmploye,
        [field]: value
      });
    }
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    if (!editedEmploye || !Array.isArray(editedEmploye[field as keyof Employe])) return;
    
    const newArray = [...(editedEmploye[field as keyof Employe] as string[])];
    newArray[index] = value;
    
    setEditedEmploye({
      ...editedEmploye,
      [field]: newArray
    });
  };

  const handleAddArrayItem = (field: string, value: string = "") => {
    if (!editedEmploye) return;
    
    const currentArray = editedEmploye[field as keyof Employe] as string[] || [];
    
    setEditedEmploye({
      ...editedEmploye,
      [field]: [...currentArray, value]
    });
  };

  const handleRemoveArrayItem = (field: string, index: number) => {
    if (!editedEmploye || !Array.isArray(editedEmploye[field as keyof Employe])) return;
    
    const newArray = [...(editedEmploye[field as keyof Employe] as string[])];
    newArray.splice(index, 1);
    
    setEditedEmploye({
      ...editedEmploye,
      [field]: newArray
    });
  };

  const handleUpdateEmploye = (id: string, updatedEmploye: Partial<Employe>) => {
    if (!onUpdate || !employe) return;
    
    const updatedFullEmploye = {
      ...employe,
      ...updatedEmploye
    };
    
    onUpdate(updatedFullEmploye);
  };

  const handleEditContrat = () => {
    setIsEditContratDialogOpen(true);
    toast.info("Modification des informations contractuelles");
  };

  const formatAddress = (adresse: any) => {
    if (!adresse) return "Non spécifiée";
    return `${adresse.rue}, ${adresse.ville}, ${adresse.pays}, ${adresse.codePostal}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-xl">Informations personnelles</CardTitle>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <Pencil className="h-4 w-4" /> Modifier
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                    <p className="font-medium">{employe?.prenom} {employe?.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CIN</p>
                    <p className="font-medium">{employe?.cin || "Non spécifié"}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{employe?.email || "Non spécifié"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{employe?.telephone || "Non spécifié"}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Adresse</p>
                <p className="font-medium">{formatAddress(employe?.adresse)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Situation familiale</p>
                <p className="font-medium">{employe?.situationFamiliale || "Non spécifiée"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations professionnelles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-xl">Informations professionnelles</CardTitle>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <Pencil className="h-4 w-4" /> Modifier
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Poste</p>
                    <p className="font-medium">{employe?.poste || "Non spécifié"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Département</p>
                    <p className="font-medium">{employe?.departement || "Non spécifié"}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type de contrat</p>
                    <p className="font-medium">{employe?.typeContrat || "Non spécifié"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <p className="font-medium">{employe?.status || "Non spécifié"}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date d'embauche</p>
                    <p className="font-medium">{employe?.dateEmbauche || "Non spécifiée"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Manager</p>
                    <p className="font-medium">{employe?.manager || "Non spécifié"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations contractuelles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-500" />
            <CardTitle className="text-xl">Informations contractuelles</CardTitle>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleEditContrat}
          >
            <Pencil className="h-4 w-4" /> Modifier
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Poste</p>
                  <p className="font-medium">{employe?.poste || "Non spécifié"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Département</p>
                  <p className="font-medium">{employe?.departement || "Non spécifié"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Type de contrat</p>
                  <p className="font-medium">{employe?.typeContrat || "Non spécifié"}</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Salaire de base</p>
                  <p className="font-medium">{employe?.salaireBase?.toLocaleString() || "0"} MAD</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Date d'embauche</p>
                  <p className="font-medium">{employe?.dateEmbauche || "Non spécifiée"}</p>
                </div>
                
                {employe?.typeContrat === "CDD" && (
                  <div>
                    <p className="text-sm text-muted-foreground">Durée du contrat</p>
                    <p className="font-medium">
                      {employe?.dureeContrat || "Non spécifiée"} {employe?.dureeContrat === 1 ? "mois" : "mois"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Préférences de notification */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-xl">Préférences de notification</CardTitle>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
          >
            <Pencil className="h-4 w-4" /> Modifier
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Notifications par email</p>
                  <p className="font-medium">Activées</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Notifications push</p>
                  <p className="font-medium">Activées</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Rappels de congés</p>
                  <p className="font-medium">Activés</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Notifications de paie</p>
                  <p className="font-medium">Activées</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compétences */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-xl">Compétences</CardTitle>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <Pencil className="h-4 w-4" /> Modifier
            </Button>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Compétences</p>
              <div className="flex flex-wrap gap-2">
                {(employe?.competences || ["React", "Node.js", "TypeScript", "PostgreSQL"]).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <BookText className="h-5 w-5 text-green-500" />
              <CardTitle className="text-xl">Certifications</CardTitle>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <Pencil className="h-4 w-4" /> Modifier
            </Button>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Certifications</p>
              <div className="space-y-2">
                {(employe?.certifications || ["AWS Certified Developer", "MERN Stack"]).map((cert, index) => (
                  <div key={index} className="p-2 border rounded-md">
                    <p>{cert}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl">Formation</CardTitle>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
          >
            <Pencil className="h-4 w-4" /> Modifier
          </Button>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Diplômes et formations</p>
            <div className="space-y-2">
              {(employe?.diplomes || ["Master en Informatique"]).map((diplome, index) => (
                <div key={index} className="p-3 border rounded-md">
                  <p className="font-medium">{diplome}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationsTab;
