
import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Search, 
  Filter, 
  FileCheck, 
  FileX, 
  Plus, 
  Download, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock,
  MoreHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Absence, TypeAbsence } from "@/types/absences";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminAbsencesListProps {
  absences: Absence[];
  onValider: (absence: Absence) => void;
  onRefuser: (absence: Absence, motif: string) => void;
  onRegulariser: (absence: Absence, type: string, commentaire: string) => void;
  onAjouterAbsence: () => void;
}

const AdminAbsencesList: React.FC<AdminAbsencesListProps> = ({
  absences,
  onValider,
  onRefuser,
  onRegulariser,
  onAjouterAbsence
}) => {
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState<string>("tous");
  const [filtreStatut, setFiltreStatut] = useState<string>("tous");
  const [filtreDepartement, setFiltreDepartement] = useState<string>("tous");
  const [absenceSelectionnee, setAbsenceSelectionnee] = useState<Absence | null>(null);
  const [dialogAction, setDialogAction] = useState<"refuser" | "regulariser" | "detail" | null>(null);
  const [motifRefus, setMotifRefus] = useState("");
  const [commentaireRegularisation, setCommentaireRegularisation] = useState("");
  const [typeRegularisation, setTypeRegularisation] = useState("conge_paye");
  const [activeTab, setActiveTab] = useState("en_attente");
  
  // État pour les filtres avancés
  const [filtresAvancesOuverts, setFiltresAvancesOuverts] = useState(false);
  const [dateDebut, setDateDebut] = useState<Date | undefined>(undefined);
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined);
  const [declarePar, setDeclarePar] = useState<string>("tous");
  
  const filtrerAbsences = () => {
    return absences.filter(absence => {
      // Filtre par recherche (nom employé ou motif)
      const matchRecherche = 
        absence.employeNom.toLowerCase().includes(recherche.toLowerCase()) ||
        absence.motif.toLowerCase().includes(recherche.toLowerCase());
      
      // Filtre par type
      const matchType = filtreType === "tous" || absence.typeAbsence === filtreType;
      
      // Filtre par statut (ou par tab active)
      const matchStatut = (activeTab === "tous" && (filtreStatut === "tous" || absence.statut === filtreStatut)) 
                        || absence.statut === activeTab;
      
      // Filtre par département (à implémenter avec les données employé réelles)
      const matchDepartement = filtreDepartement === "tous" || true; // Simulé
      
      // Filtres avancés
      const matchDateDebut = !dateDebut || new Date(absence.dateDebut) >= dateDebut;
      const matchDateFin = !dateFin || new Date(absence.dateFin) <= dateFin;
      const matchDeclarePar = declarePar === "tous" || absence.declarePar === declarePar;
      
      return matchRecherche && matchType && matchStatut && matchDepartement 
             && matchDateDebut && matchDateFin && matchDeclarePar;
    });
  };
  
  const absencesFiltrees = filtrerAbsences();
  
  const nombreEnAttente = absences.filter(a => a.statut === "en_attente").length;
  const nombreValidees = absences.filter(a => a.statut === "validee").length;
  const nombreRefusees = absences.filter(a => a.statut === "refusee").length;
  const nombreRegularisees = absences.filter(a => a.statut === "regularisee").length;
  
  const ouvrirDialogRefus = (absence: Absence) => {
    setAbsenceSelectionnee(absence);
    setDialogAction("refuser");
    setMotifRefus("");
  };
  
  const ouvrirDialogRegularisation = (absence: Absence) => {
    setAbsenceSelectionnee(absence);
    setDialogAction("regulariser");
    setCommentaireRegularisation("");
    setTypeRegularisation("conge_paye");
  };
  
  const ouvrirDialogDetail = (absence: Absence) => {
    setAbsenceSelectionnee(absence);
    setDialogAction("detail");
  };
  
  const fermerDialog = () => {
    setDialogAction(null);
    setAbsenceSelectionnee(null);
  };
  
  const handleValider = () => {
    if (absenceSelectionnee) {
      onValider(absenceSelectionnee);
      toast.success("Absence validée avec succès");
      fermerDialog();
    }
  };
  
  const handleRefuser = () => {
    if (absenceSelectionnee && motifRefus.trim()) {
      onRefuser(absenceSelectionnee, motifRefus);
      toast.success("Absence refusée");
      fermerDialog();
    } else {
      toast.error("Veuillez indiquer un motif de refus");
    }
  };
  
  const handleRegulariser = () => {
    if (absenceSelectionnee) {
      onRegulariser(absenceSelectionnee, typeRegularisation, commentaireRegularisation);
      toast.success("Absence régularisée avec succès");
      fermerDialog();
    }
  };
  
  const exporterAbsences = () => {
    toast.info("Exportation des absences en cours...");
    // Implémentation réelle: générer un fichier Excel/CSV
  };
  
  const getTypeAbsenceLabel = (type: TypeAbsence) => {
    switch(type) {
      case "maladie": return "Maladie";
      case "absence_injustifiee": return "Injustifiée";
      case "retard": return "Retard";
      case "absence_exceptionnelle": return "Exceptionnelle";
      case "absence_sans_solde": return "Sans solde";
      case "autre": return "Autre";
      default: return type;
    }
  };
  
  const getTypeAbsenceIcon = (type: TypeAbsence) => {
    switch(type) {
      case "maladie": return <AlertCircle className="h-4 w-4 text-emerald-600" />;
      case "absence_injustifiee": return <FileX className="h-4 w-4 text-red-600" />;
      case "retard": return <Clock className="h-4 w-4 text-orange-600" />;
      case "absence_exceptionnelle": return <FileCheck className="h-4 w-4 text-blue-600" />;
      case "absence_sans_solde": return <AlertCircle className="h-4 w-4 text-purple-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };
  
  const getBadgeStatut = (statut: string) => {
    switch(statut) {
      case "en_attente":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>;
      case "validee":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Validée</Badge>;
      case "refusee":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Refusée</Badge>;
      case "regularisee":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Régularisée</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };
  
  const getBadgeImpact = (absence: Absence) => {
    if (absence.impact.remunere) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Rémunéré</Badge>;
    } else {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Retenue</Badge>;
    }
  };
  
  const isDeclarationRecente = (dateDeclaration: string) => {
    const date = new Date(dateDeclaration);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Gestion des Absences</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exporterAbsences}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={onAjouterAbsence} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter manuellement
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5 mb-4">
          <TabsTrigger value="en_attente" className="flex items-center gap-2">
            En attente
            {nombreEnAttente > 0 && (
              <Badge className="bg-yellow-500 text-white border-0">{nombreEnAttente}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="validee">Validées</TabsTrigger>
          <TabsTrigger value="refusee">Refusées</TabsTrigger>
          <TabsTrigger value="regularisee">Régularisées</TabsTrigger>
          <TabsTrigger value="tous" className="hidden lg:block">Toutes</TabsTrigger>
        </TabsList>
        
        <Card className="shadow-md">
          <CardHeader className="bg-slate-50 border-b py-4">
            <div className="flex flex-col md:flex-row justify-between gap-3">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher par employé ou motif..."
                  className="pl-9"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Select value={filtreType} onValueChange={setFiltreType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type d'absence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les types</SelectItem>
                    <SelectItem value="maladie">Maladie</SelectItem>
                    <SelectItem value="absence_injustifiee">Injustifiée</SelectItem>
                    <SelectItem value="retard">Retard</SelectItem>
                    <SelectItem value="absence_exceptionnelle">Exceptionnelle</SelectItem>
                    <SelectItem value="absence_sans_solde">Sans solde</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filtreDepartement} onValueChange={setFiltreDepartement}>
                  <SelectTrigger>
                    <SelectValue placeholder="Département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les départements</SelectItem>
                    <SelectItem value="informatique">Informatique</SelectItem>
                    <SelectItem value="rh">Ressources Humaines</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="ventes">Ventes</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn(
                    "md:ml-2",
                    filtresAvancesOuverts && "bg-blue-50 border-blue-200 text-blue-700"
                  )}
                  onClick={() => setFiltresAvancesOuverts(!filtresAvancesOuverts)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {filtresAvancesOuverts && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-200">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateDebut && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateDebut ? format(dateDebut, "dd/MM/yyyy") : "Sélectionner"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateDebut}
                        onSelect={setDateDebut}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateFin && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFin ? format(dateFin, "dd/MM/yyyy") : "Sélectionner"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFin}
                        onSelect={setDateFin}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Déclaré par</Label>
                  <Select value={declarePar} onValueChange={setDeclarePar}>
                    <SelectTrigger>
                      <SelectValue placeholder="Déclaré par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous</SelectItem>
                      <SelectItem value="employe">Employé</SelectItem>
                      <SelectItem value="rh">RH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-3 flex justify-end space-x-2 mt-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setDateDebut(undefined);
                      setDateFin(undefined);
                      setDeclarePar("tous");
                    }}
                  >
                    Réinitialiser
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => setFiltresAvancesOuverts(false)}
                  >
                    Appliquer
                  </Button>
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="p-0">
            <TabsContent value={activeTab} className="m-0">
              {absencesFiltrees.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employé</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Période</TableHead>
                        <TableHead>Motif</TableHead>
                        <TableHead>Justificatif</TableHead>
                        <TableHead>Impact paie</TableHead>
                        {activeTab === "tous" && <TableHead>Statut</TableHead>}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {absencesFiltrees.map((absence) => (
                        <TableRow 
                          key={absence.id} 
                          className={cn(
                            "hover:bg-slate-50",
                            isDeclarationRecente(absence.dateDeclaration) && "bg-blue-50"
                          )}
                        >
                          <TableCell className="font-medium">
                            {absence.employeNom}
                            {isDeclarationRecente(absence.dateDeclaration) && (
                              <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-200">Nouveau</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {getTypeAbsenceIcon(absence.typeAbsence)}
                              <span>{getTypeAbsenceLabel(absence.typeAbsence)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="whitespace-nowrap">
                              {format(new Date(absence.dateDebut), "dd/MM/yyyy")}
                              {absence.dateDebut !== absence.dateFin && (
                                ` - ${format(new Date(absence.dateFin), "dd/MM/yyyy")}`
                              )}
                              <div className="text-xs text-gray-500">
                                {absence.nombreJours} jour(s)
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate" title={absence.motif}>
                              {absence.motif}
                            </div>
                          </TableCell>
                          <TableCell>
                            {absence.justificatifRequis ? (
                              absence.justificatifUrl ? (
                                <Button variant="ghost" size="sm" className="h-7 text-blue-600">
                                  <FileCheck className="h-4 w-4 mr-1" />
                                  Voir
                                </Button>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  Manquant
                                </Badge>
                              )
                            ) : (
                              <span className="text-gray-500 text-sm">Non requis</span>
                            )}
                          </TableCell>
                          <TableCell>{getBadgeImpact(absence)}</TableCell>
                          {activeTab === "tous" && (
                            <TableCell>{getBadgeStatut(absence.statut)}</TableCell>
                          )}
                          <TableCell className="text-right">
                            {absence.statut === "en_attente" ? (
                              <div className="flex items-center justify-end gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 text-green-600"
                                  onClick={() => {
                                    setAbsenceSelectionnee(absence);
                                    handleValider();
                                  }}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 text-red-600"
                                  onClick={() => ouvrirDialogRefus(absence)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => ouvrirDialogDetail(absence)}>
                                      Voir détails
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => ouvrirDialogRegularisation(absence)}>
                                      Régulariser
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => ouvrirDialogDetail(absence)}
                              >
                                Détails
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-center">Aucune absence trouvée</p>
                  <p className="text-gray-400 text-sm text-center">Ajustez vos filtres ou ajoutez une absence</p>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      
      {/* Dialog de refus */}
      {dialogAction === "refuser" && absenceSelectionnee && (
        <Dialog open={true} onOpenChange={fermerDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Refuser l'absence</DialogTitle>
              <DialogDescription>
                Indiquez le motif du refus pour l'absence de {absenceSelectionnee.employeNom}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="motifRefus">Motif du refus</Label>
                <Textarea
                  id="motifRefus"
                  placeholder="Indiquez la raison du refus..."
                  value={motifRefus}
                  onChange={(e) => setMotifRefus(e.target.value)}
                  className="min-h-[100px]"
                />
                {motifRefus.length < 3 && (
                  <p className="text-sm text-red-500">Le motif doit contenir au moins 3 caractères</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={fermerDialog}>Annuler</Button>
              <Button 
                variant="destructive" 
                onClick={handleRefuser}
                disabled={motifRefus.length < 3}
              >
                Refuser l'absence
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Dialog de régularisation */}
      {dialogAction === "regulariser" && absenceSelectionnee && (
        <Dialog open={true} onOpenChange={fermerDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Régulariser l'absence</DialogTitle>
              <DialogDescription>
                Convertir cette absence en un autre type pour {absenceSelectionnee.employeNom}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="typeRegularisation">Type de régularisation</Label>
                <Select value={typeRegularisation} onValueChange={setTypeRegularisation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conge_paye">Congé payé</SelectItem>
                    <SelectItem value="conge_sans_solde">Congé sans solde</SelectItem>
                    <SelectItem value="rtt">RTT</SelectItem>
                    <SelectItem value="recuperation">Récupération</SelectItem>
                    <SelectItem value="formation">Formation</SelectItem>
                    <SelectItem value="teletravail">Télétravail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commentaireRegularisation">Commentaire</Label>
                <Textarea
                  id="commentaireRegularisation"
                  placeholder="Ajoutez un commentaire sur cette régularisation..."
                  value={commentaireRegularisation}
                  onChange={(e) => setCommentaireRegularisation(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={fermerDialog}>Annuler</Button>
              <Button 
                variant="default" 
                onClick={handleRegulariser}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Régulariser
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Dialog de détail */}
      {dialogAction === "detail" && absenceSelectionnee && (
        <Dialog open={true} onOpenChange={fermerDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Détail de l'absence</DialogTitle>
              <DialogDescription>
                {absenceSelectionnee.employeNom} - {format(new Date(absenceSelectionnee.dateDebut), "dd MMMM yyyy", { locale: fr })}
                {absenceSelectionnee.dateDebut !== absenceSelectionnee.dateFin && (
                  ` au ${format(new Date(absenceSelectionnee.dateFin), "dd MMMM yyyy", { locale: fr })}`
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Type d'absence</h4>
                  <p className="flex items-center gap-1.5 font-medium">
                    {getTypeAbsenceIcon(absenceSelectionnee.typeAbsence)}
                    <span>{getTypeAbsenceLabel(absenceSelectionnee.typeAbsence)}</span>
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Statut</h4>
                  <p>{getBadgeStatut(absenceSelectionnee.statut)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Détails de la période</h4>
                  <p className="font-medium">
                    {format(new Date(absenceSelectionnee.dateDebut), "dd/MM/yyyy")}
                    {absenceSelectionnee.dateDebut !== absenceSelectionnee.dateFin && (
                      ` au ${format(new Date(absenceSelectionnee.dateFin), "dd/MM/yyyy")}`
                    )}
                    {absenceSelectionnee.heureDebut && absenceSelectionnee.heureFin && (
                      ` (${absenceSelectionnee.heureDebut} - ${absenceSelectionnee.heureFin})`
                    )}
                  </p>
                  <p className="text-sm text-gray-600">{absenceSelectionnee.nombreJours} jour(s)</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Déclaration</h4>
                  <p className="font-medium">
                    {format(new Date(absenceSelectionnee.dateDeclaration), "dd/MM/yyyy HH:mm", { locale: fr })}
                  </p>
                  <p className="text-sm text-gray-600">
                    Par: {absenceSelectionnee.declarePar === "employe" ? "L'employé" : "RH"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Impact sur la paie</h4>
                  <p className="font-medium">
                    {absenceSelectionnee.impact.remunere ? "Rémunéré" : "Non rémunéré"}
                    {absenceSelectionnee.impact.retenueSalaire && ` (Retenue: ${absenceSelectionnee.impact.retenueSalaire} DH)`}
                  </p>
                  <div className="flex gap-1 mt-1">
                    {absenceSelectionnee.impact.cnss && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">CNSS</Badge>
                    )}
                    {absenceSelectionnee.impact.amo && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">AMO</Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Validation</h4>
                  {absenceSelectionnee.validationManagerId ? (
                    <p className="text-sm">
                      Par manager: {format(new Date(absenceSelectionnee.validationManagerDate || ""), "dd/MM/yyyy HH:mm", { locale: fr })}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">En attente de validation manager</p>
                  )}
                  
                  {absenceSelectionnee.validationRHId ? (
                    <p className="text-sm">
                      Par RH: {format(new Date(absenceSelectionnee.validationRHDate || ""), "dd/MM/yyyy HH:mm", { locale: fr })}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">En attente de validation RH</p>
                  )}
                </div>
                
                {absenceSelectionnee.justificatifRequis && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Justificatif</h4>
                    {absenceSelectionnee.justificatifUrl ? (
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-blue-600">
                          <FileCheck className="h-4 w-4 mr-1" />
                          Voir le document
                        </Button>
                        <Button variant="outline" size="sm" className="h-8">
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                      </div>
                    ) : (
                      <Badge variant="destructive">Justificatif manquant</Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2 space-y-1">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Motif</h4>
                <p className="bg-gray-50 p-3 rounded-md text-gray-700">{absenceSelectionnee.motif}</p>
              </div>
              
              {absenceSelectionnee.commentaireRH && (
                <div className="md:col-span-2 space-y-1">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Commentaire RH</h4>
                  <p className="bg-blue-50 p-3 rounded-md text-blue-700">{absenceSelectionnee.commentaireRH}</p>
                </div>
              )}
              
              {absenceSelectionnee.motifRefus && (
                <div className="md:col-span-2 space-y-1">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Motif du refus</h4>
                  <p className="bg-red-50 p-3 rounded-md text-red-700">{absenceSelectionnee.motifRefus}</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="space-x-2">
              <Button 
                variant="outline" 
                onClick={fermerDialog}
              >
                Fermer
              </Button>
              
              {absenceSelectionnee.statut === "en_attente" && (
                <>
                  <Button 
                    variant="default" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleValider}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Valider
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      fermerDialog();
                      ouvrirDialogRefus(absenceSelectionnee);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Refuser
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminAbsencesList;
