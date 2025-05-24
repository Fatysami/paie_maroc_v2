
import React, { useState } from "react";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  DatabaseBackup, 
  CloudUpload, 
  Clock, 
  Calendar,
  CheckCircle2, 
  XCircle, 
  Clock4, 
  AlertCircle, 
  CloudDownload, 
  ShieldCheck 
} from "lucide-react";

// Schéma de validation pour le formulaire de configuration des sauvegardes
const backupConfigSchema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly"]),
  timeHour: z.string().min(1, "L'heure est requise"),
  timeMinute: z.string().min(1, "Les minutes sont requises"),
  cloudStorage: z.boolean(),
  localStorage: z.boolean(),
  encryptionEnabled: z.boolean(),
  emailNotifications: z.boolean(),
  retentionPeriod: z.string().min(1, "La période de rétention est requise"),
});

type BackupConfigFormValues = z.infer<typeof backupConfigSchema>;

// Interface pour les sauvegardes
interface Backup {
  id: string;
  date: string;
  time: string;
  type: string;
  storage: string;
  status: "success" | "failed" | "in-progress";
  size: string;
}

const ParametresSauvegardeRestauration = () => {
  // État pour stocker la liste des sauvegardes
  const [backups, setBackups] = useState<Backup[]>([
    {
      id: "1",
      date: "12/03/2025",
      time: "02:00",
      type: "Auto (quotidienne)",
      storage: "Cloud AWS",
      status: "success",
      size: "100 Mo"
    },
    {
      id: "2",
      date: "13/03/2025",
      time: "01:30",
      type: "Manuelle",
      storage: "Locale (NAS)",
      status: "success",
      size: "95 Mo"
    },
    {
      id: "3",
      date: "14/03/2025",
      time: "02:00",
      type: "Auto",
      storage: "Hybride",
      status: "failed",
      size: "0 Mo"
    },
    {
      id: "4",
      date: "15/03/2025",
      time: "02:00",
      type: "Auto (quotidienne)",
      storage: "Cloud AWS",
      status: "in-progress",
      size: "En cours..."
    }
  ]);

  // État pour contrôler l'ouverture de la boîte de dialogue de restauration
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  // État pour stocker la sauvegarde sélectionnée pour la restauration
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);

  // Formulaire de configuration des sauvegardes
  const form = useForm<BackupConfigFormValues>({
    resolver: zodResolver(backupConfigSchema),
    defaultValues: {
      frequency: "daily",
      timeHour: "02",
      timeMinute: "00",
      cloudStorage: true,
      localStorage: true,
      encryptionEnabled: true,
      emailNotifications: true,
      retentionPeriod: "90",
    },
  });

  // Soumission du formulaire
  const onSubmit = (values: BackupConfigFormValues) => {
    console.log(values);
    toast.success("Configuration des sauvegardes enregistrée avec succès.");
  };

  // Fonction pour gérer la restauration
  const handleRestore = () => {
    if (selectedBackup) {
      toast.success(`Restauration des données du ${selectedBackup.date} démarrée.`);
      setOpenRestoreDialog(false);
    }
  };

  // Fonction pour lancer une sauvegarde manuelle
  const handleManualBackup = () => {
    toast.success("Sauvegarde manuelle démarrée. Vous serez notifié une fois terminée.");
    
    // Simuler l'ajout d'une nouvelle sauvegarde en cours
    const newBackup: Backup = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("fr-FR"),
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      type: "Manuelle",
      storage: "Hybride",
      status: "in-progress",
      size: "En cours..."
    };
    
    setBackups(prev => [newBackup, ...prev]);
  };

  // Fonction pour afficher l'icône de statut appropriée
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "in-progress":
        return <Clock4 className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Paramètres de Sauvegarde & Restauration</h2>
        <p className="text-muted-foreground mt-1">
          Configurez les options de sauvegarde et de restauration des données de votre application
        </p>
      </div>
      
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <DatabaseBackup className="h-6 w-6 text-primary" />
              Configuration des sauvegardes automatiques
            </CardTitle>
            <CardDescription>
              Configurez les paramètres de sauvegarde automatique pour assurer la sécurité de vos données.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fréquence de sauvegarde</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une fréquence" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Quotidienne (recommandée)</SelectItem>
                            <SelectItem value="weekly">Hebdomadaire</SelectItem>
                            <SelectItem value="monthly">Mensuelle</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          La fréquence à laquelle vos données seront automatiquement sauvegardées.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-4">
                    <FormField
                      control={form.control}
                      name="timeHour"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Heure</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="23" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timeMinute"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Minute</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="59" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="cloudStorage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Stockage Cloud</FormLabel>
                          <FormDescription>
                            Sauvegarder vos données dans le cloud (AWS, Azure, GCP)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="localStorage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Stockage Local</FormLabel>
                          <FormDescription>
                            Sauvegarder vos données localement (NAS, disque externe)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="encryptionEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Cryptage des sauvegardes</FormLabel>
                          <FormDescription>
                            Activer le cryptage avancé (AES-256) pour les sauvegardes
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Notifications par email</FormLabel>
                          <FormDescription>
                            Recevoir des notifications pour chaque sauvegarde/restauration
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="retentionPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Période de rétention (jours)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Nombre de jours pendant lesquels les sauvegardes seront conservées
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Conformité CNDP (Loi 09-08)</AlertTitle>
                  <AlertDescription>
                    Les paramètres de cryptage et de rétention sont conformes aux exigences légales marocaines (CNDP) sur la protection des données personnelles.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end">
                  <Button type="submit">Enregistrer la configuration</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <CloudUpload className="h-6 w-6 text-primary" />
                Gestion des sauvegardes
              </CardTitle>
              <CardDescription>
                Visualisez l'état des sauvegardes et lancez des sauvegardes manuelles.
              </CardDescription>
            </div>
            <Button onClick={handleManualBackup} className="flex items-center gap-2">
              <DatabaseBackup className="h-4 w-4" />
              Sauvegarde manuelle
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Stockage</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>{backup.date}</TableCell>
                      <TableCell>{backup.time}</TableCell>
                      <TableCell>{backup.type}</TableCell>
                      <TableCell>{backup.storage}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {getStatusIcon(backup.status)}
                        {backup.status === "success" ? "Réussie" :
                         backup.status === "failed" ? "Échouée" :
                         backup.status === "in-progress" ? "En cours" : ""}
                      </TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell>
                        {backup.status === "success" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBackup(backup);
                              setOpenRestoreDialog(true);
                            }}
                            className="flex items-center gap-1"
                          >
                            <CloudDownload className="h-4 w-4" />
                            Restaurer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Boîte de dialogue de confirmation de restauration */}
      <Dialog open={openRestoreDialog} onOpenChange={setOpenRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CloudDownload className="h-5 w-5" />
              Confirmer la restauration
            </DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de restaurer les données à partir de la sauvegarde du {selectedBackup?.date} à {selectedBackup?.time}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>
                Cette action remplacera toutes les données actuelles par celles de la sauvegarde. Cette opération est irréversible.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenRestoreDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleRestore} variant="destructive">
              Confirmer la restauration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParametresSauvegardeRestauration;
