
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Building, Download, Upload, History, AlertCircle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Validate Moroccan ICE (15 digits)
const validateICE = (ice: string) => /^\d{15}$/.test(ice);

// Validate Moroccan RIB (24 digits)
const validateRIB = (rib: string) => /^\d{24}$/.test(rib);

// Validate Moroccan phone number
const validatePhoneNumber = (phone: string) => /^\+212\s\d\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/.test(phone);

const formSchema = z.object({
  nomEntreprise: z.string().min(2, { message: "Le nom de l'entreprise est obligatoire" }),
  adresse: z.string().min(5, { message: "L'adresse est obligatoire" }),
  ville: z.string().min(1, { message: "La ville est obligatoire" }),
  telephone: z.string().refine(validatePhoneNumber, {
    message: "Format requis: +212 X XX XX XX XX",
  }),
  email: z.string().email({ message: "Email invalide" }),
  devise: z.string().min(1, { message: "La devise est obligatoire" }),
  ice: z.string().refine(validateICE, {
    message: "L'ICE doit contenir exactement 15 chiffres",
  }),
  rc: z.string().min(1, { message: "Le RC est obligatoire" }),
  rib: z.string().refine(validateRIB, {
    message: "Le RIB doit contenir exactement 24 chiffres",
  }),
  banque: z.string().min(1, { message: "La banque est obligatoire" }),
});

type FormValues = z.infer<typeof formSchema>;

// Liste des villes marocaines principales
const villesMaroc = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", 
  "Meknès", "Oujda", "Kenitra", "Tétouan", "El Jadida", "Safi", 
  "Mohammedia", "Khouribga", "Béni Mellal", "Nador", "Taza"
];

// Liste des banques marocaines principales
const banquesMaroc = [
  "Attijariwafa Bank", "Banque Populaire", "BMCE Bank", "Société Générale Maroc",
  "BMCI", "CIH Bank", "Crédit du Maroc", "CFG Bank", "Bank Al Yousr", 
  "Al Barid Bank", "Bank Assafa", "Arab Bank", "Crédit Agricole du Maroc"
];

// Liste des devises
const devises = [
  { code: "MAD", nom: "Dirham marocain" },
  { code: "EUR", nom: "Euro" },
  { code: "USD", nom: "Dollar américain" },
  { code: "GBP", nom: "Livre sterling" }
];

// Données initiales (simulées)
const defaultValues: FormValues = {
  nomEntreprise: "TechSolutions Maroc",
  adresse: "123 Boulevard Mohammed V",
  ville: "Casablanca",
  telephone: "+212 5 22 33 44 55",
  email: "contact@techsolutions.ma",
  devise: "MAD",
  ice: "123456789012345",
  rc: "123456",
  rib: "123456789012345678901234",
  banque: "Attijariwafa Bank",
};

type HistoriqueModification = {
  date: string;
  admin: string;
  champ: string;
  ancienneValeur: string;
  nouvelleValeur: string;
};

// Historique simulé des modifications
const historiqueInitial: HistoriqueModification[] = [
  {
    date: "15/05/2024",
    admin: "Ahmed Benali",
    champ: "Adresse",
    ancienneValeur: "100 Rue des Palmiers",
    nouvelleValeur: "123 Boulevard Mohammed V",
  },
  {
    date: "10/05/2024",
    admin: "Fatima Zahra",
    champ: "Téléphone",
    ancienneValeur: "+212 5 22 11 22 33",
    nouvelleValeur: "+212 5 22 33 44 55",
  },
];

