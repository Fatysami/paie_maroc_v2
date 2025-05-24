
import React, { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Info, Save } from "lucide-react";

export type TrancheIR = {
  id: string;
  min: number;
  max: number | null; // null represents "plus"
  taux: number;
  sommeDeduire: number;
};

type BaremeIREditeurProps = {
  initialTranches?: TrancheIR[];
  onUpdate?: (tranches: TrancheIR[]) => void;
};

const BaremeIREditeur = ({ initialTranches, onUpdate }: BaremeIREditeurProps) => {
  const [tranches, setTranches] = useState<TrancheIR[]>(initialTranches || [
    { id: "1", min: 0, max: 30000, taux: 0, sommeDeduire: 0 },
    { id: "2", min: 30001, max: 50000, taux: 10, sommeDeduire: 3000 },
    { id: "3", min: 50001, max: 60000, taux: 20, sommeDeduire: 8000 },
    { id: "4", min: 60001, max: 80000, taux: 30, sommeDeduire: 14000 },
    { id: "5", min: 80001, max: 180000, taux: 34, sommeDeduire: 17200 },
    { id: "6", min: 180001, max: null, taux: 38, sommeDeduire: 24400 },
  ]);

  const ajouterTranche = () => {
    // Calculer la valeur minimale de la nouvelle tranche
    // (juste après la valeur maximale de la dernière tranche)
    const lastTranche = tranches[tranches.length - 1];
    const nouvelleMin = lastTranche.max ? lastTranche.max + 1 : lastTranche.min + 50000;
    
    // Créer une nouvelle tranche
    const nouvelleTranche: TrancheIR = {
      id: Date.now().toString(),
      min: nouvelleMin,
      max: null,
      taux: lastTranche.taux + 4, // Augmenter légèrement le taux
      sommeDeduire: lastTranche.sommeDeduire + 5000, // Estimation simple
    };
    
    // Mettre à jour la dernière tranche pour qu'elle ait une valeur max
    const tranchesUpdated = tranches.map((t, index) => {
      if (index === tranches.length - 1) {
        return { ...t, max: nouvelleTranche.min - 1 };
      }
      return t;
    });
    
    // Ajouter la nouvelle tranche
    setTranches([...tranchesUpdated, nouvelleTranche]);
  };

  const supprimerTranche = (id: string) => {
    // Ne pas permettre de supprimer s'il ne reste que 2 tranches
    if (tranches.length <= 2) {
      toast.error("Impossible de supprimer cette tranche. Un minimum de 2 tranches est requis.");
      return;
    }

    const trancheIndex = tranches.findIndex(t => t.id === id);
    if (trancheIndex === -1) return;

    // Si c'est la dernière tranche, mettre à jour l'avant-dernière pour qu'elle n'ait pas de max
    let updatedTranches = [...tranches];
    if (trancheIndex === tranches.length - 1) {
      updatedTranches[trancheIndex - 1] = {
        ...updatedTranches[trancheIndex - 1],
        max: null
      };
    } 
    // Si c'est une tranche intermédiaire, ajuster la min de la tranche suivante
    else if (trancheIndex < tranches.length - 1) {
      updatedTranches[trancheIndex + 1] = {
        ...updatedTranches[trancheIndex + 1],
        min: updatedTranches[trancheIndex].min
      };
    }

    // Supprimer la tranche
    updatedTranches = updatedTranches.filter(t => t.id !== id);
    setTranches(updatedTranches);
    toast.success("Tranche supprimée avec succès");
  };

  const updateTranche = (id: string, field: keyof TrancheIR, value: any) => {
    const trancheIndex = tranches.findIndex(t => t.id === id);
    if (trancheIndex === -1) return;

    // Validation spéciale pour min et max
    if (field === 'min') {
      // Si ce n'est pas la première tranche, la min doit être > max de la tranche précédente
      if (trancheIndex > 0) {
        const prevMax = tranches[trancheIndex - 1].max;
        if (prevMax && value <= prevMax) {
          toast.error("La valeur minimum doit être supérieure à la valeur maximum de la tranche précédente");
          return;
        }
      }

      // Si ce n'est pas la dernière tranche, ajuster le max de cette tranche et le min de la suivante
      if (trancheIndex < tranches.length - 1) {
        const nextMin = tranches[trancheIndex + 1].min;
        if (value >= nextMin) {
          toast.error("La valeur minimum doit être inférieure à la valeur minimum de la tranche suivante");
          return;
        }
      }
    }

    if (field === 'max') {
      // Le max doit être > min de cette tranche
      const currentMin = tranches[trancheIndex].min;
      if (value !== null && value <= currentMin) {
        toast.error("La valeur maximum doit être supérieure à la valeur minimum de cette tranche");
        return;
      }

      // Si ce n'est pas la dernière tranche, le max doit être < min de la tranche suivante
      if (trancheIndex < tranches.length - 1) {
        const nextMin = tranches[trancheIndex + 1].min;
        if (value !== null && value >= nextMin) {
          toast.error("La valeur maximum doit être inférieure à la valeur minimum de la tranche suivante");
          return;
        }
      }
    }

    // Mettre à jour la tranche
    const updatedTranches = tranches.map((t, index) => {
      if (index === trancheIndex) {
        return { ...t, [field]: value };
      }
      return t;
    });

    setTranches(updatedTranches);
  };

  const handleEnregistrer = () => {
    if (onUpdate) {
      onUpdate(tranches);
    }
    toast.success("Barème IR enregistré avec succès");
  };

  const handleRestaurationDefaut = () => {
    setTranches([
      { id: "1", min: 0, max: 30000, taux: 0, sommeDeduire: 0 },
      { id: "2", min: 30001, max: 50000, taux: 10, sommeDeduire: 3000 },
      { id: "3", min: 50001, max: 60000, taux: 20, sommeDeduire: 8000 },
      { id: "4", min: 60001, max: 80000, taux: 30, sommeDeduire: 14000 },
      { id: "5", min: 80001, max: 180000, taux: 34, sommeDeduire: 17200 },
      { id: "6", min: 180001, max: null, taux: 38, sommeDeduire: 24400 },
    ]);
    toast.info("Barème IR par défaut restauré");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Barème de l'Impôt sur le Revenu (IR)</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRestaurationDefaut} size="sm">
            Restaurer par défaut
          </Button>
          <Button onClick={ajouterTranche} className="flex items-center gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Ajouter une tranche
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md text-blue-700 dark:text-blue-300 text-sm flex items-start">
        <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium mb-1">Barème annuel de l'IR</p>
          <p>Les tranches sont définies en fonction du revenu annuel imposable en dirhams. La somme à déduire permet un calcul simplifié de l'impôt. Ce barème est conforme à la législation fiscale marocaine actuelle.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border p-2 text-left w-1/4">Tranche</th>
              <th className="border p-2 text-left w-1/6">Taux (%)</th>
              <th className="border p-2 text-left w-1/4">Somme à déduire (MAD)</th>
              <th className="border p-2 text-left w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tranches.map((tranche, index) => (
              <tr key={tranche.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border p-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={tranche.min}
                      onChange={(e) => updateTranche(tranche.id, "min", parseInt(e.target.value))}
                      className="w-24"
                      disabled={index === 0} // La première tranche commence toujours à 0
                    />
                    <span>à</span>
                    {tranche.max !== null ? (
                      <Input
                        type="number"
                        value={tranche.max}
                        onChange={(e) => updateTranche(tranche.id, "max", parseInt(e.target.value))}
                        className="w-24"
                        disabled={index === tranches.length - 1} // La dernière tranche n'a pas de max
                      />
                    ) : (
                      <span className="px-2">Plus</span>
                    )}
                  </div>
                </td>
                <td className="border p-2">
                  <Input
                    type="number"
                    value={tranche.taux}
                    onChange={(e) => updateTranche(tranche.id, "taux", parseInt(e.target.value))}
                    className="w-20"
                  />
                </td>
                <td className="border p-2">
                  <Input
                    type="number"
                    value={tranche.sommeDeduire}
                    onChange={(e) => updateTranche(tranche.id, "sommeDeduire", parseInt(e.target.value))}
                  />
                </td>
                <td className="border p-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => supprimerTranche(tranche.id)}
                    disabled={tranches.length <= 2} // Ne pas permettre de supprimer s'il ne reste que 2 tranches
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={handleEnregistrer} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Enregistrer le barème
        </Button>
      </div>
    </div>
  );
};

export default BaremeIREditeur;
