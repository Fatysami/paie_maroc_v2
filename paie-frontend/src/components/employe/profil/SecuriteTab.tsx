
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Key, Lock } from "lucide-react";

const SecuriteTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sécurité du compte</CardTitle>
        <CardDescription>
          Gérez vos identifiants et préférences de sécurité
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <Key className="h-4 w-4 mr-2" />
              Changer votre mot de passe
            </h3>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="current_password">Mot de passe actuel</Label>
                <Input id="current_password" type="password" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="new_password">Nouveau mot de passe</Label>
                <Input id="new_password" type="password" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="confirm_password">Confirmer le nouveau mot de passe</Label>
                <Input id="confirm_password" type="password" />
              </div>
            </div>
            
            <Button>Mettre à jour le mot de passe</Button>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Authentification à deux facteurs
            </h3>
            
            <p className="text-sm text-muted-foreground">
              L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte 
              en exigeant un code à usage unique en plus de votre mot de passe.
            </p>
            
            <Button variant="outline">Activer l'authentification à deux facteurs</Button>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Sessions actives
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Chrome sur Windows</p>
                    <p className="text-xs text-muted-foreground">Casablanca, Maroc • Actif maintenant</p>
                  </div>
                  <Badge>Cet appareil</Badge>
                </div>
              </div>
              
              <div className="p-3 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Safari sur iPhone</p>
                    <p className="text-xs text-muted-foreground">Casablanca, Maroc • Dernière activité: hier</p>
                  </div>
                  <Button variant="outline" size="sm">Déconnecter</Button>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">Déconnecter tous les autres appareils</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuriteTab;
