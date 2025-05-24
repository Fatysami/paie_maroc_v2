
import React, { useState } from "react";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { 
  FileSpreadsheet, 
  FileText, 
  FileJson, 
  Clock, 
  Edit, 
  Trash, 
  Plus, 
  Settings2, 
  File, 
  Upload,
  Calendar,
  Building,
  BarChart,
  BanknoteIcon,
  UserCheck
} from "lucide-react";

// Types pour les rapports
interface RapportType {
  id: string;
  name: string;
  description: string;
  formats: string[];
  isCustomizable: boolean;
  icon: React.ReactNode;
}

// Types pour les formats d'exportation
interface FormatExport {
  id: string;
  name: string;
  description: string;
  extension: string;
  icon: React.ReactNode;
  isEnabled: boolean;
}

// Type pour l'historique des rapports
interface HistoriqueRapport {
  id: string;
  date: string;
  rapport: string;
  periode: string;
  generePar: string;
  format: string;
  statut: "Généré" | "Envoyé" | "Archivé" | "Échec";
}

// Schéma de validation pour les rapports
const rapportSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().min(5, "La description est requise"),
  formats: z.array(z.string()).min(1, "Sélectionnez au moins un format"),
  isCustomizable: z.boolean(),
});

type RapportFormValues = z.infer<typeof rapportSchema>;

// Schéma pour les paramètres d'archivage
const archivageSchema = z.object({
  dureeConservation: z.number().min(1, "La durée minimum est de 1 an").max(20, "La durée maximum est de 20 ans"),
  archivageAutomatique: z.boolean(),
  notificationsArchivage: z.boolean(),
});

type ArchivageFormValues = z.infer<typeof archivageSchema>;

