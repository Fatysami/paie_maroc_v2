
import { useState } from "react";
import { Employe } from "@/pages/GestionEmployes";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminChargesSalarialesTab from "../paie/AdminChargesSalarialesTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PaieTabProps {
  employe?: Employe;
  onUpdate?: (employe: Employe) => void;
  control?: Control<any>;
  isNewEmploye?: boolean;
}

const PaieTab = ({ employe, onUpdate, control, isNewEmploye = false }: PaieTabProps) => {
  // If this is being used within a form, render the form fields
  if (control) {
    return (
      <div className="space-y-4">
        <FormField
          control={control}
          name="salaireBase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salaire de base</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Salaire mensuel" {...field} />
              </FormControl>
              <FormDescription>
                Le salaire mensuel brut de l'employé
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="modePaiement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mode de paiement</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un mode de paiement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Virement bancaire">Virement bancaire</SelectItem>
                  <SelectItem value="Espèces">Espèces</SelectItem>
                  <SelectItem value="Chèque">Chèque</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="banque"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banque</FormLabel>
              <FormControl>
                <Input placeholder="Nom de la banque" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="rib"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RIB</FormLabel>
              <FormControl>
                <Input placeholder="Relevé d'identité bancaire" {...field} />
              </FormControl>
              <FormDescription>
                Le RIB de l'employé pour les virements
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }

  // Default view for employee details
  if (!employe) return null;

  // Calculate total salary including primes
  const calculateTotalSalary = () => {
    const baseSalary = employe.salaire || 0;
    const fixedPrimes = (employe.primes || [])
      .filter(prime => prime.type === "fixe")
      .reduce((sum, prime) => sum + prime.montant, 0);
    
    const percentagePrimes = (employe.primes || [])
      .filter(prime => prime.type === "pourcentage")
      .reduce((sum, prime) => sum + (baseSalary * prime.montant / 100), 0);
      
    return baseSalary + fixedPrimes + percentagePrimes;
  };

  // Format currency to MAD
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', { 
      style: 'currency', 
      currency: 'MAD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const totalSalary = calculateTotalSalary();

  return (
    <div className="space-y-8">
      <Tabs defaultValue="resume" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resume">Résumé de paie</TabsTrigger>
          <TabsTrigger value="charges">Charges sociales</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resume">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium mb-4">Informations de salaire</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Salaire de base:</span>
                  <span className="font-medium">{employe.salaire?.toLocaleString('fr-FR')} DH</span>
                </div>
                
                {employe.primes && employe.primes.length > 0 && (
                  <div className="border-b pb-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Primes:</span>
                      <span className="font-medium">
                        {employe.primes
                          .filter(prime => prime.type !== 'pourcentage')
                          .reduce((sum, prime) => sum + prime.montant, 0)
                          .toLocaleString('fr-FR')} DH
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 ml-4 space-y-1">
                      {employe.primes.map(prime => (
                        <div className="flex justify-between" key={prime.id}>
                          <span>{prime.nom}</span>
                          <span>
                            {prime.type === 'pourcentage' 
                              ? `${prime.montant}%` 
                              : `${prime.montant.toLocaleString('fr-FR')} DH`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {employe.avantages && employe.avantages.length > 0 && (
                  <div className="border-b pb-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Avantages en nature:</span>
                      <span className="font-medium">
                        {employe.avantages
                          .reduce((sum, avantage) => sum + avantage.valeur, 0)
                          .toLocaleString('fr-FR')} DH
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 ml-4 space-y-1">
                      {employe.avantages.map(avantage => (
                        <div className="flex justify-between" key={avantage.id}>
                          <span>{avantage.nom}</span>
                          <span>{avantage.valeur.toLocaleString('fr-FR')} DH</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between pt-2 font-bold">
                  <span>Total:</span>
                  <span>
                    {(
                      employe.salaire +
                      (employe.primes?.filter(p => p.type !== 'pourcentage').reduce((sum, p) => sum + p.montant, 0) || 0) +
                      (employe.salaire * ((employe.primes?.filter(p => p.type === 'pourcentage').reduce((sum, p) => sum + p.montant, 0) || 0) / 100))
                    ).toLocaleString('fr-FR')} DH
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium mb-4">Prochain paiement</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(new Date().setDate(new Date().getDate() + 15)).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Méthode:</span>
                  <span className="font-medium">{employe.modePaiement || "Virement bancaire"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Statut:</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    En attente
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Coût employeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Salaire brut</span>
                    <span>{formatCurrency(totalSalary)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Charges patronales</span>
                    <span>{formatCurrency(totalSalary * 0.185)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cotisation CIMR (employeur)</span>
                    <span>{formatCurrency(totalSalary * (employe.tauxCimr ? (employe.tauxCimr / 100) : 0.06))}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Coût total</span>
                    <span>{formatCurrency(totalSalary + (totalSalary * 0.185) + (totalSalary * (employe.tauxCimr ? (employe.tauxCimr / 100) : 0.06)))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Net à payer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Salaire brut</span>
                    <span>{formatCurrency(totalSalary)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cotisations salariales</span>
                    <span>- {formatCurrency(totalSalary * 0.0635)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impôt sur le revenu (IR)</span>
                    <span>- {formatCurrency(totalSalary * 0.12)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cotisation CIMR (salarié)</span>
                    <span>- {formatCurrency(totalSalary * (employe.tauxCimr ? (employe.tauxCimr / 100) : 0.03))}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Net à payer</span>
                    <span>{formatCurrency(totalSalary - (totalSalary * 0.0635) - (totalSalary * 0.12) - (totalSalary * (employe.tauxCimr ? (employe.tauxCimr / 100) : 0.03)))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Paramètres appliqués</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Paramètres CNSS</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taux salarial</span>
                      <span>6.35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taux patronal</span>
                      <span>18.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plafond</span>
                      <span>6,000 DH</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Paramètres AMO</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taux salarial</span>
                      <span>2.25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taux patronal</span>
                      <span>4.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plafond</span>
                      <span>Aucun</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Paramètres CIMR</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taux salarial</span>
                      <span>{employe.tauxCimr || 3}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taux patronal</span>
                      <span>{employe.tauxCimr ? employe.tauxCimr * 2 : 6}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Affiliation</span>
                      <span>{employe.affiliationCimr ? "Oui" : "Non"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="charges">
          {employe && <AdminChargesSalarialesTab employe={employe} onUpdate={onUpdate} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaieTab;
