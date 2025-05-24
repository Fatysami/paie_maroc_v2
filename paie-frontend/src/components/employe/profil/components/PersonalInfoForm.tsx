
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PersonalInfoFormProps {
  isEditing: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ isEditing }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="nom">Nom</Label>
          <Input 
            id="nom" 
            defaultValue="El Alaoui" 
            disabled={!isEditing || true} 
            className={!isEditing || true ? "bg-muted" : ""}
          />
          {(!isEditing || true) && (
            <p className="text-xs text-muted-foreground">Ce champ ne peut être modifié que par le service RH</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom</Label>
          <Input 
            id="prenom" 
            defaultValue="Mohamed" 
            disabled={!isEditing || true}
            className={!isEditing || true ? "bg-muted" : ""}
          />
          {(!isEditing || true) && (
            <p className="text-xs text-muted-foreground">Ce champ ne peut être modifié que par le service RH</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email professionnel</Label>
          <Input 
            id="email" 
            defaultValue="mohamed.elalaoui@exemple.com" 
            disabled={!isEditing || true}
            className={!isEditing || true ? "bg-muted" : ""}
          />
          {(!isEditing || true) && (
            <p className="text-xs text-muted-foreground">Ce champ ne peut être modifié que par le service RH</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tel">Téléphone</Label>
          <Input 
            id="tel" 
            defaultValue="+212 6 12 34 56 78" 
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse</Label>
          <Textarea 
            id="adresse" 
            defaultValue="123 Rue Mohammed V, Casablanca" 
            disabled={!isEditing}
            className="resize-none"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="poste">Poste</Label>
          <Input 
            id="poste" 
            defaultValue="Développeur Front-End" 
            disabled={!isEditing || true}
            className={!isEditing || true ? "bg-muted" : ""}
          />
          {(!isEditing || true) && (
            <p className="text-xs text-muted-foreground">Ce champ ne peut être modifié que par le service RH</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Département</Label>
          <Input 
            id="department" 
            defaultValue="Développement" 
            disabled={!isEditing || true}
            className={!isEditing || true ? "bg-muted" : ""}
          />
          {(!isEditing || true) && (
            <p className="text-xs text-muted-foreground">Ce champ ne peut être modifié que par le service RH</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
