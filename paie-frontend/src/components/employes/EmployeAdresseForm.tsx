
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from 'react-hook-form';

export interface Adresse {
  rue: string;
  ville: string;
  pays: string;
  codePostal: string;
  complement?: string;
}

interface EmployeAdresseFormProps {
  control: Control<any>;
  prefix?: string;
}

const EmployeAdresseForm: React.FC<EmployeAdresseFormProps> = ({ control, prefix = "adresse" }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`${prefix}.rue`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rue et numéro</FormLabel>
            <FormControl>
              <Input {...field} placeholder="123 Rue des Fleurs" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`${prefix}.ville`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Casablanca" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${prefix}.codePostal`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code postal</FormLabel>
              <FormControl>
                <Input {...field} placeholder="20000" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={`${prefix}.pays`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pays</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Maroc" defaultValue="Maroc" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`${prefix}.complement`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Complément d'adresse (optionnel)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Appartement, étage, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default EmployeAdresseForm;