const ParametresEntreprise = () => {
  const [historique, setHistorique] = useState<HistoriqueModification[]>(historiqueInitial);
  const [afficherHistorique, setAfficherHistorique] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: FormValues) => {
    console.log("Données soumises:", data);
    
    // Simuler l'ajout à l'historique
    const nouvelleEntree: HistoriqueModification = {
      date: new Date().toLocaleDateString(),
      admin: "Utilisateur Actuel",
      champ: "Plusieurs champs",
      ancienneValeur: "Valeurs précédentes",
      nouvelleValeur: "Nouvelles valeurs",
    };
    
    setHistorique([nouvelleEntree, ...historique]);
    
    toast("Paramètres enregistrés", {
      description: "Les informations de l'entreprise ont été mises à jour avec succès.",
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast("Fichier trop volumineux", {
          description: "La taille du logo ne doit pas dépasser 2 Mo",
          duration: 3000,
        });
        return;
      }

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast("Format non supporté", {
          description: "Seuls les formats JPG et PNG sont acceptés",
          duration: 3000,
        });
        return;
      }

      setSelectedLogo(file);
      
      // Créer un aperçu du logo
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      toast("Logo ajouté", {
        description: "N'oubliez pas d'enregistrer les modifications",
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <CardTitle>Informations générales de l'entreprise</CardTitle>
          </div>
          <CardDescription>
            Ces informations seront utilisées dans tous les documents officiels générés par l'application,
            comme les bulletins de paie, contrats et déclarations fiscales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Logo de l'entreprise */}
                <div className="col-span-full flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Logo de l'entreprise" 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Building className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-medium">Logo de l'entreprise</h3>
                    <p className="text-sm text-muted-foreground">
                      Téléchargez le logo de votre entreprise (format PNG ou JPG, max 2MB).
                    </p>
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <label className="cursor-pointer">
                          <Upload className="mr-2 h-4 w-4" />
                          Parcourir
                          <input
                            type="file"
                            className="hidden"
                            accept="image/png,image/jpeg"
                            onChange={handleLogoChange}
                          />
                        </label>
                      </Button>
                      {logoPreview && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedLogo(null);
                            setLogoPreview(null);
                          }}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="col-span-full my-2" />

                {/* Informations d'identification */}
                <FormField
                  control={form.control}
                  name="nomEntreprise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'entreprise*</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom légal de l'entreprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input placeholder="email@entreprise.ma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Adresse*</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse postale complète" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ville"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une ville" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {villesMaroc.map((ville) => (
                            <SelectItem key={ville} value={ville}>
                              {ville}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone*</FormLabel>
                      <FormControl>
                        <Input placeholder="+212 X XX XX XX XX" {...field} />
                      </FormControl>
                      <FormDescription>
                        Format: +212 5 22 33 44 55
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="col-span-full my-2" />

                {/* Informations fiscales et bancaires */}
                <FormField
                  control={form.control}
                  name="ice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ICE (Identifiant Commun de l'Entreprise)*</FormLabel>
                      <FormControl>
                        <Input placeholder="15 chiffres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RC (Registre du Commerce)*</FormLabel>
                      <FormControl>
                        <Input placeholder="Numéro du RC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="devise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devise par défaut*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une devise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {devises.map((devise) => (
                            <SelectItem key={devise.code} value={devise.code}>
                              {devise.code} - {devise.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="banque"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banque principale*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une banque" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {banquesMaroc.map((banque) => (
                            <SelectItem key={banque} value={banque}>
                              {banque}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rib"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RIB (Relevé d'Identité Bancaire)*</FormLabel>
                      <FormControl>
                        <Input placeholder="24 chiffres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setAfficherHistorique(!afficherHistorique)}
                >
                  <History className="mr-2 h-4 w-4" />
                  {afficherHistorique ? "Masquer l'historique" : "Afficher l'historique"}
                </Button>
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => form.reset(defaultValues)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">
                    Enregistrer
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Historique des modifications */}
      {afficherHistorique && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="h-6 w-6 text-primary" />
              <CardTitle>Historique des modifications</CardTitle>
            </div>
            <CardDescription>
              Consultez les modifications apportées aux paramètres de l'entreprise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-2 text-left font-medium">Date</th>
                    <th className="py-2 px-2 text-left font-medium">Modifié par</th>
                    <th className="py-2 px-2 text-left font-medium">Champ</th>
                    <th className="py-2 px-2 text-left font-medium">Ancienne valeur</th>
                    <th className="py-2 px-2 text-left font-medium">Nouvelle valeur</th>
                  </tr>
                </thead>
                <tbody>
                  {historique.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2">{item.date}</td>
                      <td className="py-2 px-2">{item.admin}</td>
                      <td className="py-2 px-2">{item.champ}</td>
                      <td className="py-2 px-2">{item.ancienneValeur}</td>
                      <td className="py-2 px-2">{item.nouvelleValeur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes informatives */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3 items-start text-sm bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Informations importantes</p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                <li>Les informations saisies ici apparaîtront sur tous les documents officiels</li>
                <li>Le changement d'ICE ou de RC peut nécessiter une mise à jour des données fiscales</li>
                <li>Les modifications sont enregistrées et tracées pour des raisons de sécurité</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParametresEntreprise;
