
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Book, 
  Clock, 
  Settings,
  Mail as MailIcon
} from "lucide-react";

// Schéma de validation pour les paramètres d'assistance
const assistanceFormSchema = z.object({
  emailSupport: z.string().email({ message: "Veuillez saisir un email valide" }),
  telephone: z.string().regex(/^\+212[0-9]{9}$/, { 
    message: "Veuillez saisir un numéro de téléphone marocain valide (format: +212XXXXXXXXX)" 
  }),
  heuresOuverture: z.string().min(5, { 
    message: "Veuillez préciser les heures d'ouverture du support" 
  }),
  whatsapp: z.string().optional(),
  
  // Activation des canaux d'assistance
  activerEmail: z.boolean().default(true),
  activerChat: z.boolean().default(true),
  activerTelephone: z.boolean().default(true),
  activerFAQ: z.boolean().default(true),
  
  // Paramètres de notification
  notifierNouvellesDemandes: z.boolean().default(true),
  notifierMisesAJour: z.boolean().default(true),
  emailNotifications: z.string().email().optional(),
});

// Composant principal pour les paramètres d'assistance utilisateur
const ParametresAssistanceUtilisateur = () => {
  // Valeurs par défaut (simulées)
  const defaultValues = {
    emailSupport: "support@entreprise.ma",
    telephone: "+212522123456",
    heuresOuverture: "8h-18h du Lundi au Vendredi",
    whatsapp: "+212600123456",
    activerEmail: true,
    activerChat: true,
    activerTelephone: true,
    activerFAQ: true,
    notifierNouvellesDemandes: true,
    notifierMisesAJour: true,
    emailNotifications: "notifications@entreprise.ma",
  };

  // Initialisation du formulaire avec react-hook-form et zod
  const form = useForm<z.infer<typeof assistanceFormSchema>>({
    resolver: zodResolver(assistanceFormSchema),
    defaultValues,
  });
  
  const [activeTab, setActiveTab] = React.useState("canaux");

  // Fonction de soumission du formulaire
  const onSubmit = (values: z.infer<typeof assistanceFormSchema>) => {
    console.log("Paramètres d'assistance enregistrés:", values);
    toast.success("Paramètres d'assistance enregistrés avec succès");
  };
  
  // Options de navigation
  const tabOptions = [
    { id: "canaux", label: "Canaux d'assistance" },
    { id: "formulaire", label: "Formulaire de contact" },
    { id: "faq", label: "Base de connaissances" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Paramètres d'Assistance Utilisateur</h2>
        <p className="text-muted-foreground mt-1">
          Configurez les options d'assistance et de support pour les utilisateurs de l'application
        </p>
      </div>
      
      {/* Navigation entre les sections */}
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        {tabOptions.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex flex-1 items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all
              ${activeTab === tab.id 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-background/50"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section des canaux d'assistance */}
      {activeTab === "canaux" && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Canaux d'assistance disponibles</CardTitle>
                <CardDescription>
                  Configurez les différents canaux d'assistance proposés aux utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Canaux d'assistance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <Mail className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-lg">Assistance par Email</CardTitle>
                        <CardDescription>Support par email pour les utilisateurs</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="emailSupport"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email du support</FormLabel>
                            <FormControl>
                              <Input placeholder="support@entreprise.ma" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <Phone className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-lg">Assistance Téléphonique</CardTitle>
                        <CardDescription>Support par téléphone pour les urgences</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="telephone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de téléphone</FormLabel>
                            <FormControl>
                              <Input placeholder="+212XXXXXXXXX" {...field} />
                            </FormControl>
                            <FormDescription>
                              Format: +212XXXXXXXXX
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <MessageCircle className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-lg">Chat Instantané</CardTitle>
                        <CardDescription>Assistance en direct par chat intégré</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp Business (optionnel)</FormLabel>
                            <FormControl>
                              <Input placeholder="+212XXXXXXXXX" {...field} />
                            </FormControl>
                            <FormDescription>
                              Laissez vide pour désactiver le support WhatsApp
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <Clock className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-lg">Heures d'ouverture</CardTitle>
                        <CardDescription>Horaires du service de support</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="heuresOuverture"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heures d'ouverture</FormLabel>
                            <FormControl>
                              <Input placeholder="8h-18h Lun-Ven" {...field} />
                            </FormControl>
                            <FormDescription>
                              Exemple: 8h-18h du Lundi au Vendredi
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end mt-6">
                  <Button type="submit">Enregistrer les modifications</Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      )}

      {/* Section du formulaire de contact */}
      {activeTab === "formulaire" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Configuration du formulaire de demande d'assistance</CardTitle>
            <CardDescription>
              Personnalisez le formulaire de contact intégré dans l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Aperçu du formulaire */}
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-medium mb-4">Aperçu du formulaire de contact</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nom & Prénom</label>
                    <Input value="Mohammed Alami" readOnly className="bg-background/50" />
                    <p className="text-xs text-muted-foreground mt-1">Automatiquement rempli depuis la session</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input value="m.alami@entreprise.ma" readOnly className="bg-background/50" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Catégorie du problème</label>
                  <select className="w-full rounded-md border border-input px-3 py-2 bg-background text-sm">
                    <option>Technique</option>
                    <option>RH</option>
                    <option>Comptabilité</option>
                    <option>Abonnement</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Description du problème</label>
                  <Textarea placeholder="Décrivez votre problème en détail..." className="min-h-[100px]" />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Pièces jointes</label>
                  <div className="border-dashed border-2 border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-muted/20 transition-colors">
                    <p className="text-sm text-muted-foreground">Déposez des fichiers ici ou cliquez pour parcourir</p>
                    <p className="text-xs mt-1 text-muted-foreground">JPG, PNG, PDF • 5 MB max</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Options du formulaire */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Options du formulaire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="req-category" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="req-category" className="text-sm">Catégorie obligatoire</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="req-description" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="req-description" className="text-sm">Description obligatoire</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="allow-attachments" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="allow-attachments" className="text-sm">Autoriser les pièces jointes</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="send-confirmation" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="send-confirmation" className="text-sm">Envoi automatique de confirmation</label>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="text-sm font-medium mb-1 block">Catégories de problèmes</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      Technique <button className="hover:text-destructive">×</button>
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      RH <button className="hover:text-destructive">×</button>
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      Comptabilité <button className="hover:text-destructive">×</button>
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      Abonnement <button className="hover:text-destructive">×</button>
                    </span>
                    <button className="border border-dashed border-primary/50 text-primary px-3 py-1 rounded-full text-sm hover:bg-primary/5 transition-colors">
                      + Ajouter
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button type="button">Enregistrer la configuration</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section de la base de connaissances */}
      {activeTab === "faq" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Base de connaissances (FAQ)</CardTitle>
            <CardDescription>
              Gérez la base de connaissances accessible aux utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Catégories de la FAQ</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">Ajouter une catégorie</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter une catégorie</DialogTitle>
                    <DialogDescription>
                      Créez une nouvelle catégorie dans la base de connaissances
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom de la catégorie</label>
                      <Input placeholder="Ex: Gestion des congés" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea placeholder="Description courte de cette catégorie..." />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Annuler</Button>
                    <Button>Ajouter</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">Gestion de paie</CardTitle>
                    <div className="flex gap-2">
                      <button className="text-xs text-primary hover:underline">Modifier</button>
                      <button className="text-xs text-destructive hover:underline">Supprimer</button>
                    </div>
                  </div>
                  <CardDescription className="text-xs">
                    Questions relatives aux bulletins et calculs de paie
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm">5 articles • Dernière mise à jour: 15/03/2025</p>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">Déclarations CNSS & IR</CardTitle>
                    <div className="flex gap-2">
                      <button className="text-xs text-primary hover:underline">Modifier</button>
                      <button className="text-xs text-destructive hover:underline">Supprimer</button>
                    </div>
                  </div>
                  <CardDescription className="text-xs">
                    Questions sur les déclarations sociales et fiscales
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm">8 articles • Dernière mise à jour: 20/03/2025</p>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">Abonnements et paiements</CardTitle>
                    <div className="flex gap-2">
                      <button className="text-xs text-primary hover:underline">Modifier</button>
                      <button className="text-xs text-destructive hover:underline">Supprimer</button>
                    </div>
                  </div>
                  <CardDescription className="text-xs">
                    Information sur les offres et modalités de facturation
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm">3 articles • Dernière mise à jour: 05/03/2025</p>
                </CardContent>
              </Card>
              
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">Gestion des congés et absences</CardTitle>
                    <div className="flex gap-2">
                      <button className="text-xs text-primary hover:underline">Modifier</button>
                      <button className="text-xs text-destructive hover:underline">Supprimer</button>
                    </div>
                  </div>
                  <CardDescription className="text-xs">
                    Procédures liées aux congés et absences des employés
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm">6 articles • Dernière mise à jour: 12/03/2025</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Paramètres de la FAQ</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="search-faq" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="search-faq" className="text-sm">Activer la recherche dans la FAQ</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="suggest-faq" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="suggest-faq" className="text-sm">Suggestions d'articles automatiques</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="feedback-faq" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="feedback-faq" className="text-sm">Recueillir les retours sur l'utilité des articles</label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="button">Enregistrer les paramètres</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section des notifications */}
      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Paramètres des notifications</CardTitle>
            <CardDescription>
              Configurez les notifications envoyées concernant les demandes d'assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notifications pour l'équipe de support</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Nouvelle demande d'assistance</p>
                      <p className="text-sm text-muted-foreground">Notification lors de la création d'une nouvelle demande</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="notif-new-request" className="rounded border-gray-300" defaultChecked />
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Mise à jour de statut</p>
                      <p className="text-sm text-muted-foreground">Notification lors de la modification du statut d'une demande</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="notif-status-update" className="rounded border-gray-300" defaultChecked />
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Réponse de l'utilisateur</p>
                      <p className="text-sm text-muted-foreground">Notification lorsqu'un utilisateur répond à un ticket</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="notif-user-reply" className="rounded border-gray-300" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="text-sm font-medium mb-2 block">Email pour les notifications de support</label>
                <Input placeholder="support@entreprise.ma" defaultValue="support@entreprise.ma" />
                <p className="text-xs text-muted-foreground mt-1">Email qui recevra les notifications pour l'équipe de support</p>
              </div>
            </div>
            
            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-medium">Notifications pour les utilisateurs</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Confirmation de réception</p>
                      <p className="text-sm text-muted-foreground">Email de confirmation lorsqu'une demande est soumise</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="notif-confirm" className="rounded border-gray-300" defaultChecked />
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Mise à jour du statut</p>
                      <p className="text-sm text-muted-foreground">Notification lorsque le statut d'une demande change</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="notif-status-user" className="rounded border-gray-300" defaultChecked />
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Réponse du support</p>
                      <p className="text-sm text-muted-foreground">Notification lorsque le support répond à une demande</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="notif-support-reply" className="rounded border-gray-300" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button type="button">Enregistrer les paramètres</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParametresAssistanceUtilisateur;
