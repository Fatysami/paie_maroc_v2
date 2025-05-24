
import React, { useState } from "react";
import { Plus, Edit, Trash2, Check, X, Info } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import TypeCongeForm from "./TypeCongeForm";
import { TypeConge } from "@/types/conges";

// Types de congés prédéfinis selon la législation marocaine
const typesCongesPredefinies: TypeConge[] = [
  {
    id: "1",
    nom: "Congés annuels",
    dureeStandard: "18 jours/an",
    modifiable: true,
    impactSalaire: "Aucun (payés)",
    couleur: "#22c55e", // vert
    description: "Congés payés annuels légaux selon le Code du Travail marocain",
    actif: true,
    legal: true
  },
  {
    id: "2",
    nom: "Congé Maladie",
    dureeStandard: "Selon certificat",
    modifiable: true,
    impactSalaire: "Selon justificatif",
    couleur: "#3b82f6", // bleu
    description: "Congé pour raison médicale avec présentation d'un certificat médical",
    actif: true,
    legal: true
  },
  {
    id: "3",
    nom: "Congé Maternité",
    dureeStandard: "14 semaines",
    modifiable: false,
    impactSalaire: "Aucun (CNSS AMO)",
    couleur: "#ec4899", // rose
    description: "Congé de maternité légal pour les employées (7 semaines avant + 7 semaines après l'accouchement)",
    actif: true,
    legal: true
  },
  {
    id: "4",
    nom: "Congé Paternité",
    dureeStandard: "15 jours",
    modifiable: false,
    impactSalaire: "Aucun (payés)",
    couleur: "#8b5cf6", // violet
    description: "Congé accordé aux pères à la naissance de leur enfant",
    actif: true,
    legal: true
  },
  {
    id: "5",
    nom: "Congé Mariage",
    dureeStandard: "4 jours",
    modifiable: true,
    impactSalaire: "Aucun (payés)",
    couleur: "#f97316", // orange
    description: "Congé accordé lors du mariage de l'employé",
    actif: true,
    legal: true
  },
  {
    id: "6",
    nom: "Congé décès proche",
    dureeStandard: "3 jours",
    modifiable: true,
    impactSalaire: "Aucun (payés)",
    couleur: "#64748b", // gris
    description: "Congé suite au décès d'un proche (conjoint, enfant, parent, frère, sœur)",
    actif: true,
    legal: true
  }
];

const TypesCongesListe = () => {
  const [typesConges, setTypesConges] = useState<TypeConge[]>(typesCongesPredefinies);
  const [currentTypeConge, setCurrentTypeConge] = useState<TypeConge | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleAdd = () => {
    setCurrentTypeConge(null);
    setDialogOpen(true);
  };

  const handleEdit = (typeConge: TypeConge) => {
    setCurrentTypeConge(typeConge);
    setDialogOpen(true);
  };

  const handleDelete = (typeConge: TypeConge) => {
    setCurrentTypeConge(typeConge);
    setDeleteDialogOpen(true);
  };

  const handleSaveTypeConge = (typeConge: TypeConge) => {
    if (currentTypeConge) {
      // Mise à jour d'un type existant
      setTypesConges(typesConges.map(t => t.id === typeConge.id ? typeConge : t));
      toast.success("Type de congé mis à jour avec succès");
    } else {
      // Ajout d'un nouveau type
      const newTypeConge = {
        ...typeConge,
        id: Date.now().toString(),
        legal: false,
        actif: true
      };
      setTypesConges([...typesConges, newTypeConge]);
      toast.success("Nouveau type de congé ajouté avec succès");
    }
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    if (currentTypeConge) {
      if (currentTypeConge.legal) {
        toast.error("Impossible de supprimer un type de congé légal");
        setDeleteDialogOpen(false);
        return;
      }
      
      setTypesConges(typesConges.filter(t => t.id !== currentTypeConge.id));
      toast.success("Type de congé supprimé avec succès");
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Types de congés et absences</CardTitle>
          <CardDescription>
            Gérez les différents types de congés et absences disponibles pour vos employés
          </CardDescription>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un type
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Durée standard</TableHead>
              <TableHead>Modifiable</TableHead>
              <TableHead>Impact sur salaire</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {typesConges.map((typeConge) => (
              <TableRow key={typeConge.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: typeConge.couleur }}
                    />
                    {typeConge.nom}
                    {typeConge.legal && (
                      <Badge variant="outline" className="ml-2">Légal</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{typeConge.dureeStandard}</TableCell>
                <TableCell>
                  {typeConge.modifiable ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>{typeConge.impactSalaire}</TableCell>
                <TableCell>
                  <Badge variant={typeConge.actif ? "default" : "outline"}>
                    {typeConge.actif ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(typeConge)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(typeConge)}
                      disabled={typeConge.legal}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t p-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Info className="h-4 w-4 mr-2" />
          Les types de congés légaux sont prédéfinis selon la législation marocaine et ne peuvent pas être supprimés.
        </div>
      </CardFooter>

      {/* Dialog pour ajouter/modifier un type de congé */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentTypeConge ? "Modifier le type de congé" : "Ajouter un type de congé"}
            </DialogTitle>
            <DialogDescription>
              {currentTypeConge ? 
                "Modifiez les informations du type de congé sélectionné" : 
                "Ajoutez un nouveau type de congé personnalisé"}
            </DialogDescription>
          </DialogHeader>
          
          <TypeCongeForm 
            typeConge={currentTypeConge} 
            onSave={handleSaveTypeConge} 
            onCancel={() => setDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce type de congé ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TypesCongesListe;
