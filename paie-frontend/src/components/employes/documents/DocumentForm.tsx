
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Document, documentSchema, DOCUMENT_TYPES } from "./types";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DocumentFormProps {
  editingDocument: Document | null;
  onSubmit: (data: Document) => void;
}

const DocumentForm = ({ editingDocument, onSubmit }: DocumentFormProps) => {
  const form = useForm<Document>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      nom: editingDocument?.nom || "",
      type: editingDocument?.type || "",
      description: editingDocument?.description || "",
      dateExpiration: editingDocument?.dateExpiration || "",
      obligatoire: editingDocument?.obligatoire || false
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du document</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Contrat CDI" {...field} />
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
              <FormLabel>Type de document</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || "select_type"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="select_type">Choisir un type</SelectItem>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Description ou notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateExpiration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'expiration (optionnel)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Pour les documents avec date de validité
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="obligatoire"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-normal">
                  Document obligatoire
                </FormLabel>
                <FormDescription>
                  Marquer ce document comme requis pour le dossier employé
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {editingDocument && !editingDocument.fileName && (
          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-700">
              Aucun fichier n'est encore associé à ce document. Vous pourrez en télécharger un après création.
            </span>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Annuler</Button>
          </DialogClose>
          <Button type="submit">{editingDocument?.id ? "Mettre à jour" : "Ajouter"}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DocumentForm;
