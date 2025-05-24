
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Save, AlertCircle, Calculator } from "lucide-react";
import { Employe } from "@/pages/GestionEmployes";
import { calculerPaie } from "@/utils/paie/CalculateurPaie";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from 'uuid';

interface Prime {
  id: string;
  nom: string;
  montant: number;
  type: string;
}

interface Avantage {
  id: string;
  nom: string;
  valeur: number;
  type: string;
}

interface Absence {
  id: string;
  type: string;
  jours: number;
  deduction: number;
}

interface DonneesPaie {
  salaireBase: number;
  primes: Prime[];
  avantages: Avantage[];
  absences: Absence[];
  statut: "en_attente" | "valide" | "paye";
  notes: string;
  calculBrut: number;
  calculNet: number;
}

interface DetailPaieMensuelleFormProps {
  employe: Employe;
  donneesPaie: DonneesPaie;
  onSave: (donneesPaie: DonneesPaie) => void;
  moisPaie: string;
}

const DetailPaieMensuelleForm: React.FC<DetailPaieMensuelleFormProps> = ({
  employe,
  donneesPaie,
  onSave,
  moisPaie
}) => {
  const [formData, setFormData] = useState<DonneesPaie>({
    salaireBase: donneesPaie?.salaireBase || employe.salaireBase,
    primes: donneesPaie?.primes || [],
    avantages: donneesPaie?.avantages || [],
    absences: donneesPaie?.absences || [],
    statut: donneesPaie?.statut || "en_attente",
    notes: donneesPaie?.notes || "",
    calculBrut: donneesPaie?.calculBrut || 0,
    calculNet: donneesPaie?.calculNet || 0
  });

  const [nouvellePrime, setNouvellePrime] = useState<Partial<Prime>>({
    nom: "",
    montant: 0,
    type: "fixe"
  });

  const [nouvelAvantage, setNouvelAvantage] = useState<Partial<Avantage>>({
    nom: "",
    valeur: 0,
    type: "autre"
  });

  const [nouvelleAbsence, setNouvelleAbsence] = useState<Partial<Absence>>({
    type: "nonjustifiee",
    jours: 0,
    deduction: 0
  });

  // Recalculer le brut et net à chaque changement des données
  useEffect(() => {
    recalculerPaie();
  }, [formData.salaireBase, formData.primes, formData.avantages, formData.absences]);

  // Format montant 
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-MA', { 
      style: 'currency', 
      currency: 'MAD',
      maximumFractionDigits: 2
    }).format(montant);
  };

  // Formater le mois pour l'affichage
  const formatMois = (dateStr: string) => {
    const [annee, mois] = dateStr.split('-');
    const date = new Date(parseInt(annee), parseInt(mois) - 1, 1);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  // Calculer le total des primes
  const calculerTotalPrimes = () => {
    return formData.primes.reduce((total, prime) => total + prime.montant, 0);
  };

  // Calculer le total des avantages
  const calculerTotalAvantages = () => {
    return formData.avantages.reduce((total, avantage) => total + avantage.valeur, 0);
  };

  // Calculer le total des absences
  const calculerTotalAbsences = () => {
    return formData.absences.reduce((total, absence) => total + absence.deduction, 0);
  };

  // Ajouter une prime
  const ajouterPrime = () => {
    if (!nouvellePrime.nom || !nouvellePrime.montant) return;
    
    const prime: Prime = {
      id: uuidv4(),
      nom: nouvellePrime.nom || "",
      montant: Number(nouvellePrime.montant) || 0,
      type: nouvellePrime.type || "fixe"
    };
    
    setFormData({
      ...formData,
      primes: [...formData.primes, prime]
    });
    
    // Réinitialiser le formulaire
    setNouvellePrime({ nom: "", montant: 0, type: "fixe" });
  };

  // Supprimer une prime
  const supprimerPrime = (id: string) => {
    setFormData({
      ...formData,
      primes: formData.primes.filter(prime => prime.id !== id)
    });
  };

  // Ajouter un avantage
  const ajouterAvantage = () => {
    if (!nouvelAvantage.nom || !nouvelAvantage.valeur) return;
    
    const avantage: Avantage = {
      id: uuidv4(),
      nom: nouvelAvantage.nom || "",
      valeur: Number(nouvelAvantage.valeur) || 0,
      type: nouvelAvantage.type || "autre"
    };
    
    setFormData({
      ...formData,
      avantages: [...formData.avantages, avantage]
    });
    
    // Réinitialiser le formulaire
    setNouvelAvantage({ nom: "", valeur: 0, type: "autre" });
  };

  // Supprimer un avantage
  const supprimerAvantage = (id: string) => {
    setFormData({
      ...formData,
      avantages: formData.avantages.filter(avantage => avantage.id !== id)
    });
  };

  // Ajouter une absence
  const ajouterAbsence = () => {
    if (!nouvelleAbsence.jours) return;
    
    // Calculer la déduction en fonction du salaire journalier
    const salaireJournalier = formData.salaireBase / 26; // 26 jours ouvrables par mois
    const deduction = Math.round(Number(nouvelleAbsence.jours) * salaireJournalier);
    
    const absence: Absence = {
      id: uuidv4(),
      type: nouvelleAbsence.type || "nonjustifiee",
      jours: Number(nouvelleAbsence.jours) || 0,
      deduction: deduction
    };
    
    setFormData({
      ...formData,
      absences: [...formData.absences, absence]
    });
    
    // Réinitialiser le formulaire
    setNouvelleAbsence({ type: "nonjustifiee", jours: 0, deduction: 0 });
  };

  // Supprimer une absence
  const supprimerAbsence = (id: string) => {
    setFormData({
      ...formData,
      absences: formData.absences.filter(absence => absence.id !== id)
    });
  };

  // Mettre à jour le salaire de base
  const updateSalaireBase = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      salaireBase: Number(e.target.value)
    });
  };

  // Mettre à jour les notes
  const updateNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      notes: e.target.value
    });
  };

  // Mettre à jour le statut
  const updateStatut = (statut: "en_attente" | "valide" | "paye") => {
    setFormData({
      ...formData,
      statut
    });
  };

  // Recalculer la paie
  const recalculerPaie = () => {
    // Conversion des données pour le calculateur
    const donneesCalcul = {
      salaireBase: formData.salaireBase,
      anciennete: 0, // À calculer à partir de la date d'embauche
      primes: formData.primes.map(p => ({
        nom: p.nom,
        montant: p.montant,
        type: p.type as "fixe" | "pourcentage",
        imposable: true
      })),
      avantages: formData.avantages.map(a => ({
        nom: a.nom,
        valeur: a.valeur,
        imposable: true
      })),
      heuresSupplementaires: [],
      absences: formData.absences.map(a => ({
        type: a.type as "justifiee" | "nonjustifiee" | "maladie" | "congeSansSolde",
        jours: a.jours
      })),
      retenues: [],
      parametresCIMR: employe.affiliationCimr ? {
        actif: true,
        tauxSalarie: employe.tauxCimr || 3,
        tauxEmployeur: (employe.tauxCimr || 3) * 1.5
      } : undefined
    };

    try {
      // Calculer la paie
      const resultat = calculerPaie(donneesCalcul);
      
      setFormData(prev => ({
        ...prev,
        calculBrut: resultat.salaireBrut,
        calculNet: resultat.salaireNet
      }));
    } catch (error) {
      console.error("Erreur de calcul de paie:", error);
    }
  };

  // Enregistrer les modifications
  const enregistrerModifications = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="elements">
        <TabsList className="w-full">
          <TabsTrigger value="elements">Éléments de paie</TabsTrigger>
          <TabsTrigger value="absences">Absences et retenues</TabsTrigger>
          <TabsTrigger value="statut">Statut et commentaires</TabsTrigger>
          <TabsTrigger value="resume">Résumé</TabsTrigger>
        </TabsList>
        
        <TabsContent value="elements" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Salaire et éléments fixes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="salaireBase">Salaire de base</Label>
                    <Input 
                      id="salaireBase" 
                      type="number" 
                      value={formData.salaireBase} 
                      onChange={updateSalaireBase}
                    />
                    <p className="text-xs text-gray-500">
                      Salaire contractuel (avant primes et déductions)
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Informations contractuelles</Label>
                  </div>
                  <div className="rounded-md border p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Poste:</span>
                      <span>{employe.poste}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Département:</span>
                      <span>{employe.departement}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type de contrat:</span>
                      <span>{employe.typeContrat}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date d'embauche:</span>
                      <span>{new Date(employe.dateEmbauche).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Primes et compléments</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={ajouterPrime}
                  disabled={!nouvellePrime.nom || !nouvellePrime.montant}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Ajouter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="primeName">Intitulé</Label>
                    <Input 
                      id="primeName" 
                      value={nouvellePrime.nom} 
                      onChange={(e) => setNouvellePrime({...nouvellePrime, nom: e.target.value})}
                      placeholder="Ex: Prime de performance"
                    />
                  </div>
                  <div>
                    <Label htmlFor="primeType">Type</Label>
                    <Select 
                      value={nouvellePrime.type} 
                      onValueChange={(value) => setNouvellePrime({...nouvellePrime, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type de prime" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixe">Montant fixe</SelectItem>
                        <SelectItem value="pourcentage">Pourcentage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="primeAmount">Montant</Label>
                    <Input 
                      id="primeAmount" 
                      type="number" 
                      value={nouvellePrime.montant} 
                      onChange={(e) => setNouvellePrime({...nouvellePrime, montant: Number(e.target.value)})}
                      placeholder="Montant"
                    />
                  </div>
                </div>
                
                <Separator />
                
                {formData.primes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Intitulé</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.primes.map((prime) => (
                        <TableRow key={prime.id}>
                          <TableCell>{prime.nom}</TableCell>
                          <TableCell>
                            {prime.type === "fixe" ? "Fixe" : "Pourcentage"}
                          </TableCell>
                          <TableCell>
                            {prime.type === "fixe" 
                              ? formatMontant(prime.montant)
                              : `${prime.montant}% (${formatMontant(formData.salaireBase * prime.montant / 100)})`
                            }
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => supprimerPrime(prime.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} className="font-medium text-right">
                          Total:
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatMontant(calculerTotalPrimes())}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Aucune prime ajoutée pour ce mois
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Avantages en nature</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={ajouterAvantage}
                  disabled={!nouvelAvantage.nom || !nouvelAvantage.valeur}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Ajouter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="avantageName">Intitulé</Label>
                    <Input 
                      id="avantageName" 
                      value={nouvelAvantage.nom} 
                      onChange={(e) => setNouvelAvantage({...nouvelAvantage, nom: e.target.value})}
                      placeholder="Ex: Téléphone pro"
                    />
                  </div>
                  <div>
                    <Label htmlFor="avantageType">Type</Label>
                    <Select 
                      value={nouvelAvantage.type} 
                      onValueChange={(value) => setNouvelAvantage({...nouvelAvantage, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type d'avantage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="telephone">Téléphone</SelectItem>
                        <SelectItem value="vehicule">Véhicule</SelectItem>
                        <SelectItem value="logement">Logement</SelectItem>
                        <SelectItem value="mutuelle">Mutuelle</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="avantageValue">Valeur</Label>
                    <Input 
                      id="avantageValue" 
                      type="number" 
                      value={nouvelAvantage.valeur} 
                      onChange={(e) => setNouvelAvantage({...nouvelAvantage, valeur: Number(e.target.value)})}
                      placeholder="Valeur"
                    />
                  </div>
                </div>
                
                <Separator />
                
                {formData.avantages.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Intitulé</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Valeur</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.avantages.map((avantage) => (
                        <TableRow key={avantage.id}>
                          <TableCell>{avantage.nom}</TableCell>
                          <TableCell className="capitalize">{avantage.type}</TableCell>
                          <TableCell>{formatMontant(avantage.valeur)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => supprimerAvantage(avantage.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} className="font-medium text-right">
                          Total:
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatMontant(calculerTotalAvantages())}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Aucun avantage en nature ajouté pour ce mois
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="absences" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Absences et congés sans solde</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={ajouterAbsence}
                  disabled={!nouvelleAbsence.jours}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Ajouter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="absenceType">Type d'absence</Label>
                    <Select 
                      value={nouvelleAbsence.type} 
                      onValueChange={(value) => setNouvelleAbsence({...nouvelleAbsence, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type d'absence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="justifiee">Absence justifiée</SelectItem>
                        <SelectItem value="nonjustifiee">Absence non justifiée</SelectItem>
                        <SelectItem value="maladie">Maladie</SelectItem>
                        <SelectItem value="congeSansSolde">Congé sans solde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="absenceDays">Nombre de jours</Label>
                    <Input 
                      id="absenceDays" 
                      type="number" 
                      value={nouvelleAbsence.jours} 
                      onChange={(e) => setNouvelleAbsence({...nouvelleAbsence, jours: Number(e.target.value)})}
                      placeholder="Jours"
                    />
                  </div>
                </div>
                
                <Separator />
                
                {formData.absences.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Jours</TableHead>
                        <TableHead>Déduction</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.absences.map((absence) => (
                        <TableRow key={absence.id}>
                          <TableCell>
                            {absence.type === "justifiee" && "Absence justifiée"}
                            {absence.type === "nonjustifiee" && "Absence non justifiée"}
                            {absence.type === "maladie" && "Maladie"}
                            {absence.type === "congeSansSolde" && "Congé sans solde"}
                          </TableCell>
                          <TableCell>{absence.jours}</TableCell>
                          <TableCell className="text-red-600">- {formatMontant(absence.deduction)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => supprimerAbsence(absence.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} className="font-medium text-right">
                          Total déductions:
                        </TableCell>
                        <TableCell className="font-medium text-red-600">
                          - {formatMontant(calculerTotalAbsences())}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Aucune absence enregistrée pour ce mois
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statut" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Statut de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RadioGroup 
                  value={formData.statut} 
                  onValueChange={(value: "en_attente" | "valide" | "paye") => updateStatut(value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="en_attente" id="en_attente" />
                    <Label htmlFor="en_attente" className="flex items-center">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 mr-2">En attente</Badge>
                      En cours de préparation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="valide" id="valide" />
                    <Label htmlFor="valide" className="flex items-center">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 mr-2">Validé</Badge>
                      Bulletin validé, prêt pour paiement
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paye" id="paye" />
                    <Label htmlFor="paye" className="flex items-center">
                      <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">Payé</Badge>
                      Paiement effectué
                    </Label>
                  </div>
                </RadioGroup>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes internes (visibles uniquement par RH)</Label>
                  <Textarea 
                    id="notes" 
                    value={formData.notes} 
                    onChange={updateNotes}
                    placeholder="Notes ou commentaires concernant cette paie"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resume" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-muted-foreground" />
                  Récapitulatif - {formatMois(moisPaie)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Salaire de base</span>
                    <span>{formatMontant(formData.salaireBase)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Primes et compléments</span>
                    <span>{formatMontant(calculerTotalPrimes())}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Avantages en nature</span>
                    <span>{formatMontant(calculerTotalAvantages())}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Absences et retenues</span>
                    <span className="text-red-600">- {formatMontant(calculerTotalAbsences())}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 font-bold">
                    <span>Salaire brut</span>
                    <span>{formatMontant(formData.calculBrut)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 font-bold">
                    <span>Salaire net à payer</span>
                    <span>{formatMontant(formData.calculNet)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-muted-foreground" />
                  Informations importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 p-4 rounded-md bg-blue-50 text-blue-800">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Statut de la paie: {formData.statut === "en_attente" ? "En attente" : formData.statut === "valide" ? "Validé" : "Payé"}</p>
                    <p className="text-sm">Pour {formatMois(moisPaie)}</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Paramètres appliqués</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cotisations sociales:</span>
                      <span>6.35% (CNSS) + 2.25% (AMO)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">CIMR:</span>
                      <span>{employe.affiliationCimr ? `${employe.tauxCimr || 3}%` : "Non applicable"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">IR (approx.):</span>
                      <span>12%</span>
                    </div>
                  </div>
                </div>
                
                {formData.notes && (
                  <div className="p-4 rounded-md bg-yellow-50">
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm whitespace-pre-line">{formData.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={recalculerPaie}>
          <Calculator className="h-4 w-4 mr-2" /> Recalculer
        </Button>
        <Button onClick={enregistrerModifications}>
          <Save className="h-4 w-4 mr-2" /> Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
};

export default DetailPaieMensuelleForm;
