
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle } from "lucide-react";

// Types pour les taux et les valeurs
interface TauxSociaux {
  cnss: {
    employeur: number;
    salarie: number;
    plafond: number;
    actif: boolean;
  };
  amo: {
    employeur: number;
    salarie: number;
    plafond: number | null;
    actif: boolean;
  };
  cimr: {
    employeur: number;
    salarie: number;
    plafond: number | null;
    actif: boolean;
  };
}

interface CalculsIR {
  abattementFraisPro: number;
  actif: boolean;
  tranches: {
    min: number;
    max: number | null;
    taux: number;
  }[];
}

interface EmployeCharges {
  salaireBrut: number;
  tauxSociaux: TauxSociaux;
  ir: CalculsIR;
  exceptions: {
    type: string;
    description: string;
    impact: string;
  }[];
}

interface ChargesSocialesFiscalesTabProps {
  employeId: string;
  employeNom?: string;
}

const ChargesSocialesFiscalesTab: React.FC<ChargesSocialesFiscalesTabProps> = ({ employeId, employeNom }) => {
  // Données simulées pour la démo
  const [charges, setCharges] = useState<EmployeCharges>({
    salaireBrut: 10000,
    tauxSociaux: {
      cnss: {
        employeur: 6.4,
        salarie: 4.48,
        plafond: 6000,
        actif: true
      },
      amo: {
        employeur: 2.26,
        salarie: 2.26,
        plafond: null,
        actif: true
      },
      cimr: {
        employeur: 5.0,
        salarie: 3.0,
        plafond: null,
        actif: true
      }
    },
    ir: {
      abattementFraisPro: 20,
      actif: true,
      tranches: [
        { min: 0, max: 2500, taux: 0 },
        { min: 2500, max: 4166.66, taux: 10 },
        { min: 4166.67, max: 5000, taux: 20 },
        { min: 5000.01, max: 6666.66, taux: 30 },
        { min: 6666.67, max: 15000, taux: 34 },
        { min: 15000.01, max: null, taux: 38 }
      ]
    },
    exceptions: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ ...charges });

  // Calculs des cotisations et du net
  const calculateCNSS = () => {
    const { salaireBrut, tauxSociaux } = charges;
    const { cnss } = tauxSociaux;
    
    if (!cnss.actif) return { employeur: 0, salarie: 0 };
    
    const baseCalcul = Math.min(salaireBrut, cnss.plafond);
    return {
      employeur: (baseCalcul * cnss.employeur) / 100,
      salarie: (baseCalcul * cnss.salarie) / 100
    };
  };

  const calculateAMO = () => {
    const { salaireBrut, tauxSociaux } = charges;
    const { amo } = tauxSociaux;
    
    if (!amo.actif) return { employeur: 0, salarie: 0 };
    
    const baseCalcul = amo.plafond ? Math.min(salaireBrut, amo.plafond) : salaireBrut;
    return {
      employeur: (baseCalcul * amo.employeur) / 100,
      salarie: (baseCalcul * amo.salarie) / 100
    };
  };

  const calculateCIMR = () => {
    const { salaireBrut, tauxSociaux } = charges;
    const { cimr } = tauxSociaux;
    
    if (!cimr.actif) return { employeur: 0, salarie: 0 };
    
    const baseCalcul = cimr.plafond ? Math.min(salaireBrut, cimr.plafond) : salaireBrut;
    return {
      employeur: (baseCalcul * cimr.employeur) / 100,
      salarie: (baseCalcul * cimr.salarie) / 100
    };
  };

  const calculateIR = () => {
    const { salaireBrut, ir } = charges;
    
    if (!ir.actif) return 0;
    
    // Base imposable après déduction des cotisations sociales et abattement
    const cnss = calculateCNSS().salarie;
    const amo = calculateAMO().salarie;
    const cimr = calculateCIMR().salarie;
    
    const totalCotisations = cnss + amo + cimr;
    const abattement = (salaireBrut - totalCotisations) * (ir.abattementFraisPro / 100);
    let baseImposable = salaireBrut - totalCotisations - abattement;
    
    // Annualisation pour le calcul IR
    baseImposable *= 12;
    
    // Calcul par tranches
    let montantIR = 0;
    for (const tranche of ir.tranches) {
      if (baseImposable > tranche.min) {
        const trancheMax = tranche.max !== null ? tranche.max : Infinity;
        const montantTranche = Math.min(baseImposable, trancheMax) - tranche.min;
        const irTranche = (montantTranche * tranche.taux) / 100;
        montantIR += irTranche;
      }
    }
    
    // Mensualisation du résultat
    return montantIR / 12;
  };

  const totalChargesEmployeur = () => {
    const cnss = calculateCNSS().employeur;
    const amo = calculateAMO().employeur;
    const cimr = calculateCIMR().employeur;
    return cnss + amo + cimr;
  };

  const totalChargesSalarie = () => {
    const cnss = calculateCNSS().salarie;
    const amo = calculateAMO().salarie;
    const cimr = calculateCIMR().salarie;
    const ir = calculateIR();
    return cnss + amo + cimr + ir;
  };

  const salaireNet = () => {
    return charges.salaireBrut - totalChargesSalarie();
  };

  const coutTotalEmployeur = () => {
    return charges.salaireBrut + totalChargesEmployeur();
  };

  // Formater les montants en dirhams
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(montant);
  };

  // Vérifier si des paramètres inhabituels sont présents
  const detecterAnomalies = () => {
    const anomalies = [];
    
    // Vérifications CNSS
    if (!charges.tauxSociaux.cnss.actif && charges.salaireBrut > 0) {
      anomalies.push({
        type: "warning",
        message: "La CNSS est désactivée pour cet employé."
      });
    }
    
    // Vérifications IR
    if (!charges.ir.actif && charges.salaireBrut > 4000) {
      anomalies.push({
        type: "warning",
        message: "L'IR est désactivé alors que le salaire est imposable."
      });
    }
    
    // Vérifications AMO
    if (!charges.tauxSociaux.amo.actif) {
      anomalies.push({
        type: "error",
        message: "L'AMO est obligatoire pour tous les employés."
      });
    }
    
    return anomalies;
  };

  const anomalies = detecterAnomalies();

  // Gérer l'édition des charges
  const handleEditToggle = () => {
    if (isEditing) {
      // Appliquer les modifications
      setCharges(editValues);
    } else {
      // Initialiser l'édition
      setEditValues({ ...charges });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (path: string, value: string) => {
    const newEditValues = { ...editValues };
    const pathParts = path.split('.');
    
    let current: any = newEditValues;
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    
    const lastPart = pathParts[pathParts.length - 1];
    current[lastPart] = value === '' ? 0 : Number(value);
    
    setEditValues(newEditValues);
  };

  const handleToggleChange = (path: string) => {
    const newEditValues = { ...editValues };
    const pathParts = path.split('.');
    
    let current: any = newEditValues;
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    
    const lastPart = pathParts[pathParts.length - 1];
    current[lastPart] = !current[lastPart];
    
    setEditValues(newEditValues);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Charges Sociales & Fiscales</h2>
        <Button 
          onClick={handleEditToggle}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? "Enregistrer les modifications" : "Modifier ponctuellement"}
        </Button>
      </div>

      {anomalies.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2">
              {anomalies.map((anomalie, index) => (
                <li key={index} className="text-sm">
                  {anomalie.type === "error" ? (
                    <Badge variant="destructive" className="mr-1">Erreur</Badge>
                  ) : (
                    <Badge variant="outline" className="mr-1 bg-yellow-100 text-yellow-800">Avertissement</Badge>
                  )}
                  {anomalie.message}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Simulation du coût total employé</CardTitle>
            <CardDescription>
              Calcul en temps réel des charges sociales et fiscales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-semibold mb-3">Salaire et charges</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Salaire brut:</span>
                      <span className="font-medium">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editValues.salaireBrut}
                            onChange={(e) => handleInputChange('salaireBrut', e.target.value)}
                            className="w-28 h-7 text-right inline-block"
                          />
                        ) : (
                          formatMontant(charges.salaireBrut)
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>CNSS employeur ({charges.tauxSociaux.cnss.employeur}%):</span>
                      <span>{formatMontant(calculateCNSS().employeur)}</span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>AMO employeur ({charges.tauxSociaux.amo.employeur}%):</span>
                      <span>{formatMontant(calculateAMO().employeur)}</span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>CIMR employeur ({charges.tauxSociaux.cimr.employeur}%):</span>
                      <span>{formatMontant(calculateCIMR().employeur)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold">
                      <span>Coût total employeur:</span>
                      <span>{formatMontant(coutTotalEmployeur())}</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-semibold mb-3">Calcul du net</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Salaire brut:</span>
                      <span className="font-medium">{formatMontant(charges.salaireBrut)}</span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>CNSS salarié ({charges.tauxSociaux.cnss.salarie}%):</span>
                      <span>- {formatMontant(calculateCNSS().salarie)}</span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>AMO salarié ({charges.tauxSociaux.amo.salarie}%):</span>
                      <span>- {formatMontant(calculateAMO().salarie)}</span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>CIMR salarié ({charges.tauxSociaux.cimr.salarie}%):</span>
                      <span>- {formatMontant(calculateCIMR().salarie)}</span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>Impôt sur le revenu (IR):</span>
                      <span>- {formatMontant(calculateIR())}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold text-green-700">
                      <span>Salaire net:</span>
                      <span>{formatMontant(salaireNet())}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Note importante</AlertTitle>
                <AlertDescription>
                  Cette simulation est basée sur les paramètres de paie actuels. Les valeurs réelles peuvent 
                  différer en fonction d'autres éléments variables comme les primes, heures supplémentaires, etc.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paramètres appliqués</CardTitle>
            <CardDescription>
              Taux sociaux et fiscaux spécifiques à cet employé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  CNSS
                  {isEditing && (
                    <div className="ml-2">
                      <Label htmlFor="cnss-toggle" className="sr-only">
                        Activer/Désactiver CNSS
                      </Label>
                      <input
                        id="cnss-toggle"
                        type="checkbox"
                        checked={editValues.tauxSociaux.cnss.actif}
                        onChange={() => handleToggleChange('tauxSociaux.cnss.actif')}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  )}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="cnss-employeur">Taux employeur</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="cnss-employeur"
                          type="number"
                          step="0.01"
                          value={editValues.tauxSociaux.cnss.employeur}
                          onChange={(e) => handleInputChange('tauxSociaux.cnss.employeur', e.target.value)}
                          disabled={!editValues.tauxSociaux.cnss.actif}
                        />
                      ) : (
                        <div className="py-2 px-3 border rounded-md bg-muted">
                          {charges.tauxSociaux.cnss.employeur}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cnss-salarie">Taux salarié</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="cnss-salarie"
                          type="number"
                          step="0.01"
                          value={editValues.tauxSociaux.cnss.salarie}
                          onChange={(e) => handleInputChange('tauxSociaux.cnss.salarie', e.target.value)}
                          disabled={!editValues.tauxSociaux.cnss.actif}
                        />
                      ) : (
                        <div className="py-2 px-3 border rounded-md bg-muted">
                          {charges.tauxSociaux.cnss.salarie}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  AMO
                  {isEditing && (
                    <div className="ml-2">
                      <Label htmlFor="amo-toggle" className="sr-only">
                        Activer/Désactiver AMO
                      </Label>
                      <input
                        id="amo-toggle"
                        type="checkbox"
                        checked={editValues.tauxSociaux.amo.actif}
                        onChange={() => handleToggleChange('tauxSociaux.amo.actif')}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  )}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="amo-employeur">Taux employeur</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="amo-employeur"
                          type="number"
                          step="0.01"
                          value={editValues.tauxSociaux.amo.employeur}
                          onChange={(e) => handleInputChange('tauxSociaux.amo.employeur', e.target.value)}
                          disabled={!editValues.tauxSociaux.amo.actif}
                        />
                      ) : (
                        <div className="py-2 px-3 border rounded-md bg-muted">
                          {charges.tauxSociaux.amo.employeur}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="amo-salarie">Taux salarié</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="amo-salarie"
                          type="number"
                          step="0.01"
                          value={editValues.tauxSociaux.amo.salarie}
                          onChange={(e) => handleInputChange('tauxSociaux.amo.salarie', e.target.value)}
                          disabled={!editValues.tauxSociaux.amo.actif}
                        />
                      ) : (
                        <div className="py-2 px-3 border rounded-md bg-muted">
                          {charges.tauxSociaux.amo.salarie}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  CIMR
                  {isEditing && (
                    <div className="ml-2">
                      <Label htmlFor="cimr-toggle" className="sr-only">
                        Activer/Désactiver CIMR
                      </Label>
                      <input
                        id="cimr-toggle"
                        type="checkbox"
                        checked={editValues.tauxSociaux.cimr.actif}
                        onChange={() => handleToggleChange('tauxSociaux.cimr.actif')}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  )}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="cimr-employeur">Taux employeur</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="cimr-employeur"
                          type="number"
                          step="0.01"
                          value={editValues.tauxSociaux.cimr.employeur}
                          onChange={(e) => handleInputChange('tauxSociaux.cimr.employeur', e.target.value)}
                          disabled={!editValues.tauxSociaux.cimr.actif}
                        />
                      ) : (
                        <div className="py-2 px-3 border rounded-md bg-muted">
                          {charges.tauxSociaux.cimr.employeur}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cimr-salarie">Taux salarié</Label>
                    <div className="mt-1">
                      {isEditing ? (
                        <Input
                          id="cimr-salarie"
                          type="number"
                          step="0.01"
                          value={editValues.tauxSociaux.cimr.salarie}
                          onChange={(e) => handleInputChange('tauxSociaux.cimr.salarie', e.target.value)}
                          disabled={!editValues.tauxSociaux.cimr.actif}
                        />
                      ) : (
                        <div className="py-2 px-3 border rounded-md bg-muted">
                          {charges.tauxSociaux.cimr.salarie}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  Impôt sur le Revenu (IR)
                  {isEditing && (
                    <div className="ml-2">
                      <Label htmlFor="ir-toggle" className="sr-only">
                        Activer/Désactiver IR
                      </Label>
                      <input
                        id="ir-toggle"
                        type="checkbox"
                        checked={editValues.ir.actif}
                        onChange={() => handleToggleChange('ir.actif')}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                  )}
                </h3>
                <div>
                  <Label htmlFor="ir-abattement">Abattement frais professionnels</Label>
                  <div className="mt-1">
                    {isEditing ? (
                      <Input
                        id="ir-abattement"
                        type="number"
                        step="0.01"
                        value={editValues.ir.abattementFraisPro}
                        onChange={(e) => handleInputChange('ir.abattementFraisPro', e.target.value)}
                        disabled={!editValues.ir.actif}
                      />
                    ) : (
                      <div className="py-2 px-3 border rounded-md bg-muted">
                        {charges.ir.abattementFraisPro}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Les modifications effectuées ici n'affectent que cet employé et 
              constituent des exceptions aux règles globales définies dans les paramètres.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChargesSocialesFiscalesTab;
