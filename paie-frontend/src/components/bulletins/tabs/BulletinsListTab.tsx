
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FileCheck, File, SendHorizonal, Download, Edit, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Bulletin {
  id: string;
  employe: { id: string; nom: string; prenom: string; matricule: string };
  periode: { mois: string; annee: string };
  montantNet: number;
  dateGeneration: string | null;
  dateEnvoi: string | null;
  statut: string;
}

interface BulletinsListTabProps {
  bulletins: Bulletin[];
  periodeSelectionne: string;
  onGenererTous: () => void;
  onEnvoiBulletins: () => void;
}

const BulletinsListTab: React.FC<BulletinsListTabProps> = ({ 
  bulletins, 
  periodeSelectionne, 
  onGenererTous,
  onEnvoiBulletins
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [selectedBulletins, setSelectedBulletins] = useState<string[]>([]);

  // Filtrer les bulletins selon le statut sélectionné
  const bulletinsFiltres = bulletins.filter(bulletin => {
    if (filtreStatut === "tous") return true;
    return bulletin.statut === filtreStatut;
  });

  // Formatter le montant en MAD
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-MA', { 
      style: 'currency', 
      currency: 'MAD',
      maximumFractionDigits: 2
    }).format(montant);
  };

  // Formatter la date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Générer un badge pour le statut
  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">En attente</Badge>;
      case "généré":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Généré</Badge>;
      case "envoyé":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Envoyé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  // Toggle la sélection d'un bulletin
  const toggleSelectBulletin = (bulletinId: string) => {
    setSelectedBulletins(prev => 
      prev.includes(bulletinId) 
        ? prev.filter(id => id !== bulletinId) 
        : [...prev, bulletinId]
    );
  };

  // Sélectionner tous les bulletins affichés
  const selectAllBulletins = () => {
    if (selectedBulletins.length === bulletinsFiltres.length) {
      setSelectedBulletins([]);
    } else {
      setSelectedBulletins(bulletinsFiltres.map(bulletin => bulletin.id));
    }
  };

  // Télécharger un bulletin
  const telechargerBulletin = async (bulletinId: string) => {
    toast({
      title: "Téléchargement en cours",
      description: "Le bulletin de paie est en cours de téléchargement..."
    });

    // Simuler le téléchargement du bulletin
    setTimeout(() => {
      toast({
        title: "Téléchargement terminé",
        description: "Le bulletin de paie a été téléchargé avec succès."
      });
    }, 1500);
  };

  // Rediriger vers la page de préparation de paie
  const allerVersPreparationPaie = () => {
    navigate("/preparation-paie", { state: { periode: periodeSelectionne } });
  };

  // Générer les bulletins sélectionnés
  const genererBulletinsSelectionnes = async () => {
    if (selectedBulletins.length === 0) {
      toast({
        title: "Aucun bulletin sélectionné",
        description: "Veuillez sélectionner au moins un bulletin à générer."
      });
      return;
    }

    toast({
      title: "Génération en cours",
      description: `Génération de ${selectedBulletins.length} bulletin(s) en cours...`
    });

    // Simuler la génération des bulletins
    setTimeout(() => {
      toast({
        title: "Génération terminée",
        description: `${selectedBulletins.length} bulletin(s) de paie ont été générés avec succès.`
      });
      setSelectedBulletins([]);
    }, 2000);
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <Select 
          value={filtreStatut} 
          onValueChange={setFiltreStatut}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les statuts</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="généré">Généré</SelectItem>
            <SelectItem value="envoyé">Envoyé</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onGenererTous}
          >
            <FileCheck className="mr-2 h-4 w-4" />
            Générer tous
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={genererBulletinsSelectionnes}
            disabled={selectedBulletins.length === 0}
          >
            <File className="mr-2 h-4 w-4" />
            Générer sélection
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onEnvoiBulletins}
            disabled={selectedBulletins.length === 0}
          >
            <SendHorizonal className="mr-2 h-4 w-4" />
            Envoyer sélection
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={selectedBulletins.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger ZIP
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedBulletins.length === bulletinsFiltres.length && bulletinsFiltres.length > 0}
                  onCheckedChange={selectAllBulletins}
                />
              </TableHead>
              <TableHead>Employé</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Montant net</TableHead>
              <TableHead>Date génération</TableHead>
              <TableHead>Date envoi</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bulletinsFiltres.map((bulletin) => (
              <TableRow key={bulletin.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell>
                  <Checkbox 
                    checked={selectedBulletins.includes(bulletin.id)}
                    onCheckedChange={() => toggleSelectBulletin(bulletin.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {bulletin.employe.prenom} {bulletin.employe.nom}
                  <div className="text-xs text-gray-500">
                    {bulletin.employe.matricule}
                  </div>
                </TableCell>
                <TableCell>
                  {bulletin.periode.mois} {bulletin.periode.annee}
                </TableCell>
                <TableCell>
                  {formatMontant(bulletin.montantNet)}
                </TableCell>
                <TableCell>
                  {formatDate(bulletin.dateGeneration)}
                </TableCell>
                <TableCell>
                  {formatDate(bulletin.dateEnvoi)}
                </TableCell>
                <TableCell>
                  {getStatutBadge(bulletin.statut)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {bulletin.statut !== "en_attente" && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => telechargerBulletin(bulletin.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {bulletin.statut === "en_attente" && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={allerVersPreparationPaie}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {bulletinsFiltres.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  Aucun bulletin trouvé pour la période et le filtre sélectionnés
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default BulletinsListTab;
