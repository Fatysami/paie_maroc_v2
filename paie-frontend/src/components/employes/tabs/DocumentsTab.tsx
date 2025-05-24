
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";

interface DocumentsTabProps {
  control: Control<any>;
}

const DocumentsTab = ({ control }: DocumentsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <FormField
          control={control}
          name="gererDocumentsUlterieurement"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-3">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                  className="mt-1"
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="text-base font-medium">
                  Ajouter documents après création
                </FormLabel>
                <FormDescription>
                  Vous serez redirigé vers une interface dédiée pour le téléchargement et la gestion des documents (contrat, CIN, RIB, etc.) après création de l'employé.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <h3 className="text-base font-medium mb-2">Documents essentiels à préparer</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span>Contrat de travail signé</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span>Copie CIN recto-verso</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span>Attestation RIB</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span>Fiche de poste signée</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentsTab;
