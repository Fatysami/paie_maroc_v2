
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Award, BookText, GraduationCap, Pencil, FileText, BellRing } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

import ProfileCard from "./components/ProfileCard";
import PersonalInfoForm from "./components/PersonalInfoForm";
import ContractualInfoSection from "./components/ContractualInfoSection";
import NotificationPreferences, { NotificationSettings } from "./components/NotificationPreferences";

type ContractType = "CDI" | "CDD" | "Intérim" | "Freelance" | "Stage";

const InformationsTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingCertifications, setIsEditingCertifications] = useState(false);
  const [isEditingFormation, setIsEditingFormation] = useState(false);
  const [skills, setSkills] = useState(["React", "Node.js", "TypeScript", "PostgreSQL"]);
  const [certifications, setCertifications] = useState(["AWS Certified Developer", "MERN Stack"]);
  const [diplomes, setDiplomes] = useState(["Master en Informatique"]);
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newDiplome, setNewDiplome] = useState("");
  
  const [contractInfo, setContractInfo] = useState({
    salaireBase: 15000,
    typeContrat: "CDI" as ContractType,
    poste: "Développeur Front-End",
    departement: "Développement",
    dateEmbauche: "2022-01-15",
    dureeContrat: 0
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: "tous",
    push: true,
    sms: false,
    langue: "fr",
    rappelsConges: true,
    notificationsPaie: true,
    delaiRappel: 3
  });

  const handleSaveProfile = () => {
    toast.success("Profil mis à jour avec succès");
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSaveSkills = () => {
    toast.success("Compétences mises à jour avec succès");
    setIsEditingSkills(false);
  };

  const handleAddCertification = () => {
    if (newCertification.trim() !== "") {
      setCertifications([...certifications, newCertification]);
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleSaveCertifications = () => {
    toast.success("Certifications mises à jour avec succès");
    setIsEditingCertifications(false);
  };

  const handleAddDiplome = () => {
    if (newDiplome.trim() !== "") {
      setDiplomes([...diplomes, newDiplome]);
      setNewDiplome("");
    }
  };

  const handleRemoveDiplome = (index: number) => {
    setDiplomes(diplomes.filter((_, i) => i !== index));
  };

  const handleSaveFormation = () => {
    toast.success("Formations mises à jour avec succès");
    setIsEditingFormation(false);
  };
  
  const handleUpdateContractInfo = (updatedData: Partial<typeof contractInfo>) => {
    setContractInfo(prev => ({
      ...prev,
      ...updatedData
    }));
    toast.success("Informations contractuelles mises à jour avec succès");
  };

  const handleSaveNotificationPreferences = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
    toast.success("Préférences de notification mises à jour avec succès");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <ProfileCard />
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Détails de votre profil dans l'entreprise
              </CardDescription>
            </div>
            <Button 
              variant={isEditing ? "default" : "outline"} 
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            >
              {isEditing ? "Enregistrer" : "Modifier"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Note importante</AlertTitle>
                <AlertDescription>
                  Certaines informations ne peuvent être modifiées que par le service RH. Contactez votre gestionnaire RH pour toute modification majeure.
                </AlertDescription>
              </Alert>

              <PersonalInfoForm isEditing={isEditing} />

              <Separator className="my-4" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-xl">Compétences</CardTitle>
            </div>
            <Button 
              variant={isEditingSkills ? "default" : "outline"}
              onClick={() => isEditingSkills ? handleSaveSkills() : setIsEditingSkills(true)}
              className="flex items-center gap-2"
            >
              {isEditingSkills ? "Enregistrer" : <><Pencil className="h-4 w-4" /> Modifier</>}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="py-1">
                  {skill}
                  {isEditingSkills && (
                    <button 
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveSkill(index)}
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            
            {isEditingSkills && (
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Nouvelle compétence"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button variant="outline" onClick={handleAddSkill}>
                  Ajouter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <BookText className="h-5 w-5 text-green-500" />
              <CardTitle className="text-xl">Certifications</CardTitle>
            </div>
            <Button 
              variant={isEditingCertifications ? "default" : "outline"}
              onClick={() => isEditingCertifications ? handleSaveCertifications() : setIsEditingCertifications(true)}
              className="flex items-center gap-2"
            >
              {isEditingCertifications ? "Enregistrer" : <><Pencil className="h-4 w-4" /> Modifier</>}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {certifications.map((certification, index) => (
                <div key={index} className="p-2 border rounded-md flex justify-between items-center">
                  <span>{certification}</span>
                  {isEditingCertifications && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-red-500"
                      onClick={() => handleRemoveCertification(index)}
                    >
                      Supprimer
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {isEditingCertifications && (
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Nouvelle certification"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button variant="outline" onClick={handleAddCertification}>
                  Ajouter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl">Formation</CardTitle>
          </div>
          <Button 
            variant={isEditingFormation ? "default" : "outline"}
            onClick={() => isEditingFormation ? handleSaveFormation() : setIsEditingFormation(true)}
            className="flex items-center gap-2"
          >
            {isEditingFormation ? "Enregistrer" : <><Pencil className="h-4 w-4" /> Modifier</>}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {diplomes.map((diplome, index) => (
              <div key={index} className="p-3 border rounded-md">
                <p className="font-medium">{diplome}</p>
                {isEditingFormation && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 h-8 text-red-500"
                    onClick={() => handleRemoveDiplome(index)}
                  >
                    Supprimer
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {isEditingFormation && (
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={newDiplome}
                onChange={(e) => setNewDiplome(e.target.value)}
                placeholder="Nouveau diplôme"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button variant="outline" onClick={handleAddDiplome}>
                Ajouter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <NotificationPreferences 
        isEditing={false} 
        onSavePreferences={handleSaveNotificationPreferences}
      />
      
      <ContractualInfoSection 
        {...contractInfo}
        onUpdate={handleUpdateContractInfo}
      />
    </div>
  );
};

export default InformationsTab;
