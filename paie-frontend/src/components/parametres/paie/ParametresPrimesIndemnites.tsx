
import React, { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";

export type Prime = {
  id: string;
  name: string;
  type: "fixed" | "percentage";
  amount: number;
  condition: string;
  taxable: boolean;
};

type ParametresPrimesIndemnitesProps = {
  initialPrimes?: Prime[];
  onUpdate?: (primes: Prime[]) => void;
};

const ParametresPrimesIndemnites = ({ initialPrimes, onUpdate }: ParametresPrimesIndemnitesProps) => {
  const [primes, setPrimes] = useState<Prime[]>(initialPrimes || [
    {
      id: "1",
      name: "Prime de transport",
      type: "fixed",
      amount: 500,
      condition: "Tous les employés",
      taxable: true
    }
  ]);

  const addPrime = () => {
    const newPrime: Prime = {
      id: Date.now().toString(),
      name: `Nouvelle prime`,
      type: "fixed",
      amount: 0,
      condition: "",
      taxable: true
    };
    
    setPrimes([...primes, newPrime]);
  };

  const removePrime = (id: string) => {
    setPrimes(primes.filter(prime => prime.id !== id));
    toast.success("Prime supprimée avec succès");
  };

  const updatePrime = (id: string, field: keyof Prime, value: any) => {
    setPrimes(primes.map(prime => 
      prime.id === id ? { ...prime, [field]: value } : prime
    ));
  };

  const handleSavePrimes = () => {
    if (onUpdate) {
      onUpdate(primes);
    }
    toast.success("Primes et indemnités enregistrées avec succès");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Gestion des primes et indemnités</h3>
        <Button onClick={addPrime} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une prime
        </Button>
      </div>

      {primes.map((prime) => (
        <Card key={prime.id} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`prime-name-${prime.id}`}>Nom de la prime</Label>
              <Input
                id={`prime-name-${prime.id}`}
                value={prime.name}
                onChange={(e) => updatePrime(prime.id, "name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Type de calcul</Label>
              <RadioGroup
                value={prime.type}
                onValueChange={(value: "fixed" | "percentage") => 
                  updatePrime(prime.id, "type", value)
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id={`fixed-${prime.id}`} />
                  <Label htmlFor={`fixed-${prime.id}`}>Montant fixe</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id={`percentage-${prime.id}`} />
                  <Label htmlFor={`percentage-${prime.id}`}>Pourcentage du salaire</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`prime-amount-${prime.id}`}>
                {prime.type === "fixed" ? "Montant (MAD)" : "Pourcentage (%)"}
              </Label>
              <Input
                id={`prime-amount-${prime.id}`}
                type="number"
                value={prime.amount}
                onChange={(e) => updatePrime(prime.id, "amount", parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`prime-condition-${prime.id}`}>Condition d'attribution</Label>
              <Input
                id={`prime-condition-${prime.id}`}
                value={prime.condition}
                onChange={(e) => updatePrime(prime.id, "condition", e.target.value)}
                placeholder="Ex: Après 1 an d'ancienneté"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id={`prime-taxable-${prime.id}`}
                checked={prime.taxable}
                onCheckedChange={(checked) => updatePrime(prime.id, "taxable", checked)}
              />
              <Label htmlFor={`prime-taxable-${prime.id}`}>
                Soumis à l'IR et à la CNSS
              </Label>
            </div>

            <div className="flex items-center justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removePrime(prime.id)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <div className="flex justify-end mt-4">
        <Button onClick={handleSavePrimes}>Enregistrer les primes</Button>
      </div>
    </div>
  );
};

export default ParametresPrimesIndemnites;
