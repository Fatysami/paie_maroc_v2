
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Mail, MessageSquare, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export interface NotificationSettings {
  email: "tous" | "importants" | "aucun";
  push: boolean;
  sms: boolean;
  langue: "fr" | "ar" | "en";
  rappelsConges: boolean;
  notificationsPaie: boolean;
  delaiRappel: number;
}

interface NotificationPreferencesProps {
  isEditing: boolean;
  onSavePreferences?: (settings: NotificationSettings) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ 
  isEditing,
  onSavePreferences 
}) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    email: "tous",
    push: true,
    sms: false,
    langue: "fr",
    rappelsConges: true,
    notificationsPaie: true,
    delaiRappel: 3
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [localIsEditing, setLocalIsEditing] = useState(isEditing);

  // Update local editing state when prop changes
  useEffect(() => {
    setLocalIsEditing(isEditing);
  }, [isEditing]);

  const handleChange = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    if (onSavePreferences) {
      onSavePreferences(settings);
    } else {
      toast({
        title: "Préférences enregistrées",
        description: "Vos préférences de notification ont été mises à jour avec succès."
      });
    }
    
    setHasChanges(false);
    setLocalIsEditing(false);
  };

  const toggleEditing = () => {
    setLocalIsEditing(prev => !prev);
    if (!localIsEditing) {
      setHasChanges(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col space-y-1.5">
              <h3 className="text-xl font-semibold flex items-center">
                <Bell className="mr-2 h-5 w-5 text-purple-500" />
                Préférences de notification
              </h3>
              <p className="text-sm text-muted-foreground">
                Personnalisez comment et quand vous recevez des notifications
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={toggleEditing}
              className="flex items-center gap-1"
            >
              {localIsEditing ? "Annuler" : "Modifier"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notif_email" className="text-sm font-medium">
                  <Mail className="inline-block mr-2 h-4 w-4" />
                  Notifications par email
                </Label>
                <Select 
                  value={settings.email} 
                  onValueChange={(value: "tous" | "importants" | "aucun") => handleChange("email", value)} 
                  disabled={!localIsEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un réglage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les messages</SelectItem>
                    <SelectItem value="importants">Messages importants uniquement</SelectItem>
                    <SelectItem value="aucun">Aucune notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="langue" className="text-sm font-medium">
                  <MessageSquare className="inline-block mr-2 h-4 w-4" />
                  Langue préférée
                </Label>
                <Select 
                  value={settings.langue} 
                  onValueChange={(value: "fr" | "ar" | "en") => handleChange("langue", value)} 
                  disabled={!localIsEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ar">العربية (Arabe)</SelectItem>
                    <SelectItem value="en">English (Anglais)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium">
                  <Clock className="inline-block mr-2 h-4 w-4" />
                  Délai de rappel (jours)
                </Label>
                <Input 
                  type="number" 
                  min={1}
                  max={30}
                  value={settings.delaiRappel} 
                  onChange={(e) => handleChange("delaiRappel", parseInt(e.target.value) || 1)} 
                  disabled={!localIsEditing}
                  className="max-w-[150px]"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Canaux de notification</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Notifications push</Label>
                    <p className="text-xs text-muted-foreground">Recevoir des notifications sur votre navigateur</p>
                  </div>
                  <Switch 
                    checked={settings.push} 
                    onCheckedChange={(checked) => handleChange("push", checked)} 
                    disabled={!localIsEditing}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Notifications SMS</Label>
                    <p className="text-xs text-muted-foreground">Recevoir des notifications par SMS</p>
                  </div>
                  <Switch 
                    checked={settings.sms} 
                    onCheckedChange={(checked) => handleChange("sms", checked)} 
                    disabled={!localIsEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Types de notifications</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">
                      <Calendar className="inline-block mr-2 h-4 w-4" />
                      Rappels de congés
                    </Label>
                    <p className="text-xs text-muted-foreground">Recevoir des rappels pour les congés à venir</p>
                  </div>
                  <Switch 
                    checked={settings.rappelsConges} 
                    onCheckedChange={(checked) => handleChange("rappelsConges", checked)} 
                    disabled={!localIsEditing}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Notifications de paie</Label>
                    <p className="text-xs text-muted-foreground">Recevoir des notifications lors de la disponibilité des bulletins</p>
                  </div>
                  <Switch 
                    checked={settings.notificationsPaie} 
                    onCheckedChange={(checked) => handleChange("notificationsPaie", checked)} 
                    disabled={!localIsEditing}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {localIsEditing && hasChanges && (
            <div className="flex justify-end">
              <Button variant="default" onClick={handleSaveChanges}>
                Enregistrer les préférences
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
