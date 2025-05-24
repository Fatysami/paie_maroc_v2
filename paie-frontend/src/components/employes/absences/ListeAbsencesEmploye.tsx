
import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarX, File, FileCheck, AlertCircle, Search, FileX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Absence, TypeAbsence } from "@/types/absences";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ListeAbsencesEmployeProps {
  employeId: string;
  absences: Absence[];
  readOnly?: boolean;
  onAnnuler?: (absenceId: string) => void;
}

const ListeAbsencesEmploye: React.FC<ListeAbsencesEmployeProps> = ({ 
  employeId, 
  absences,
  readOnly = false,
  onAnnuler 
}) => {
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState<string>("tous");
  const [filtreStatut, setFiltreStatut] = useState<string>("tous");
  const [absenceDetail, setAbsenceDetail] = useState<Absence | null>(null);
  const [dialogOuverte, setDialogOuverte] = useState(false);

  const filtrerAbsences = () => {
    return absences.filter(absence => {
      // Filtre par recherche
      const matchRecherche = 
        absence.motif.toLowerCase().includes(recherche.toLowerCase()) ||
        format(new Date(absence.dateDebut), "dd/MM/yyyy").includes(recherche);
      
      // Filtre par type
      const matchType = filtreType === "tous" || absence.typeAbsence === filtreType;
      
      // Filtre par statut
      const matchStatut = filtreStatut === "tous" || absence.statut === filtreStatut;
      
      return matchRecherche && matchType && matchStatut;
    });
  };

  const absencesFiltrees = filtrerAbsences();
  
  const afficherDetail = (absence: Absence) => {
    setAbsenceDetail(absence);
    setDialogOuverte(true);
  };
  
  const getStatutBadge = (statut: string) => {
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
  
  const getTypeAbsenceLabel = (type: TypeAbsence) => {
    switch(type) {
      case "maladie":
        return "Maladie";
      case "absence_injustifiee":
        return "Injustifiée";
      case "retard":
        return "Retard";
      case "absence_exceptionnelle":
        return "Exceptionnelle";
      case "absence_sans_solde":
        return "Sans solde";
      case "autre":
        return "Autre";
      default:
        return type;
    }
  };
  
  const getTypeAbsenceIcon = (type: TypeAbsence) => {
    switch(type) {
      case "maladie":
        return <FileCheck className="h-4 w-4 text-emerald-600" />;
      case "absence_injustifiee":
        return <FileX className="h-4 w-4 text-red-600" />;
      case "retard":
        return <CalendarX className="h-4 w-4 text-orange-600" />;
      case "absence_exceptionnelle":
        return <File className="h-4 w-4 text-blue-600" />;
      case "absence_sans_solde":
        return <AlertCircle className="h-4 w-4 text-purple-600" />;
      default:
        return <File className="h-4 w-4 text-gray-600" />;
    }
  };
  
  const annulerAbsence = (absenceId: string) => {
    if (onAnnuler) {
      onAnnuler(absenceId);
      setDialogOuverte(false);
      toast.success("Demande d'annulation envoyée");
    }
  };

  return (
    <>
      <Card className="shadow-md">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex justify-between items-center">
            <span>Historique des absences</span>
            <Badge variant="outline" className="bg-gray-100 border-gray-200">
              {absencesFiltrees.length} / {absences.length}
            </Badge>
          </CardTitle>
          
          <div className="flex flex-col md:flex-row gap-3 mt-3">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher..."
                className="pl-9"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 w-full md:w-1/2">
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
              
              <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="validee">Validée</SelectItem>
                  <SelectItem value="refusee">Refusée</SelectItem>
                  <SelectItem value="regularisee">Régularisée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {absencesFiltrees.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Impact paie</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absencesFiltrees.map((absence) => (
                    <TableRow key={absence.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {getTypeAbsenceIcon(absence.typeAbsence)}
                          <span>{getTypeAbsenceLabel(absence.typeAbsence)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="underline decoration-dotted">
                              {format(new Date(absence.dateDebut), "dd/MM/yyyy")}
                              {absence.dateDebut !== absence.dateFin && (
                                ` - ${format(new Date(absence.dateFin), "dd/MM/yyyy")}`
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{absence.nombreJours} jour(s)</p>
                              <p className="text-xs text-gray-500">
                                Déclaré le {format(new Date(absence.dateDeclaration), "dd/MM/yyyy", { locale: fr })}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={absence.motif}>
                          {absence.motif}
                        </div>
                      </TableCell>
                      <TableCell>{getStatutBadge(absence.statut)}</TableCell>
                      <TableCell>
                        {absence.impact.remunere ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Rémunéré
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Retenue
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => afficherDetail(absence)}
                        >
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <CalendarX className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">Aucune absence trouvée</p>
              <p className="text-gray-400 text-sm text-center">Ajustez vos filtres ou déclarez une nouvelle absence</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog de détail d'absence */}
      {absenceDetail && (
        <Dialog open={dialogOuverte} onOpenChange={setDialogOuverte}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Détail de l'absence</DialogTitle>
              <DialogDescription>
                {format(new Date(absenceDetail.dateDebut), "dd MMMM yyyy", { locale: fr })}
                {absenceDetail.dateDebut !== absenceDetail.dateFin && (
                  ` au ${format(new Date(absenceDetail.dateFin), "dd MMMM yyyy", { locale: fr })}`
                )}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Type d'absence</p>
                <p className="flex items-center gap-1.5">
                  {getTypeAbsenceIcon(absenceDetail.typeAbsence)}
                  <span className="font-medium">{getTypeAbsenceLabel(absenceDetail.typeAbsence)}</span>
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Statut</p>
                <p>{getStatutBadge(absenceDetail.statut)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Durée</p>
                <p className="font-medium">{absenceDetail.nombreJours} jour(s)</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Impact sur la paie</p>
                <p className="font-medium">
                  {absenceDetail.impact.remunere ? "Rémunéré" : "Non rémunéré"}
                  {absenceDetail.impact.retenueSalaire && ` (Retenue: ${absenceDetail.impact.retenueSalaire} DH)`}
                </p>
              </div>
              
              <div className="col-span-2 space-y-1">
                <p className="text-sm font-medium text-gray-500">Motif</p>
                <p className="bg-gray-50 p-2 rounded-md text-gray-700">{absenceDetail.motif}</p>
              </div>
              
              {absenceDetail.justificatifUrl && (
                <div className="col-span-2 space-y-1">
                  <p className="text-sm font-medium text-gray-500">Justificatif</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-blue-600">
                      <File className="h-4 w-4 mr-1" />
                      Voir le document
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileCheck className="h-4 w-4 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              )}
              
              {absenceDetail.commentaireRH && (
                <div className="col-span-2 space-y-1">
                  <p className="text-sm font-medium text-gray-500">Commentaire RH</p>
                  <p className="bg-blue-50 p-2 rounded-md text-blue-700">{absenceDetail.commentaireRH}</p>
                </div>
              )}
              
              {absenceDetail.motifRefus && (
                <div className="col-span-2 space-y-1">
                  <p className="text-sm font-medium text-gray-500">Motif du refus</p>
                  <p className="bg-red-50 p-2 rounded-md text-red-700">{absenceDetail.motifRefus}</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setDialogOuverte(false)}
              >
                Fermer
              </Button>
              
              {!readOnly && absenceDetail.statut === "en_attente" && onAnnuler && (
                <Button 
                  variant="destructive" 
                  onClick={() => annulerAbsence(absenceDetail.id)}
                >
                  Annuler cette demande
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ListeAbsencesEmploye;
