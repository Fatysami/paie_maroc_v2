
import { useState } from "react";
import { CalendarIcon, Save, Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Evaluation, EvaluationType, Critere } from "./types";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EvaluationFormProps {
  evaluation?: Evaluation;
  employeId: string;
  onSubmit: (evaluation: Evaluation) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  titre: z.string().min(2, "Le titre est requis"),
  type: z.enum(["annuelle", "semestrielle", "trimestrielle", "période-essai", "spéciale"]),
  datePrevue: z.date(),
  objectifsFixes: z.array(z.string()),
});

export const EvaluationForm = ({ evaluation, employeId, onSubmit, onCancel }: EvaluationFormProps) => {
  const [criteres, setCriteres] = useState<Critere[]>(
    evaluation?.criteres || [
      { id: "crit-1", nom: "Qualité du travail", description: "Précision, attention aux détails et rigueur", poids: 20 },
      { id: "crit-2", nom: "Productivité", description: "Efficacité et quantité de travail réalisé", poids: 20 },
      { id: "crit-3", nom: "Compétences techniques", description: "Maîtrise des outils et technologies", poids: 20 },
      { id: "crit-4", nom: "Communication", description: "Échanges avec l'équipe et les parties prenantes", poids: 20 },
      { id: "crit-5", nom: "Initiative", description: "Proactivité et force de proposition", poids: 20 },
    ]
  );
  
  const [newCritere, setNewCritere] = useState({ nom: "", description: "", poids: 10 });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: evaluation?.titre || "",
      type: evaluation?.type || "annuelle",
      datePrevue: evaluation?.datePrevue ? new Date(evaluation.datePrevue) : new Date(),
      objectifsFixes: evaluation?.objectifsFixes || [""],
    },
  });
  
  const handleSubmitForm = (values: z.infer<typeof formSchema>) => {
    // Vérifier que la somme des poids est de 100%
    const poidsTotal = criteres.reduce((total, crit) => total + crit.poids, 0);
    if (poidsTotal !== 100) {
      alert("La somme des pondérations doit être égale à 100%");
      return;
    }
    
    // Filtrer les objectifs vides
    const filteredObjectifs = values.objectifsFixes.filter(obj => obj.trim() !== "");
    
    const newEvaluation: Evaluation = {
      id: evaluation?.id || `eval-${Date.now()}`,
      employeId,
      titre: values.titre,
      type: values.type,
      datePrevue: values.datePrevue.toISOString(),
      dateCreation: evaluation?.dateCreation || new Date().toISOString(),
      status: evaluation?.status || "planifiée",
      criteres,
      objectifsFixes: filteredObjectifs,
      creePar: "Mohammed Alami", // Idéalement, récupérer l'utilisateur connecté
    };
    
    onSubmit(newEvaluation);
  };
  
  const handleAddCritere = () => {
    if (!newCritere.nom || !newCritere.description) {
      return;
    }
    
    const critereId = `crit-${Date.now()}`;
    setCriteres([...criteres, { ...newCritere, id: critereId }]);
    setNewCritere({ nom: "", description: "", poids: 10 });
  };
  
  const handleRemoveCritere = (id: string) => {
    setCriteres(criteres.filter(c => c.id !== id));
  };
  
  const handleCritereChange = (id: string, field: keyof Critere, value: any) => {
    setCriteres(criteres.map(c => (c.id === id ? { ...c, [field]: value } : c)));
  };
  
  const handleAddObjectif = () => {
    const currentObjectifs = form.getValues().objectifsFixes;
    form.setValue("objectifsFixes", [...currentObjectifs, ""]);
  };
  
  const handleRemoveObjectif = (index: number) => {
    const currentObjectifs = form.getValues().objectifsFixes;
    currentObjectifs.splice(index, 1);
    form.setValue("objectifsFixes", [...currentObjectifs]);
  };
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de l'évaluation</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Évaluation annuelle 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'évaluation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="annuelle">Annuelle</SelectItem>
                      <SelectItem value="semestrielle">Semestrielle</SelectItem>
                      <SelectItem value="trimestrielle">Trimestrielle</SelectItem>
                      <SelectItem value="période-essai">Période d'essai</SelectItem>
                      <SelectItem value="spéciale">Spéciale</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="datePrevue"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date prévue de l'évaluation</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal flex justify-between"
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Critères d'évaluation</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Définissez les critères sur lesquels l'employé sera évalué. La somme des pondérations doit être égale à 100%.
            </p>
            
            <div className="space-y-4 mb-6">
              {criteres.map((critere) => (
                <div key={critere.id} className="flex items-start gap-3 p-3 border rounded-md">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Critère</label>
                      <Input
                        value={critere.nom}
                        onChange={(e) => handleCritereChange(critere.id, "nom", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-1 space-y-1">
                      <label className="text-sm font-medium">Pondération (%)</label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={critere.poids}
                        onChange={(e) => handleCritereChange(critere.id, "poids", parseInt(e.target.value))}
                      />
                    </div>
                    <div className="md:col-span-1 space-y-1">
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        value={critere.description}
                        onChange={(e) => handleCritereChange(critere.id, "description", e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCritere(critere.id)}
                    className="h-8 w-8 p-0 text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ajouter un critère</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm">Nom du critère</label>
                    <Input
                      placeholder="Ex: Communication"
                      value={newCritere.nom}
                      onChange={(e) => setNewCritere({ ...newCritere, nom: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm">Pondération (%)</label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="10"
                      value={newCritere.poids}
                      onChange={(e) => setNewCritere({ ...newCritere, poids: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-sm">Description</label>
                    <Input
                      placeholder="Brève description du critère"
                      value={newCritere.description}
                      onChange={(e) => setNewCritere({ ...newCritere, description: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddCritere}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter ce critère
                </Button>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Objectifs à atteindre</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Définissez les objectifs spécifiques à atteindre pour cette période d'évaluation.
              </p>
              
              {form.getValues().objectifsFixes.map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`objectifsFixes.${index}`}
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder="Ex: Augmenter la productivité de 10%" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveObjectif(index)}
                          className="h-9 w-9 p-0"
                          disabled={form.getValues().objectifsFixes.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddObjectif}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un objectif
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {evaluation ? "Enregistrer les modifications" : "Créer l'évaluation"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
