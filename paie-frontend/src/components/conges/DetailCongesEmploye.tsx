
import React, { useState } from "react";
import { 
  CalendarDays, 
  Plus, 
  FileText, 
  AlertCircle, 
  Clock,
  CheckCircle2,
  XCircle,
  CalendarIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format, differenceInDays, addDays, isWithinInterval, addMonths, subMonths, isSameMonth, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { DemandeConge } from "@/types/conges";
import { Employe } from "@/pages/GestionEmployes";
import NouvelleDemandeForm from "./NouvelleDemandeForm";

interface DetailCongesEmployeProps {
  employe: Employe;
}

// Données simulées de congés pour l'employé avec des exemples visuels
const mockCongesEmploye: DemandeConge[] = [
  // Congés passés
  {
    id: "1",
    employeId: "1",
    employeNom: "Mohammed Alami",
    typeCongeId: "1",
    typeCongeNom: "Congés annuels",
    dateDebut: "2023-12-20",
    dateFin: "2023-12-31",
    nombreJours: 8,
    statut: "validee",
    dateCreation: "2023-09-15T10:30:00",
    commentaire: "Vacances de fin d'année"
  },
  {
    id: "2",
    employeId: "1",
    employeNom: "Mohammed Alami",
    typeCongeId: "2",
    typeCongeNom: "Congé Maladie",
    dateDebut: "2024-02-05",
    dateFin: "2024-02-08",
    nombreJours: 4,
    statut: "validee",
    dateCreation: "2024-02-05T08:15:00",
    justificatifUrl: "/documents/certificat-123.pdf"
  },
  // Congé pour le mois actuel
  {
    id: "3",
    employeId: "1",
    employeNom: "Mohammed Alami",
    typeCongeId: "1",
    typeCongeNom: "Congés annuels",
    dateDebut: new Date().toISOString().split('T')[0], // Aujourd'hui
    dateFin: addDays(new Date(), 3).toISOString().split('T')[0], // Aujourd'hui + 3 jours
    nombreJours: 4,
    statut: "en_attente",
    dateCreation: subMonths(new Date(), 1).toISOString(),
    commentaire: "Congé personnel"
  },
  // Congé refusé ce mois-ci
  {
    id: "4",
    employeId: "1",
    employeNom: "Mohammed Alami",
    typeCongeId: "4",
    typeCongeNom: "Congé sans solde",
    dateDebut: addDays(new Date(), 10).toISOString().split('T')[0],
    dateFin: addDays(new Date(), 12).toISOString().split('T')[0],
    nombreJours: 3,
    statut: "refusee",
    dateCreation: subMonths(new Date(), 1).toISOString(),
    commentaire: "Motif familial"
  },
  // Congé futur accepté
  {
    id: "5",
    employeId: "1", 
    employeNom: "Mohammed Alami",
    typeCongeId: "1",
    typeCongeNom: "Congés annuels",
    dateDebut: addMonths(new Date(), 1).toISOString().split('T')[0],
    dateFin: addDays(addMonths(new Date(), 1), 7).toISOString().split('T')[0],
    nombreJours: 8,
    statut: "validee",
    dateCreation: subMonths(new Date(), 2).toISOString(),
    commentaire: "Vacances d'été"
  },
  // Congé futur en attente
  {
    id: "6",
    employeId: "1", 
    employeNom: "Mohammed Alami",
    typeCongeId: "3",
    typeCongeNom: "Congé exceptionnel",
    dateDebut: addDays(addMonths(new Date(), 2), 5).toISOString().split('T')[0],
    dateFin: addDays(addMonths(new Date(), 2), 7).toISOString().split('T')[0],
    nombreJours: 3,
    statut: "en_attente",
    dateCreation: new Date().toISOString(),
    commentaire: "Mariage"
  }
];

// Mapper les statuts de congés à des couleurs
const congeStatusColors: Record<string, string> = {
  "validee": "bg-green-50 border-l-4 border-green-500",
  "en_attente": "bg-yellow-50 border-l-4 border-yellow-500",
  "refusee": "bg-red-50 border-l-4 border-red-500",
  "annulee": "bg-gray-50 border-l-4 border-gray-400"
};

// Mapper les types de congés à des couleurs
const congeTypeColors: Record<string, string> = {
  "Congés annuels": "blue",
  "Congé Maladie": "red",
  "Congé Maternité": "purple",
  "Congé sans solde": "gray",
  "Congé exceptionnel": "orange"
};

const DetailCongesEmploye: React.FC<DetailCongesEmployeProps> = ({ employe }) => {
  const [activeTab, setActiveTab] = useState("calendrier"); // Changé par défaut à calendrier pour la démo
  const [isDemandeDialogOpen, setIsDemandeDialogOpen] = useState(false);
  const [conges, setConges] = useState<DemandeConge[]>(mockCongesEmploye);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  // Statistiques des congés
  const congesPris = conges
    .filter(c => c.statut === "validee")
    .reduce((total, conge) => total + conge.nombreJours, 0);
    
  const congesEnAttente = conges
    .filter(c => c.statut === "en_attente")
    .reduce((total, conge) => total + conge.nombreJours, 0);
  
  const soldeCongesTotalAnnuel = 26; // Simulé: à remplacer par la vraie valeur
  const soldeCongesRestant = soldeCongesTotalAnnuel - congesPris;
  
  // Formater la date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
  };
  
  // Afficher le statut avec un badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_attente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'validee':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Validée</Badge>;
      case 'refusee':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Refusée</Badge>;
      case 'annulee':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Annulée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  // Ajouter une nouvelle demande
  const handleAddDemande = () => {
    setIsDemandeDialogOpen(true);
  };

  // Préparer les données pour le calendrier
  const getCongesForCalendar = () => {
    // Créer un tableau de jours pour chaque période de congé
    const daysWithEvents: { date: Date; conge: DemandeConge }[] = [];

    conges.forEach(conge => {
      const startDate = new Date(conge.dateDebut);
      const endDate = new Date(conge.dateFin);
      const daysDiff = differenceInDays(endDate, startDate) + 1;

      for (let i = 0; i < daysDiff; i++) {
        const currentDate = addDays(startDate, i);
        daysWithEvents.push({
          date: currentDate,
          conge: conge
        });
      }
    });

    return daysWithEvents;
  };

  // Récupérer tous les jours de congé pour l'affichage du calendrier
  const daysWithConges = getCongesForCalendar();

  // Fonction pour déterminer si une date a des congés associés
  const hasConge = (date: Date) => {
    return daysWithConges.some(day => 
      day.date.getDate() === date.getDate() && 
      day.date.getMonth() === date.getMonth() && 
      day.date.getFullYear() === date.getFullYear()
    );
  };

  // Fonction pour obtenir les détails des congés pour une date spécifique
  const getCongesForDate = (date: Date) => {
    return daysWithConges.filter(day => 
      day.date.getDate() === date.getDate() && 
      day.date.getMonth() === date.getMonth() && 
      day.date.getFullYear() === date.getFullYear()
    );
  };

  // Fonction pour le rendu des jours du calendrier
  const renderCalendarDay = (day: Date, selectedDates: Date[] | undefined, props: any) => {
    const congesForDay = getCongesForDate(day);
    const hasEvents = congesForDay.length > 0;

    // Déterminer la couleur en fonction du statut du premier congé du jour
    let className = "";
    if (hasEvents) {
      const firstConge = congesForDay[0].conge;
      className = congeStatusColors[firstConge.statut];
    }

    return (
      <div 
        className={cn(
          props.className,
          hasEvents ? `${className} rounded` : ""
        )}
      >
        {props.children}
        {hasEvents && congesForDay.length > 1 && (
          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
        )}
      </div>
    );
  };

  // Générer un résumé mensuel des congés
  const getMonthlyCongesStats = () => {
    const currentYear = selectedMonth.getFullYear();
    const currentMonth = selectedMonth.getMonth();
    
    // Filtrer les congés qui se produisent dans le mois sélectionné
    const congesInMonth = conges.filter(conge => {
      const startDate = new Date(conge.dateDebut);
      const endDate = new Date(conge.dateFin);
      const isMonthOverlapping = (
        (startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear) ||
        (endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear) ||
        (startDate < new Date(currentYear, currentMonth, 1) && endDate > new Date(currentYear, currentMonth + 1, 0))
      );
      return isMonthOverlapping;
    });

    return {
      total: congesInMonth.length,
      valides: congesInMonth.filter(c => c.statut === "validee").length,
      enAttente: congesInMonth.filter(c => c.statut === "en_attente").length,
      refusees: congesInMonth.filter(c => c.statut === "refusee").length,
      totalJours: congesInMonth.reduce((sum, conge) => {
        // Calculer l'intersection entre la période de congé et le mois sélectionné
        const startDate = new Date(Math.max(new Date(conge.dateDebut).getTime(), new Date(currentYear, currentMonth, 1).getTime()));
        const endDate = new Date(Math.min(new Date(conge.dateFin).getTime(), new Date(currentYear, currentMonth + 1, 0).getTime()));
        const jours = differenceInDays(endDate, startDate) + 1;
        return sum + Math.max(0, jours);
      }, 0)
    };
  };

  const monthlyStats = getMonthlyCongesStats();

  // Fonction pour naviguer entre les mois
  const handlePreviousMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1));
  };
  
  const handleNextMonth = () => {
    setSelectedMonth(addMonths(selectedMonth, 1));
  };
  
  return (
    <div className="space-y-6">
      {/* Résumé des congés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-white to-blue-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <CalendarDays className="h-4 w-4 mr-2 text-blue-500" />
              Solde de congés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{soldeCongesRestant} jours</div>
            <p className="text-sm text-muted-foreground">
              sur {soldeCongesTotalAnnuel} jours annuels
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-white to-green-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              Congés pris
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{congesPris} jours</div>
            <p className="text-sm text-muted-foreground">
              sur l'année en cours
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-white to-amber-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              Demandes en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{congesEnAttente} jours</div>
            <p className="text-sm text-muted-foreground">
              sur {conges.filter(c => c.statut === "en_attente").length} demande(s)
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Bouton Nouvelle demande */}
      <div className="flex justify-end">
        <Button onClick={handleAddDemande} className="bg-blue-primary hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>
      
      {/* Onglets */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:w-auto">
          <TabsTrigger value="historique">Historique</TabsTrigger>
          <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
          <TabsTrigger value="documents">Justificatifs</TabsTrigger>
        </TabsList>
        
        {/* Onglet Historique */}
        <TabsContent value="historique" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des congés</CardTitle>
              <CardDescription>
                Toutes les demandes de congés et d'absences de l'employé
              </CardDescription>
            </CardHeader>
            <CardContent>
              {conges.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Jours</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date de demande</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conges.map((conge) => (
                      <TableRow key={conge.id}>
                        <TableCell className="font-medium">{conge.typeCongeNom}</TableCell>
                        <TableCell>
                          {formatDate(conge.dateDebut)} - {formatDate(conge.dateFin)}
                        </TableCell>
                        <TableCell>{conge.nombreJours}</TableCell>
                        <TableCell>{getStatusBadge(conge.statut)}</TableCell>
                        <TableCell>{format(new Date(conge.dateCreation), "dd/MM/yyyy")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium text-lg">Aucune demande</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cet employé n'a pas encore de demande de congé
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Calendrier */}
        <TabsContent value="calendrier" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des absences</CardTitle>
              <CardDescription>
                Visualisation des périodes d'absence de l'employé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                <div className="col-span-1 md:col-span-5">
                  <div className="p-4 border rounded-lg bg-white shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handlePreviousMonth}
                          className="h-9 w-9 rounded-full"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <h3 className="font-semibold text-lg px-2">
                          {format(selectedMonth, 'MMMM yyyy', { locale: fr })}
                        </h3>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleNextMonth}
                          className="h-9 w-9 rounded-full"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMonth(new Date())}
                          className="rounded-full px-4"
                        >
                          Aujourd'hui
                        </Button>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="rounded-full">
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              Sélectionner
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 shadow-md rounded-lg">
                            <Calendar
                              mode="single"
                              selected={selectedMonth}
                              onSelect={(date) => date && setSelectedMonth(date)}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                      <Calendar
                        mode="single"
                        selected={new Date()}
                        month={selectedMonth}
                        onMonthChange={setSelectedMonth}
                        className="p-0 pointer-events-auto bg-white"
                        classNames={{
                          day_today: "bg-blue-50 text-blue-700 font-semibold",
                          head_cell: "text-gray-500 font-medium text-sm py-2",
                          caption: "py-3 border-b",
                          caption_label: "text-base font-semibold",
                          table: "w-full",
                          cell: "p-0 relative",
                          day: "h-10 w-10 p-0 font-normal hover:bg-gray-50 rounded-full",
                          row: "flex w-full mt-2",
                          head_row: "flex",
                        }}
                        components={{
                          Day: ({ date, ...props }) => renderCalendarDay(date, undefined, props)
                        }}
                        showOutsideDays={true}
                        weekStartsOn={1} // Commencer par lundi
                        locale={fr}
                        footer={null}
                        captionLayout="buttons"
                        formatters={{ formatWeekdayName: (weekday) => format(weekday, 'EE', { locale: fr }) }}
                      />
                    </div>
                    
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-3 text-gray-700">Légende</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2 bg-green-50 border-l-4 border-green-500 rounded"></div>
                          <span className="text-sm">Congé validé</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2 bg-yellow-50 border-l-4 border-yellow-500 rounded"></div>
                          <span className="text-sm">En attente</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2 bg-red-50 border-l-4 border-red-500 rounded"></div>
                          <span className="text-sm">Refusé</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2 relative">
                            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-sm">Plusieurs événements</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <div className="space-y-4">
                    <Card className="shadow-sm bg-white border-gray-100">
                      <CardHeader className="pb-2 bg-gray-50 rounded-t-lg">
                        <CardTitle className="text-base">Résumé du mois</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <span className="text-muted-foreground">Total congés:</span>
                            <span className="font-medium">{monthlyStats.total}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <span className="text-muted-foreground">Jours d'absence:</span>
                            <span className="font-medium">{monthlyStats.totalJours} jours</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Validés:</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 font-normal">{monthlyStats.valides}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">En attente:</span>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 font-normal">{monthlyStats.enAttente}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Refusés:</span>
                            <Badge variant="outline" className="bg-red-50 text-red-700 font-normal">{monthlyStats.refusees}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm bg-white border-gray-100">
                      <CardHeader className="pb-2 bg-gray-50 rounded-t-lg">
                        <CardTitle className="text-base">Prochains congés</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        {conges
                          .filter(c => new Date(c.dateDebut) > new Date())
                          .sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime())
                          .slice(0, 3)
                          .map((conge) => (
                            <div key={conge.id} className="mb-3 last:mb-0 p-3 border rounded-lg bg-white shadow-sm hover:shadow transition-shadow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{conge.typeCongeNom}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(conge.dateDebut)} - {formatDate(conge.dateFin)}
                                  </p>
                                  <p className="text-xs mt-1 text-gray-500">
                                    {conge.nombreJours} jours
                                  </p>
                                </div>
                                {getStatusBadge(conge.statut)}
                              </div>
                            </div>
                          ))}
                          
                        {conges.filter(c => new Date(c.dateDebut) > new Date()).length === 0 && (
                          <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground">
                              Aucun congé prévu prochainement
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm bg-white border-gray-100">
                      <CardHeader className="pb-2 bg-gray-50 rounded-t-lg">
                        <CardTitle className="text-base">Détails congés actifs</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        {(() => {
                          const today = new Date();
                          const activeLeaves = conges.filter(conge => 
                            isWithinInterval(today, {
                              start: new Date(conge.dateDebut),
                              end: new Date(conge.dateFin)
                            }) && 
                            conge.statut === "validee"
                          );
                          
                          if (activeLeaves.length === 0) {
                            return (
                              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
                                <p className="text-sm text-blue-700">
                                  L'employé n'est pas en congé actuellement
                                </p>
                              </div>
                            );
                          }
                          
                          return activeLeaves.map(conge => (
                            <div key={conge.id} className="p-3 bg-green-50 rounded-lg border border-green-100 mb-2 last:mb-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{conge.typeCongeNom}</h4>
                                  <p className="text-sm">
                                    Du {format(new Date(conge.dateDebut), "dd/MM")} au {format(new Date(conge.dateFin), "dd/MM")}
                                  </p>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                  En cours
                                </Badge>
                              </div>
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Retour prévu:</span> {formatDate(conge.dateFin)}
                              </div>
                            </div>
                          ));
                        })()}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Justificatifs */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Justificatifs d'absence</CardTitle>
              <CardDescription>
                Documents justificatifs fournis par l'employé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Exemple de congé avec justificatif - Congé maladie */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex justify-between">
                      <span>Congé Maladie</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Validée</Badge>
                    </CardTitle>
                    <CardDescription>
                      5 février 2024 - 8 février 2024
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Voir le certificat médical
                    </Button>
                  </CardContent>
                </Card>

                {/* Exemple d'un autre congé avec justificatif - Congé familial */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex justify-between">
                      <span>Congé exceptionnel</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>
                    </CardTitle>
                    <CardDescription>
                      {format(addDays(addMonths(new Date(), 2), 5), "dd MMMM yyyy", { locale: fr })} - {format(addDays(addMonths(new Date(), 2), 7), "dd MMMM yyyy", { locale: fr })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Voir l'acte de mariage
                    </Button>
                  </CardContent>
                </Card>

                {/* Interface pour télécharger un nouveau justificatif */}
                <Card className="md:col-span-2 bg-gray-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Ajouter un justificatif</CardTitle>
                    <CardDescription>
                      Téléchargez un nouveau document pour une demande existante
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="conge-select">Sélectionner une demande</Label>
                        <select 
                          id="conge-select"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1.5"
                        >
                          <option value="">-- Choisir une demande --</option>
                          {conges.filter(c => c.statut === "en_attente").map(conge => (
                            <option key={conge.id} value={conge.id}>
                              {conge.typeCongeNom} ({format(new Date(conge.dateDebut), "dd/MM/yyyy")})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="document-type">Type de document</Label>
                        <select 
                          id="document-type"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1.5"
                        >
                          <option value="">-- Type de document --</option>
                          <option value="medical">Certificat médical</option>
                          <option value="acte">Acte (mariage, naissance, décès)</option>
                          <option value="attestation">Attestation</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600 mb-1">
                            Glisser-déposer un fichier ici, ou
                          </p>
                          <Button variant="outline" size="sm">
                            Parcourir
                          </Button>
                          <p className="text-xs text-gray-500 mt-2">
                            PDF, JPG ou PNG (max 5MB)
                          </p>
                        </div>
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <Button>
                          Enregistrer le document
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog pour la nouvelle demande de congé */}
      <NouvelleDemandeForm 
        open={isDemandeDialogOpen}
        onOpenChange={setIsDemandeDialogOpen}
        employeId={employe.id}
        onCreated={(nouveauConge) => {
          setConges([...conges, nouveauConge]);
        }}
      />
    </div>
  );
};

export default DetailCongesEmploye;
