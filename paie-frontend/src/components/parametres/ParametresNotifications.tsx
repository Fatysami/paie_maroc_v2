
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  BellRing, 
  Calendar, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  FileText, 
  AlertTriangle, 
  CreditCard, 
  Users, 
  Save,
  Edit 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ParametresNotifications = () => {
  // État pour les types de notifications
  const [notifications, setNotifications] = useState({
    cnss: {
      enabled: true,
      frequency: "monthly",
      recipients: ["admin", "comptable"],
      template: "Rappel: La date limite pour déclarer la CNSS est le {date}. Veuillez effectuer votre déclaration au plus tôt.",
      daysBeforeDeadline: 7
    },
    ir: {
      enabled: true,
      frequency: "monthly",
      recipients: ["admin", "comptable"],
      template: "Rappel: La date limite pour déclarer l'IR est le {date}. Veuillez effectuer votre déclaration au plus tôt.",
      daysBeforeDeadline: 7
    },
    paie: {
      enabled: true,
      frequency: "monthly",
      recipients: ["admin", "employees"],
      template: "Votre bulletin de paie pour le mois de {month} est maintenant disponible. Vous pouvez le consulter dans votre espace personnel.",
    },
    paiement: {
      enabled: true,
      frequency: "instant",
      recipients: ["admin", "comptable", "employees"],
      template: "Le paiement du salaire pour le mois de {month} a été effectué avec succès. Le montant de {amount} DH a été viré sur votre compte bancaire."
    },
    abonnement: {
      enabled: true,
      frequency: "custom",
      recipients: ["admin"],
      template: "Votre abonnement expire dans {days} jours. Veuillez procéder au renouvellement pour éviter toute interruption de service.",
      daysBeforeExpiration: 7
    },
    contrat: {
      enabled: true,
      frequency: "custom",
      recipients: ["admin", "rh"],
      template: "Le contrat de {employee} expire dans {days} jours. Veuillez prendre les mesures nécessaires.",
      daysBeforeExpiration: 30
    },
    documents: {
      enabled: true,
      frequency: "instant",
      recipients: ["admin", "rh"],
      template: "Les documents obligatoires pour {employee} sont incomplets. Documents manquants: {documents}."
    }
  });

  // État pour les logs de notifications
  const [notificationLogs, setNotificationLogs] = useState([
    {
      id: 1,
      date: "2024-07-15",
      type: "Échéance CNSS",
      recipient: "admin@entreprise.com",
      status: "ouverte",
      action: "vue"
    },
    {
      id: 2,
      date: "2024-07-13",
      type: "Bulletin disponible",
      recipient: "ali@entreprise.ma",
      status: "ouvert",
      action: "téléchargé"
    },
    {
      id: 3,
      date: "2024-07-10",
      type: "Échéance IR",
      recipient: "comptable@entreprise.ma",
      status: "consultée",
      action: "envoyée"
    },
    {
      id: 4,
      date: "2024-07-05",
      type: "Paiement salaire",
      recipient: "meryem@entreprise.ma",
      status: "ouvert",
      action: "vue"
    },
    {
      id: 5,
      date: "2024-07-01",
      type: "Expiration contrat",
      recipient: "rh@entreprise.ma",
      status: "non-lue",
      action: "en attente"
    }
  ]);

  // État pour l'édition d'une notification
  const [editingNotification, setEditingNotification] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Gestionnaire pour les changements d'états
  const handleToggleNotification = (notificationType, enabled) => {
    setNotifications(current => ({
      ...current,
      [notificationType]: {
        ...current[notificationType],
        enabled
      }
    }));
  };

  // Gestionnaire pour les changements de fréquence
  const handleFrequencyChange = (notificationType, frequency) => {
    setNotifications(current => ({
      ...current,
      [notificationType]: {
        ...current[notificationType],
        frequency
      }
    }));
  };

  // Gestionnaire pour les changements de destinataires
  const handleRecipientChange = (notificationType, recipient, checked) => {
    setNotifications(current => {
      const updatedRecipients = checked 
        ? [...current[notificationType].recipients, recipient]
        : current[notificationType].recipients.filter(r => r !== recipient);
        
      return {
        ...current,
        [notificationType]: {
          ...current[notificationType],
          recipients: updatedRecipients
        }
      };
    });
  };

  // Gestionnaire pour les changements de templates
  const handleTemplateChange = (notificationType, template) => {
    setNotifications(current => ({
      ...current,
      [notificationType]: {
        ...current[notificationType],
        template
      }
    }));
  };

  // Gestionnaire pour les changements de jours avant échéance
  const handleDaysChange = (notificationType, field, value) => {
    setNotifications(current => ({
      ...current,
      [notificationType]: {
        ...current[notificationType],
        [field]: Number(value)
      }
    }));
  };

  // Fonction de sauvegarde des configurations
  const saveNotificationSettings = () => {
    // Simuler l'enregistrement (à remplacer par un vrai appel API)
    setTimeout(() => {
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres de notification ont été sauvegardés avec succès.",
        variant: "default",
      });
    }, 500);
  };

  // Fonction pour ouvrir le modal d'édition
  const openEditDialog = (notificationType) => {
    setEditingNotification({
      type: notificationType,
      ...notifications[notificationType]
    });
    setIsDialogOpen(true);
  };

  // Fonction pour sauvegarder les modifications dans le modal
  const saveEditChanges = () => {
    if (!editingNotification) return;
    
    setNotifications(current => ({
      ...current,
      [editingNotification.type]: {
        ...editingNotification,
        type: undefined // Retirer le champ type qui n'est pas dans la structure originale
      }
    }));
    
    setIsDialogOpen(false);
    
    toast({
      title: "Notification modifiée",
      description: "Le template de notification a été mis à jour avec succès.",
      variant: "default",
    });
  };

  // Obtenir le nom complet d'un type de notification
  const getNotificationName = (type) => {
    const names = {
      cnss: "Rappels des échéances CNSS",
      ir: "Rappels des échéances fiscales (IR)",
      paie: "Bulletins de paie disponibles",
      paiement: "Confirmation des paiements",
      abonnement: "Expiration ou renouvellement d'abonnement",
      contrat: "Contrats arrivant à expiration",
      documents: "Documents manquants"
    };
    
    return names[type] || type;
  };

  // Obtenir l'icône d'un type de notification
  const getNotificationIcon = (type) => {
    const icons = {
      cnss: <Calendar className="h-5 w-5 text-blue-500" />,
      ir: <FileText className="h-5 w-5 text-green-500" />,
      paie: <FileText className="h-5 w-5 text-indigo-500" />,
      paiement: <CreditCard className="h-5 w-5 text-purple-500" />,
      abonnement: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      contrat: <Users className="h-5 w-5 text-rose-500" />,
      documents: <AlertTriangle className="h-5 w-5 text-red-500" />
    };
    
    return icons[type] || <BellRing className="h-5 w-5" />;
  };

  // Obtenir le libellé de fréquence
  const getFrequencyLabel = (frequency) => {
    const labels = {
      instant: "Instantanée",
      daily: "Quotidienne",
      weekly: "Hebdomadaire",
      monthly: "Mensuelle",
      custom: "Personnalisée"
    };
    
    return labels[frequency] || frequency;
  };

  // Rendu du composant
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications et alertes</CardTitle>
        <CardDescription>
          Configurez les préférences de notification et les alertes système
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-3 h-auto mb-8">
            <TabsTrigger value="email" className="py-2 flex items-center">
              <Mail className="h-4 w-4 mr-2" /> Email
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="py-2 flex items-center">
              <BellRing className="h-4 w-4 mr-2" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="logs" className="py-2 flex items-center">
              <Clock className="h-4 w-4 mr-2" /> Historique
            </TabsTrigger>
          </TabsList>

          {/* Section Notifications Email */}
          <TabsContent value="email">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-medium">Notifications par email</h3>
                  <p className="text-sm text-muted-foreground">
                    Configurez les notifications envoyées par email aux utilisateurs
                  </p>
                </div>
                <Button 
                  onClick={saveNotificationSettings}
                  className="ml-auto"
                >
                  <Save className="h-4 w-4 mr-2" /> Enregistrer
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="divide-y">
                  {/* CNSS Notification */}
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon("cnss")}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-medium">{getNotificationName("cnss")}</h4>
                            <p className="text-sm text-muted-foreground">
                              Alerte automatique sur les dates limites pour déclarer la CNSS
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Switch 
                              checked={notifications.cnss.enabled}
                              onCheckedChange={(checked) => handleToggleNotification("cnss", checked)}
                              className="ml-2"
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2 mt-4">
                          <div className="space-y-2">
                            <Label>Fréquence</Label>
                            <Select 
                              value={notifications.cnss.frequency} 
                              onValueChange={(value) => handleFrequencyChange("cnss", value)}
                              disabled={!notifications.cnss.enabled}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez la fréquence" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="instant">Instantanée</SelectItem>
                                <SelectItem value="daily">Quotidienne</SelectItem>
                                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                                <SelectItem value="monthly">Mensuelle</SelectItem>
                                <SelectItem value="custom">Personnalisée</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Jours avant échéance</Label>
                            <Input 
                              type="number" 
                              value={notifications.cnss.daysBeforeDeadline}
                              onChange={(e) => handleDaysChange("cnss", "daysBeforeDeadline", e.target.value)}
                              min="1"
                              max="30"
                              disabled={!notifications.cnss.enabled}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Destinataires</Label>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="cnss-admin"
                                checked={notifications.cnss.recipients.includes("admin")}
                                onCheckedChange={(checked) => handleRecipientChange("cnss", "admin", checked)}
                                disabled={!notifications.cnss.enabled}
                              />
                              <label 
                                htmlFor="cnss-admin"
                                className={`text-sm ${!notifications.cnss.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                Administrateur
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="cnss-comptable"
                                checked={notifications.cnss.recipients.includes("comptable")}
                                onCheckedChange={(checked) => handleRecipientChange("cnss", "comptable", checked)}
                                disabled={!notifications.cnss.enabled}
                              />
                              <label 
                                htmlFor="cnss-comptable"
                                className={`text-sm ${!notifications.cnss.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                Comptable
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="cnss-rh"
                                checked={notifications.cnss.recipients.includes("rh")}
                                onCheckedChange={(checked) => handleRecipientChange("cnss", "rh", checked)}
                                disabled={!notifications.cnss.enabled}
                              />
                              <label 
                                htmlFor="cnss-rh"
                                className={`text-sm ${!notifications.cnss.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                RH
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openEditDialog("cnss")}
                            disabled={!notifications.cnss.enabled}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Modifier le template
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* IR Notification */}
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon("ir")}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-medium">{getNotificationName("ir")}</h4>
                            <p className="text-sm text-muted-foreground">
                              Notification automatique des dates limites de déclarations IR (Simpl-IR)
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Switch 
                              checked={notifications.ir.enabled}
                              onCheckedChange={(checked) => handleToggleNotification("ir", checked)}
                              className="ml-2"
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2 mt-4">
                          <div className="space-y-2">
                            <Label>Fréquence</Label>
                            <Select 
                              value={notifications.ir.frequency} 
                              onValueChange={(value) => handleFrequencyChange("ir", value)}
                              disabled={!notifications.ir.enabled}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez la fréquence" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="instant">Instantanée</SelectItem>
                                <SelectItem value="daily">Quotidienne</SelectItem>
                                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                                <SelectItem value="monthly">Mensuelle</SelectItem>
                                <SelectItem value="custom">Personnalisée</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Jours avant échéance</Label>
                            <Input 
                              type="number" 
                              value={notifications.ir.daysBeforeDeadline}
                              onChange={(e) => handleDaysChange("ir", "daysBeforeDeadline", e.target.value)}
                              min="1"
                              max="30"
                              disabled={!notifications.ir.enabled}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Destinataires</Label>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="ir-admin"
                                checked={notifications.ir.recipients.includes("admin")}
                                onCheckedChange={(checked) => handleRecipientChange("ir", "admin", checked)}
                                disabled={!notifications.ir.enabled}
                              />
                              <label 
                                htmlFor="ir-admin"
                                className={`text-sm ${!notifications.ir.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                Administrateur
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="ir-comptable"
                                checked={notifications.ir.recipients.includes("comptable")}
                                onCheckedChange={(checked) => handleRecipientChange("ir", "comptable", checked)}
                                disabled={!notifications.ir.enabled}
                              />
                              <label 
                                htmlFor="ir-comptable"
                                className={`text-sm ${!notifications.ir.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                Comptable
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="ir-rh"
                                checked={notifications.ir.recipients.includes("rh")}
                                onCheckedChange={(checked) => handleRecipientChange("ir", "rh", checked)}
                                disabled={!notifications.ir.enabled}
                              />
                              <label 
                                htmlFor="ir-rh"
                                className={`text-sm ${!notifications.ir.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                RH
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openEditDialog("ir")}
                            disabled={!notifications.ir.enabled}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Modifier le template
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Paie Notification */}
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon("paie")}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-medium">{getNotificationName("paie")}</h4>
                            <p className="text-sm text-muted-foreground">
                              Notification aux employés lorsque les bulletins sont générés
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Switch 
                              checked={notifications.paie.enabled}
                              onCheckedChange={(checked) => handleToggleNotification("paie", checked)}
                              className="ml-2"
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2 mt-4">
                          <div className="space-y-2">
                            <Label>Fréquence</Label>
                            <Select 
                              value={notifications.paie.frequency} 
                              onValueChange={(value) => handleFrequencyChange("paie", value)}
                              disabled={!notifications.paie.enabled}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez la fréquence" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="instant">Instantanée</SelectItem>
                                <SelectItem value="daily">Quotidienne</SelectItem>
                                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                                <SelectItem value="monthly">Mensuelle</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Destinataires</Label>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="paie-admin"
                                checked={notifications.paie.recipients.includes("admin")}
                                onCheckedChange={(checked) => handleRecipientChange("paie", "admin", checked)}
                                disabled={!notifications.paie.enabled}
                              />
                              <label 
                                htmlFor="paie-admin"
                                className={`text-sm ${!notifications.paie.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                Administrateur
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="paie-employees"
                                checked={notifications.paie.recipients.includes("employees")}
                                onCheckedChange={(checked) => handleRecipientChange("paie", "employees", checked)}
                                disabled={!notifications.paie.enabled}
                              />
                              <label 
                                htmlFor="paie-employees"
                                className={`text-sm ${!notifications.paie.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                Employés
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openEditDialog("paie")}
                            disabled={!notifications.paie.enabled}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Modifier le template
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Paiement Notification */}
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon("paiement")}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-medium">{getNotificationName("paiement")}</h4>
                            <p className="text-sm text-muted-foreground">
                              Confirmation de réussite ou d'échec des virements
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Switch 
                              checked={notifications.paiement.enabled}
                              onCheckedChange={(checked) => handleToggleNotification("paiement", checked)}
                              className="ml-2"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Destinataires</Label>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="paiement-admin"
                                checked={notifications.paiement.recipients.includes("admin")}
                                onCheckedChange={(checked) => handleRecipientChange("paiement", "admin", checked)}
                                disabled={!notifications.paiement.enabled}
                              />
                              <label 
                                htmlFor="paiement-admin"
                                className={`text-sm ${!notifications.paiement.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                Administrateur
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="paiement-comptable"
                                checked={notifications.paiement.recipients.includes("comptable")}
                                onCheckedChange={(checked) => handleRecipientChange("paiement", "comptable", checked)}
                                disabled={!notifications.paiement.enabled}
                              />
                              <label 
                                htmlFor="paiement-comptable"
                                className={`text-sm ${!notifications.paiement.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                Comptable
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="paiement-employees"
                                checked={notifications.paiement.recipients.includes("employees")}
                                onCheckedChange={(checked) => handleRecipientChange("paiement", "employees", checked)}
                                disabled={!notifications.paiement.enabled}
                              />
                              <label 
                                htmlFor="paiement-employees"
                                className={`text-sm ${!notifications.paiement.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                Employés
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openEditDialog("paiement")}
                            disabled={!notifications.paiement.enabled}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Modifier le template
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Abonnement Notification */}
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon("abonnement")}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-medium">{getNotificationName("abonnement")}</h4>
                            <p className="text-sm text-muted-foreground">
                              Alertes liées à l'expiration d'un abonnement
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Switch 
                              checked={notifications.abonnement.enabled}
                              onCheckedChange={(checked) => handleToggleNotification("abonnement", checked)}
                              className="ml-2"
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2 mt-4">
                          <div className="space-y-2">
                            <Label>Jours avant expiration</Label>
                            <Input 
                              type="number" 
                              value={notifications.abonnement.daysBeforeExpiration}
                              onChange={(e) => handleDaysChange("abonnement", "daysBeforeExpiration", e.target.value)}
                              min="1"
                              max="30"
                              disabled={!notifications.abonnement.enabled}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Destinataires</Label>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="abonnement-admin"
                                checked={notifications.abonnement.recipients.includes("admin")}
                                onCheckedChange={(checked) => handleRecipientChange("abonnement", "admin", checked)}
                                disabled={!notifications.abonnement.enabled}
                              />
                              <label 
                                htmlFor="abonnement-admin"
                                className={`text-sm ${!notifications.abonnement.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                Administrateur
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openEditDialog("abonnement")}
                            disabled={!notifications.abonnement.enabled}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Modifier le template
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Section Notifications Dashboard */}
          <TabsContent value="dashboard">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-medium">Notifications internes (Tableau de bord)</h3>
                  <p className="text-sm text-muted-foreground">
                    Configurez les notifications affichées sur le tableau de bord
                  </p>
                </div>
                <Button 
                  onClick={saveNotificationSettings}
                  className="ml-auto"
                >
                  <Save className="h-4 w-4 mr-2" /> Enregistrer
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="divide-y">
                  {/* Contrat Notification */}
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon("contrat")}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-medium">{getNotificationName("contrat")}</h4>
                            <p className="text-sm text-muted-foreground">
                              Notification pour les contrats arrivant à expiration
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Switch 
                              checked={notifications.contrat.enabled}
                              onCheckedChange={(checked) => handleToggleNotification("contrat", checked)}
                              className="ml-2"
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2 mt-4">
                          <div className="space-y-2">
                            <Label>Jours avant expiration</Label>
                            <Input 
                              type="number" 
                              value={notifications.contrat.daysBeforeExpiration}
                              onChange={(e) => handleDaysChange("contrat", "daysBeforeExpiration", e.target.value)}
                              min="1"
                              max="90"
                              disabled={!notifications.contrat.enabled}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Destinataires</Label>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="contrat-admin"
                                checked={notifications.contrat.recipients.includes("admin")}
                                onCheckedChange={(checked) => handleRecipientChange("contrat", "admin", checked)}
                                disabled={!notifications.contrat.enabled}
                              />
                              <label 
                                htmlFor="contrat-admin"
                                className={`text-sm ${!notifications.contrat.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                Administrateur
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="contrat-rh"
                                checked={notifications.contrat.recipients.includes("rh")}
                                onCheckedChange={(checked) => handleRecipientChange("contrat", "rh", checked)}
                                disabled={!notifications.contrat.enabled}
                              />
                              <label 
                                htmlFor="contrat-rh"
                                className={`text-sm ${!notifications.contrat.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                RH
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents Notification */}
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon("documents")}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-medium">{getNotificationName("documents")}</h4>
                            <p className="text-sm text-muted-foreground">
                              Notification pour les documents manquants (CIN, contrat...)
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Switch 
                              checked={notifications.documents.enabled}
                              onCheckedChange={(checked) => handleToggleNotification("documents", checked)}
                              className="ml-2"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Destinataires</Label>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="documents-admin"
                                checked={notifications.documents.recipients.includes("admin")}
                                onCheckedChange={(checked) => handleRecipientChange("documents", "admin", checked)}
                                disabled={!notifications.documents.enabled}
                              />
                              <label 
                                htmlFor="documents-admin"
                                className={`text-sm ${!notifications.documents.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                Administrateur
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="documents-rh"
                                checked={notifications.documents.recipients.includes("rh")}
                                onCheckedChange={(checked) => handleRecipientChange("documents", "rh", checked)}
                                disabled={!notifications.documents.enabled}
                              />
                              <label 
                                htmlFor="documents-rh"
                                className={`text-sm ${!notifications.documents.enabled ? 'text-muted-foreground' : ''}`}
                              >
                                RH
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openEditDialog("documents")}
                            disabled={!notifications.documents.enabled}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Modifier le template
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Section Logs de Notifications */}
          <TabsContent value="logs">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-medium">Historique des notifications envoyées</h3>
                  <p className="text-sm text-muted-foreground">
                    Consultez l'historique des notifications envoyées et leur statut
                  </p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableCaption>Historique récent des notifications</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead>Type de notification</TableHead>
                      <TableHead>Destinataire</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notificationLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.date}</TableCell>
                        <TableCell>{log.type}</TableCell>
                        <TableCell>{log.recipient}</TableCell>
                        <TableCell>
                          {log.status === "ouverte" || log.status === "ouvert" || log.status === "consultée" ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" /> {log.status}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                              <Clock className="h-3 w-3 mr-1" /> {log.status}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal pour éditer les templates de notification */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Modifier le template de notification</DialogTitle>
              <DialogDescription>
                Personnalisez le contenu de la notification envoyée aux destinataires.
              </DialogDescription>
            </DialogHeader>
            {editingNotification && (
              <div className="space-y-4 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-2">
                    {getNotificationIcon(editingNotification.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{getNotificationName(editingNotification.type)}</h4>
                    <p className="text-sm text-muted-foreground">
                      Fréquence: {getFrequencyLabel(editingNotification.frequency)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-content">Contenu du message</Label>
                  <Textarea 
                    id="template-content"
                    rows={4}
                    value={editingNotification.template}
                    onChange={(e) => setEditingNotification({
                      ...editingNotification,
                      template: e.target.value
                    })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Utilisez les variables entre accolades. Ex: {'{date}'}, {'{month}'}, {'{employee}'}, {'{amount}'}, {'{days}'}, {'{documents}'}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
              <Button onClick={saveEditChanges}>Enregistrer les modifications</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ParametresNotifications;