const ParametresExportsRapports = () => {
  // États pour les onglets internes
  const [activeTab, setActiveTab] = useState("rapports");
  
  // État pour les rapports disponibles
  const [rapportsTypes, setRapportsTypes] = useState<RapportType[]>([
    {
      id: "1",
      name: "Bulletins de paie mensuels",
      description: "Récapitulatif individuel des salaires versés, avec détails CNSS/IR",
      formats: ["pdf"],
      isCustomizable: true,
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: "2",
      name: "Rapport récapitulatif de paie",
      description: "Synthèse des salaires versés, charges sociales, fiscales",
      formats: ["excel", "pdf"],
      isCustomizable: true,
      icon: <BarChart className="h-5 w-5" />
    },
    {
      id: "3",
      name: "Rapport d'assiduité et congés",
      description: "Synthèse des congés et absences par employé ou par département",
      formats: ["excel", "pdf"],
      isCustomizable: true,
      icon: <UserCheck className="h-5 w-5" />
    },
    {
      id: "4",
      name: "Rapport annuel de paie",
      description: "Récapitulatif annuel global des paiements, IR, CNSS",
      formats: ["excel", "pdf"],
      isCustomizable: true,
      icon: <Calendar className="h-5 w-5" />
    },
    {
      id: "5",
      name: "Rapport des virements bancaires",
      description: "Liste des virements envoyés aux banques",
      formats: ["csv", "excel"],
      isCustomizable: true,
      icon: <BanknoteIcon className="h-5 w-5" />
    },
  ]);

  // État pour les formats d'exportation
  const [formatsExport, setFormatsExport] = useState<FormatExport[]>([
    {
      id: "pdf",
      name: "PDF",
      description: "Format sécurisé, idéal pour bulletins, attestations",
      extension: ".pdf",
      icon: <FileText className="h-5 w-5" />,
      isEnabled: true
    },
    {
      id: "excel",
      name: "Excel (XLSX)",
      description: "Traitement et analyse des données en masse",
      extension: ".xlsx",
      icon: <FileSpreadsheet className="h-5 w-5" />,
      isEnabled: true
    },
    {
      id: "csv",
      name: "CSV",
      description: "Données brutes pour import/export facile",
      extension: ".csv",
      icon: <FileJson className="h-5 w-5" />,
      isEnabled: true
    }
  ]);

  // État pour l'historique des exports
  const [historiqueRapports, setHistoriqueRapports] = useState<HistoriqueRapport[]>([
    {
      id: "1",
      date: "01/03/2025",
      rapport: "Bulletins mensuels",
      periode: "Février 2025",
      generePar: "Admin RH",
      format: "PDF",
      statut: "Généré"
    },
    {
      id: "2",
      date: "05/03/2025",
      rapport: "CNSS Mensuel",
      periode: "Février 2025",
      generePar: "Comptable",
      format: "Excel",
      statut: "Envoyé"
    },
    {
      id: "3",
      date: "31/12/2025",
      rapport: "Rapport annuel paie",
      periode: "2025",
      generePar: "Admin RH",
      format: "Excel",
      statut: "Archivé"
    }
  ]);

  // État pour la boîte de dialogue
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRapport, setEditingRapport] = useState<RapportType | null>(null);

  // Formulaire pour ajouter/éditer un rapport
  const rapportForm = useForm<RapportFormValues>({
    resolver: zodResolver(rapportSchema),
    defaultValues: {
      name: "",
      description: "",
      formats: [],
      isCustomizable: true,
    }
  });

  // Formulaire pour les paramètres d'archivage
  const archivageForm = useForm<ArchivageFormValues>({
    resolver: zodResolver(archivageSchema),
    defaultValues: {
      dureeConservation: 5,
      archivageAutomatique: true,
      notificationsArchivage: true,
    }
  });

  // Gestion des soumissions du formulaire d'archivage
  const onSubmitArchivage = (data: ArchivageFormValues) => {
    console.log("Paramètres d'archivage sauvegardés:", data);
    toast.success("Paramètres d'archivage sauvegardés avec succès");
  };

  // Réinitialiser le formulaire lors de l'ouverture
  const handleAddRapport = () => {
    setEditingRapport(null);
    rapportForm.reset({
      name: "",
      description: "",
      formats: [],
      isCustomizable: true,
    });
    setOpenDialog(true);
  };

  // Éditer un rapport existant
  const handleEditRapport = (rapport: RapportType) => {
    setEditingRapport(rapport);
    rapportForm.reset({
      name: rapport.name,
      description: rapport.description,
      formats: rapport.formats,
      isCustomizable: rapport.isCustomizable,
    });
    setOpenDialog(true);
  };

  // Supprimer un rapport
  const handleDeleteRapport = (id: string) => {
    setRapportsTypes(rapportsTypes.filter(rapport => rapport.id !== id));
    toast.success("Rapport supprimé avec succès");
  };

  // Sauvegarder un rapport
  const saveRapport = (data: RapportFormValues) => {
    if (editingRapport) {
      // Mise à jour d'un rapport existant
      setRapportsTypes(
        rapportsTypes.map(rapport => 
          rapport.id === editingRapport.id 
            ? { ...rapport, ...data } 
            : rapport
        )
      );
      toast.success("Rapport mis à jour avec succès");
    } else {
      // Ajout d'un nouveau rapport
      const newRapport: RapportType = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        formats: data.formats,
        isCustomizable: data.isCustomizable,
        icon: <File className="h-5 w-5" />
      };
      setRapportsTypes([...rapportsTypes, newRapport]);
      toast.success("Nouveau rapport ajouté avec succès");
    }
    setOpenDialog(false);
    rapportForm.reset();
  };

  // Activer/désactiver un format d'exportation
  const toggleFormatExport = (id: string) => {
    setFormatsExport(
      formatsExport.map(format => 
        format.id === id 
          ? { ...format, isEnabled: !format.isEnabled } 
          : format
      )
    );
    toast.success(`Format ${id.toUpperCase()} ${formatsExport.find(f => f.id === id)?.isEnabled ? 'désactivé' : 'activé'}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramétrage des Exportations et Rapports</CardTitle>
          <CardDescription>
            Configurez les types de rapports, formats d'exportation et paramètres d'archivage pour votre entreprise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="rapports">Types de Rapports</TabsTrigger>
              <TabsTrigger value="formats">Formats d'Exportation</TabsTrigger>
              <TabsTrigger value="archivage">Archivage et Historique</TabsTrigger>
            </TabsList>

            {/* Section Types de Rapports */}
            <TabsContent value="rapports">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Types de rapports disponibles</h3>
                  <Button onClick={handleAddRapport}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un rapport
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Nom du rapport</TableHead>
                      <TableHead className="w-[300px]">Description</TableHead>
                      <TableHead className="w-[150px]">Formats disponibles</TableHead>
                      <TableHead className="w-[100px]">Personnalisable</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rapportsTypes.map(rapport => (
                      <TableRow key={rapport.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            {rapport.icon}
                            <span>{rapport.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{rapport.description}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {rapport.formats.map(format => {
                              const formatInfo = formatsExport.find(f => f.id === format);
                              return (
                                <div 
                                  key={format} 
                                  className="rounded px-2 py-1 text-xs bg-primary/10 text-primary flex items-center"
                                  title={formatInfo?.name || format}
                                >
                                  {formatInfo?.icon}
                                  <span className="ml-1">{format.toUpperCase()}</span>
                                </div>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          {rapport.isCustomizable ? "Oui" : "Non"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditRapport(rapport)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteRapport(rapport.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Section Formats d'Exportation */}
            <TabsContent value="formats">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Formats d'exportation disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formatsExport.map(format => (
                    <Card key={format.id} className={`${!format.isEnabled ? 'opacity-60' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            {format.icon}
                            <CardTitle className="text-lg">{format.name}</CardTitle>
                          </div>
                          <Switch 
                            checked={format.isEnabled} 
                            onCheckedChange={() => toggleFormatExport(format.id)} 
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">{format.description}</p>
                        <div className="text-xs bg-primary/10 text-primary rounded px-2 py-1 inline-block">
                          Extension: {format.extension}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Paramètres de personnalisation</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">En-tête des documents</h4>
                            <p className="text-sm text-muted-foreground">Logo, nom, adresse, ICE de l'entreprise</p>
                          </div>
                          <Button variant="outline">
                            <Settings2 className="mr-2 h-4 w-4" />
                            Personnaliser
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Pied de page des documents</h4>
                            <p className="text-sm text-muted-foreground">Coordonnées bancaires, mentions légales</p>
                          </div>
                          <Button variant="outline">
                            <Settings2 className="mr-2 h-4 w-4" />
                            Personnaliser
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Paramètres d'envoi automatique</h4>
                            <p className="text-sm text-muted-foreground">Configuration des emails et destinataires</p>
                          </div>
                          <Button variant="outline">
                            <Settings2 className="mr-2 h-4 w-4" />
                            Configurer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Section Archivage et Historique */}
            <TabsContent value="archivage">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Paramètres d'archivage</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <Form {...archivageForm}>
                        <form onSubmit={archivageForm.handleSubmit(onSubmitArchivage)} className="space-y-4">
                          <FormField
                            control={archivageForm.control}
                            name="dureeConservation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Durée de conservation (années)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                </FormControl>
                                <FormDescription>
                                  Durée minimale légale au Maroc: 5 ans
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={archivageForm.control}
                            name="archivageAutomatique"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Archivage automatique</FormLabel>
                                  <FormDescription>
                                    Archiver automatiquement les rapports générés
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
                            control={archivageForm.control}
                            name="notificationsArchivage"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Notifications d'archivage</FormLabel>
                                  <FormDescription>
                                    Recevoir des notifications lors de l'archivage
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
                          
                          <Button type="submit">Enregistrer les paramètres</Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Historique des rapports générés</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Rapport</TableHead>
                        <TableHead>Période</TableHead>
                        <TableHead>Généré par</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historiqueRapports.map(historique => (
                        <TableRow key={historique.id}>
                          <TableCell>{historique.date}</TableCell>
                          <TableCell>{historique.rapport}</TableCell>
                          <TableCell>{historique.periode}</TableCell>
                          <TableCell>{historique.generePar}</TableCell>
                          <TableCell>{historique.format}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              historique.statut === 'Généré' ? 'bg-blue-100 text-blue-800' :
                              historique.statut === 'Envoyé' ? 'bg-green-100 text-green-800' :
                              historique.statut === 'Archivé' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {historique.statut}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" title="Télécharger">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialogue pour ajouter/éditer un rapport */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRapport ? "Modifier le rapport" : "Ajouter un nouveau rapport"}
            </DialogTitle>
            <DialogDescription>
              {editingRapport 
                ? "Modifiez les détails du rapport existant"
                : "Créez un nouveau type de rapport pour votre entreprise"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...rapportForm}>
            <form onSubmit={rapportForm.handleSubmit(saveRapport)} className="space-y-4">
              <FormField
                control={rapportForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du rapport</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={rapportForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={rapportForm.control}
                name="formats"
                render={() => (
                  <FormItem>
                    <FormLabel>Formats disponibles</FormLabel>
                    <div className="flex flex-col space-y-2">
                      {formatsExport.map(format => (
                        <FormField
                          key={format.id}
                          control={rapportForm.control}
                          name="formats"
                          render={({ field }) => {
                            return (
                              <FormItem 
                                key={format.id}
                                className="flex flex-row items-center space-x-2"
                              >
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={`format-${format.id}`}
                                      checked={field.value?.includes(format.id)}
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        const updatedFormats = checked
                                          ? [...field.value, format.id]
                                          : field.value?.filter(
                                              (value) => value !== format.id
                                            );
                                        field.onChange(updatedFormats);
                                      }}
                                      className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <label 
                                      htmlFor={`format-${format.id}`}
                                      className="text-sm flex items-center"
                                    >
                                      {format.icon}
                                      <span className="ml-2">{format.name}</span>
                                    </label>
                                  </div>
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={rapportForm.control}
                name="isCustomizable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Rapport personnalisable</FormLabel>
                      <FormDescription>
                        Permettre la personnalisation des champs et colonnes
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Annuler</Button>
                </DialogClose>
                <Button type="submit">
                  {editingRapport ? "Mettre à jour" : "Ajouter"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParametresExportsRapports;
