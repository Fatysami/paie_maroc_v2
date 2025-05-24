
import { useState } from "react";
import { Employe, Prime, Avantage, PrimeType, PrimeFrequence, AvantageType } from "@/pages/GestionEmployes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface DetailPrimesAvantagesProps {
  employe: Employe;
  onUpdate: (employe: Employe) => void;
  isNewEmploye?: boolean;
}

// Define form types for primes and avantages
type PrimeFormData = Omit<Prime, 'id'> & { id?: string; description?: string };
type AvantageFormData = Omit<Avantage, 'id'> & { id?: string };

const DetailPrimesAvantages = ({ employe, onUpdate, isNewEmploye = false }: DetailPrimesAvantagesProps) => {
  const [isPrimeDialogOpen, setIsPrimeDialogOpen] = useState(false);
  const [isAvantageDialogOpen, setIsAvantageDialogOpen] = useState(false);
  const [editingPrime, setEditingPrime] = useState<PrimeFormData | null>(null);
  const [editingAvantage, setEditingAvantage] = useState<AvantageFormData | null>(null);
  
  // Initialize primes and avantages arrays if they don't exist
  const primes = employe.primes || [];
  const avantages = employe.avantages || [];
  
  const handleAddPrime = () => {
    setEditingPrime({
      nom: "",
      montant: 0,
      type: "fixe",
      frequence: "mensuelle",
    });
    setIsPrimeDialogOpen(true);
  };
  
  const handleEditPrime = (prime: Prime) => {
    setEditingPrime({ ...prime });
    setIsPrimeDialogOpen(true);
  };
  
  const handleDeletePrime = (id: string) => {
    const updatedPrimes = primes.filter(p => p.id !== id);
    const updatedEmploye = { ...employe, primes: updatedPrimes };
    onUpdate(updatedEmploye);
    toast.success("Prime supprimée avec succès");
  };
  
  const handleAddAvantage = () => {
    setEditingAvantage({
      nom: "",
      type: "autre",
      valeur: 0,
    });
    setIsAvantageDialogOpen(true);
  };
  
  const handleEditAvantage = (avantage: Avantage) => {
    setEditingAvantage({ ...avantage });
    setIsAvantageDialogOpen(true);
  };
  
  const handleDeleteAvantage = (id: string) => {
    const updatedAvantages = avantages.filter(a => a.id !== id);
    const updatedEmploye = { ...employe, avantages: updatedAvantages };
    onUpdate(updatedEmploye);
    toast.success("Avantage supprimé avec succès");
  };
  
  const handlePrimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPrime) return;
    
    // Ensure all required fields are present
    if (!editingPrime.nom || editingPrime.montant === undefined) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    let updatedPrimes: Prime[];
    
    if (editingPrime.id) {
      // Update existing prime
      updatedPrimes = primes.map(p => 
        p.id === editingPrime.id ? { ...editingPrime, id: p.id } as Prime : p
      );
    } else {
      // Add new prime
      const newPrime: Prime = {
        ...editingPrime,
        id: `prime-${Date.now()}`,
        frequence: (editingPrime.frequence || "mensuelle") as PrimeFrequence,
      };
      updatedPrimes = [...primes, newPrime];
    }
    
    const updatedEmploye = { ...employe, primes: updatedPrimes };
    onUpdate(updatedEmploye);
    
    setIsPrimeDialogOpen(false);
    setEditingPrime(null);
    toast.success(editingPrime.id ? "Prime mise à jour avec succès" : "Prime ajoutée avec succès");
  };
  
  const handleAvantageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingAvantage) return;
    
    // Ensure all required fields are present
    if (!editingAvantage.nom || editingAvantage.valeur === undefined) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    let updatedAvantages: Avantage[];
    
    if (editingAvantage.id) {
      // Update existing avantage
      updatedAvantages = avantages.map(a => 
        a.id === editingAvantage.id ? { ...editingAvantage, id: a.id } as Avantage : a
      );
    } else {
      // Add new avantage
      const newAvantage: Avantage = {
        ...editingAvantage,
        id: `avantage-${Date.now()}`,
        type: (editingAvantage.type || "autre") as AvantageType,
      };
      updatedAvantages = [...avantages, newAvantage];
    }
    
    const updatedEmploye = { ...employe, avantages: updatedAvantages };
    onUpdate(updatedEmploye);
    
    setIsAvantageDialogOpen(false);
    setEditingAvantage(null);
    toast.success(editingAvantage.id ? "Avantage mis à jour avec succès" : "Avantage ajouté avec succès");
  };
  
  const handlePrimeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingPrime(prev => prev ? { ...prev, [name]: name === 'montant' ? parseFloat(value) || 0 : value } : null);
  };
  
  const handleAvantageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingAvantage(prev => prev ? { ...prev, [name]: name === 'valeur' ? parseFloat(value) || 0 : value } : null);
  };
  
  const handlePrimeSelectChange = (name: string, value: string) => {
    setEditingPrime(prev => prev ? { ...prev, [name]: value } : null);
  };
  
  const handleAvantageSelectChange = (name: string, value: string) => {
    setEditingAvantage(prev => prev ? { ...prev, [name]: value } : null);
  };
  
  return (
    <div className="space-y-8">
      {isNewEmploye && (
        <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Configuration des primes et avantages</h3>
          <p className="text-blue-700">
            Cet espace vous permet de configurer les primes et avantages pour {employe.prenom} {employe.nom}.
          </p>
        </div>
      )}
      
      <Tabs defaultValue="primes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="primes">Primes</TabsTrigger>
          <TabsTrigger value="avantages">Avantages en nature</TabsTrigger>
        </TabsList>
        
        {/* Onglet des primes */}
        <TabsContent value="primes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Liste des primes</h3>
            <Button onClick={handleAddPrime}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une prime
            </Button>
          </div>
          
          {primes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {primes.map(prime => (
                <Card key={prime.id} className="p-4 border relative">
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditPrime(prime)}>
                      <Edit2 className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeletePrime(prime.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <h4 className="font-medium">{prime.nom}</h4>
                  <div className="mt-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Montant:</span>
                      <span className="font-medium">
                        {prime.type === 'pourcentage' 
                          ? `${prime.montant}%` 
                          : `${prime.montant.toLocaleString('fr-FR')} DH`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{prime.type === 'fixe' ? 'Fixe' : prime.type === 'pourcentage' ? 'Pourcentage' : 'Ponctuelle'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fréquence:</span>
                      <span>{prime.frequence}</span>
                    </div>
                    {prime.description && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">{prime.description}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border">
              <p className="text-gray-500">Aucune prime configurée</p>
              <Button variant="outline" className="mt-2" onClick={handleAddPrime}>
                Ajouter une prime
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Onglet des avantages */}
        <TabsContent value="avantages" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Avantages en nature</h3>
            <Button onClick={handleAddAvantage}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un avantage
            </Button>
          </div>
          
          {avantages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {avantages.map(avantage => (
                <Card key={avantage.id} className="p-4 border relative">
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditAvantage(avantage)}>
                      <Edit2 className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAvantage(avantage.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <h4 className="font-medium">{avantage.nom}</h4>
                  <div className="mt-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Valeur mensuelle:</span>
                      <span className="font-medium">{avantage.valeur.toLocaleString('fr-FR')} DH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{avantage.type}</span>
                    </div>
                    {avantage.description && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">{avantage.description}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border">
              <p className="text-gray-500">Aucun avantage configuré</p>
              <Button variant="outline" className="mt-2" onClick={handleAddAvantage}>
                Ajouter un avantage
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Dialog pour ajouter/modifier une prime */}
      <Dialog open={isPrimeDialogOpen} onOpenChange={setIsPrimeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingPrime?.id ? "Modifier la prime" : "Ajouter une prime"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePrimeSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nom">Nom de la prime</Label>
              <Input 
                id="nom" 
                name="nom" 
                value={editingPrime?.nom || ""} 
                onChange={handlePrimeInputChange} 
                placeholder="Ex: Prime d'ancienneté"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type de prime</Label>
                <Select 
                  value={editingPrime?.type || "fixe"} 
                  onValueChange={(value) => handlePrimeSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixe">Montant fixe</SelectItem>
                    <SelectItem value="pourcentage">Pourcentage</SelectItem>
                    <SelectItem value="ponctuelle">Ponctuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="montant">
                  {editingPrime?.type === 'pourcentage' ? 'Pourcentage (%)' : 'Montant (DH)'}
                </Label>
                <Input 
                  id="montant" 
                  name="montant" 
                  type="number"
                  value={editingPrime?.montant || 0} 
                  onChange={handlePrimeInputChange} 
                  required
                  min={0}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="frequence">Fréquence</Label>
              <Select 
                value={editingPrime?.frequence || "mensuelle"} 
                onValueChange={(value) => handlePrimeSelectChange("frequence", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la fréquence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensuelle">Mensuelle</SelectItem>
                  <SelectItem value="trimestrielle">Trimestrielle</SelectItem>
                  <SelectItem value="annuelle">Annuelle</SelectItem>
                  <SelectItem value="unique">Unique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={editingPrime?.description || ""} 
                onChange={handlePrimeInputChange} 
                placeholder="Description ou conditions d'attribution"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsPrimeDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {editingPrime?.id ? "Mettre à jour" : "Ajouter"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour ajouter/modifier un avantage */}
      <Dialog open={isAvantageDialogOpen} onOpenChange={setIsAvantageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingAvantage?.id ? "Modifier l'avantage" : "Ajouter un avantage"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAvantageSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nom">Nom de l'avantage</Label>
              <Input 
                id="nom" 
                name="nom" 
                value={editingAvantage?.nom || ""} 
                onChange={handleAvantageInputChange} 
                placeholder="Ex: Voiture de fonction"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type d'avantage</Label>
                <Select 
                  value={editingAvantage?.type || "autre"} 
                  onValueChange={(value) => handleAvantageSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voiture">Voiture</SelectItem>
                    <SelectItem value="telephone">Téléphone</SelectItem>
                    <SelectItem value="ordinateur">Ordinateur</SelectItem>
                    <SelectItem value="repas">Repas</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="valeur">Valeur mensuelle (DH)</Label>
                <Input 
                  id="valeur" 
                  name="valeur" 
                  type="number"
                  value={editingAvantage?.valeur || 0} 
                  onChange={handleAvantageInputChange} 
                  required
                  min={0}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={editingAvantage?.description || ""} 
                onChange={handleAvantageInputChange} 
                placeholder="Description de l'avantage"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAvantageDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {editingAvantage?.id ? "Mettre à jour" : "Ajouter"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailPrimesAvantages;
