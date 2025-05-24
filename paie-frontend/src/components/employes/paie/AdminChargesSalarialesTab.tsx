
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { Employe, PrimeType } from "@/pages/GestionEmployes";
import { calculerPaie } from "@/utils/paie/CalculateurPaie";

interface AdminChargesSalarialesTabProps {
  employe: Employe;
  onUpdate?: (employe: Employe) => void;
}

const AdminChargesSalarialesTab: React.FC<AdminChargesSalarialesTabProps> = ({ employe, onUpdate }) => {
  // Convertir le type de prime pour qu'il soit compatible avec le calculateur
  const convertPrimeType = (type: PrimeType): "fixe" | "pourcentage" => {
    if (type === "pourcentage") return "pourcentage";
    // Pour "ponctuelle" ou "fixe", on utilise "fixe"
    return "fixe";
  };

  // Adapter les données de l'employé au format attendu par le calculateur
  const getDonneesEmploye = () => {
    // Adapter les primes pour ajouter le champ 'imposable' requis par le calculateur
    const primesAdaptees = (employe.primes || []).map(prime => ({
      ...prime,
      imposable: true, // Par défaut, on considère toutes les primes comme imposables
      type: convertPrimeType(prime.type) // Conversion du type pour correspondre à l'attente du calculateur
    }));

    // Adapter les avantages pour ajouter le champ 'imposable' requis par le calculateur
    const avantagesAdaptes = (employe.avantages || []).map(avantage => ({
      ...avantage,
      imposable: true // Par défaut, on considère tous les avantages comme imposables
    }));

    return {
      salaireBase: employe.salaire || 0,
      anciennete: 0, // Utilisation d'une valeur par défaut car 'anciennete' n'existe pas dans Employe
      primes: primesAdaptees,
      avantages: avantagesAdaptes,
      heuresSupplementaires: [],
      absences: [],
      retenues: [],
      parametresCIMR: {
        actif: true,
        tauxSalarie: charges.tauxSociaux.cimr.salarie,
        tauxEmployeur: charges.tauxSociaux.cimr.employeur
      }
    };
  };

  // État pour les charges sociales avec valeurs par défaut
  const [charges, setCharges] = useState({
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
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    salaireBrut: employe.salaire || 0,
    ...charges
  });

  // Calcul des cotisations avec le calculateur de paie
  const resultatPaie = calculerPaie(getDonneesEmploye());

  // Formatter les montants en dirhams
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(montant);
  };

  // Format simplifié pour l'affichage (sans le symbole de devise)
  const formatMontantSimple = (montant: number) => {
    return new Intl.NumberFormat('fr-MA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(montant);
  };

  // Vérifier si des paramètres inhabituels sont présents
  const detecterAnomalies = () => {
    const anomalies = [];
    
    // Vérifications CNSS
    if (!charges.tauxSociaux.cnss.actif && employe.salaire > 0) {
      anomalies.push({
        type: "warning",
        message: "La CNSS est désactivée pour cet employé."
      });
    }
    
    // Vérifications IR
    if (!charges.ir.actif && employe.salaire > 4000) {
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
      const updatedEmploye = {
        ...employe,
        salaire: editValues.salaireBrut
      };
      if (onUpdate) {
        onUpdate(updatedEmploye);
      }
    } else {
      // Initialiser l'édition
      setEditValues({
        salaireBrut: employe.salaire || 0,
        ...charges
      });
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

  const salaireBrut = employe.salaire || 0;
  const salaireBrutFormatted = formatMontantSimple(salaireBrut);
  const salaireNet = resultatPaie.salaireNet;
  const coutTotal = salaireBrut + resultatPaie.fraisEmployeur.total;

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
                          `${salaireBrutFormatted} MAD`
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>CNSS employeur ({charges.tauxSociaux.cnss.employeur}%):</span>
                      <span>{formatMontantSimple(resultatPaie.fraisEmployeur.cnss)} MAD</span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>AMO employeur ({charges.tauxSociaux.amo.employeur}%):</span>
                      <span>{formatMontantSimple(resultatPaie.fraisEmployeur.amo)} MAD</span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>CIMR employeur ({charges.tauxSociaux.cimr.employeur}%):</span>
                      <span>{formatMontantSimple(resultatPaie.fraisEmployeur.cimr || 0)} MAD</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold">
                      <span>Coût total employeur:</span>
                      <span>{formatMontantSimple(coutTotal)} MAD</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-semibold mb-3">Calcul du net</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Salaire brut:</span>
                      <span className="font-medium">{formatMontantSimple(salaireBrut)} MAD</span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>CNSS salarié ({charges.tauxSociaux.cnss.salarie}%):</span>
                      <span>- {formatMontantSimple(resultatPaie.cotisations.cnss)} MAD</span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>AMO salarié ({charges.tauxSociaux.amo.salarie}%):</span>
                      <span>- {formatMontantSimple(resultatPaie.cotisations.amo)} MAD</span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>CIMR salarié ({charges.tauxSociaux.cimr.salarie}%):</span>
                      <span>- {formatMontantSimple(resultatPaie.cotisations.cimr || 0)} MAD</span>
                    </div>
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>Impôt sur le revenu (IR):</span>
                      <span>- {formatMontantSimple(resultatPaie.cotisations.ir)} MAD</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold text-green-700">
                      <span>Salaire net:</span>
                      <span>{formatMontantSimple(salaireNet)} MAD</span>
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

export default AdminChargesSalarialesTab;
