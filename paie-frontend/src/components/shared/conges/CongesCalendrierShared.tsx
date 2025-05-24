
import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft,
  ChevronRight,
  Info,
  HelpCircle
} from "lucide-react";
import { format, addDays, differenceInDays, isSameDay, isSameMonth, isToday, addMonths, subMonths, isWithinInterval, isFuture } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface CongeEmploye {
  id: string;
  type: string;
  dateDebut: Date;
  dateFin: Date;
  statut: "validé" | "en attente" | "refusé" | "annulé";
  nombreJours: number;
  commentaire?: string;
}

interface CongesCalendrierSharedProps {
  congesData: CongeEmploye[];
  isAdmin?: boolean;
  employeNom?: string;
  onAction?: (action: string, congeId: string) => void;
}

const CongesCalendrierShared: React.FC<CongesCalendrierSharedProps> = ({ 
  congesData, 
  isAdmin = false,
  employeNom,
  onAction
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>("calendrier");
  
  const renderStatutBadge = (statut: string) => {
    switch (statut) {
      case 'validé':
        return <Badge variant="outline" className="bg-green-100 text-green-800 font-medium">Validé</Badge>;
      case 'en attente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 font-medium">En attente</Badge>;
      case 'refusé':
        return <Badge variant="outline" className="bg-red-100 text-red-800 font-medium">Refusé</Badge>;
      case 'annulé':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 font-medium">Annulé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const goToPreviousMonth = () => {
    setSelectedMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const goToNextMonth = () => {
    setSelectedMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const goToCurrentMonth = () => {
    setSelectedMonth(new Date());
  };

  const hasConge = (date: Date) => {
    return congesData.some(conge => 
      date >= conge.dateDebut && 
      date <= conge.dateFin
    );
  };

  const getCongeStatus = (date: Date) => {
    const conge = congesData.find(c => 
      date >= c.dateDebut && 
      date <= c.dateFin
    );
    return conge?.statut || null;
  };

  const getCongeDetails = (date: Date) => {
    return congesData.filter(c => 
      date >= c.dateDebut && 
      date <= c.dateFin
    );
  };

  const isCongeStartDate = (date: Date) => {
    return congesData.some(conge => isSameDay(date, conge.dateDebut));
  };

  const isCongeEndDate = (date: Date) => {
    return congesData.some(conge => isSameDay(date, conge.dateFin));
  };

  const getUpcomingLeaves = () => {
    const today = new Date();
    return congesData
      .filter(conge => isFuture(conge.dateDebut) || isSameDay(today, conge.dateDebut))
      .sort((a, b) => a.dateDebut.getTime() - b.dateDebut.getTime())
      .slice(0, 3);
  };

  const getMonthSummary = () => {
    const firstDayOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    
    const monthLeaves = congesData.filter(conge => {
      return (
        (conge.dateDebut <= lastDayOfMonth && conge.dateFin >= firstDayOfMonth) ||
        (conge.dateDebut >= firstDayOfMonth && conge.dateDebut <= lastDayOfMonth) ||
        (conge.dateFin >= firstDayOfMonth && conge.dateFin <= lastDayOfMonth)
      );
    });
    
    const totalDays = monthLeaves.reduce((total, conge) => {
      let startDate = conge.dateDebut < firstDayOfMonth ? firstDayOfMonth : conge.dateDebut;
      let endDate = conge.dateFin > lastDayOfMonth ? lastDayOfMonth : conge.dateFin;
      return total + (differenceInDays(endDate, startDate) + 1);
    }, 0);
    
    const approved = monthLeaves.filter(c => c.statut === "validé").length;
    const pending = monthLeaves.filter(c => c.statut === "en attente").length;
    const rejected = monthLeaves.filter(c => c.statut === "refusé").length;
    
    return {
      total: monthLeaves.length,
      totalDays,
      approved,
      pending,
      rejected
    };
  };

  const renderCalendarDay = (day: Date, selectedDates: Date[] | undefined, props: any) => {
    const hasEvent = hasConge(day);
    const status = getCongeStatus(day);
    const isFirstDayOfMonth = day.getDate() === 1;
    const conges = getCongeDetails(day);
    const isTodayDate = isToday(day);
    const isCurrentMonth = isSameMonth(day, selectedMonth);
    const isStartDate = isCongeStartDate(day);
    const isEndDate = isCongeEndDate(day);
    
    let dayClass = "relative bg-white border border-gray-200";
    let statusClass = "";
    let ringClass = "";
    let textClass = isCurrentMonth ? "text-gray-900 font-semibold" : "text-gray-400 font-medium";
    
    let positionClass = "";
    if (isStartDate && isEndDate) {
      positionClass = "rounded-full";
    } else if (isStartDate) {
      positionClass = "rounded-l-full";
    } else if (isEndDate) {
      positionClass = "rounded-r-full";
    }
    
    if (hasEvent) {
      switch (status) {
        case "validé":
          statusClass = "bg-green-200 border-green-500";
          ringClass = "ring-2 ring-green-400";
          break;
        case "en attente":
          statusClass = "bg-yellow-200 border-yellow-500";
          ringClass = "ring-2 ring-yellow-400";
          break;
        case "refusé":
          statusClass = "bg-red-200 border-red-500";
          ringClass = "ring-2 ring-red-400";
          break;
      }

      dayClass = `${dayClass} ${statusClass} ${ringClass} ${positionClass}`;
    }

    if (isTodayDate) {
      dayClass += " ring-4 ring-blue-500 shadow-md";
      textClass = "text-blue-900 font-bold";
    }

    if (isFirstDayOfMonth) {
      textClass += " font-bold underline";
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              type="button"
              className={`${props.className} ${dayClass} rounded-md transition-all group hover:scale-110 hover:z-10 hover:shadow-lg pointer-events-auto w-10 h-10 p-0 shadow-sm`}
              onClick={() => props.onClick?.()}
            >
              <div className={`flex h-full w-full items-center justify-center ${textClass}`}>
                {format(day, 'd')}
              </div>
              
              {hasEvent && conges.length > 0 && (
                <div className="absolute -top-2 -right-2 flex items-center justify-center">
                  <div className={`flex items-center justify-center rounded-full text-xs font-bold 
                    ${status === "validé" ? "bg-green-600 text-white" : 
                      status === "en attente" ? "bg-yellow-600 text-white" : 
                      "bg-red-600 text-white"} 
                    w-5 h-5 shadow-md`}>
                    {conges.length}
                  </div>
                </div>
              )}
              
              {hasEvent && (
                <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 bg-black bg-opacity-20 transition-opacity duration-200"></div>
              )}
            </button>
          </TooltipTrigger>
          
          {hasEvent && conges.length > 0 && (
            <TooltipContent side="right" className="p-0 border-none shadow-xl">
              <div className="bg-white rounded-lg overflow-hidden shadow-xl border border-gray-200 max-w-xs">
                <div className="bg-slate-100 px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-bold">{format(day, "EEEE dd MMMM yyyy", { locale: fr })}</p>
                </div>
                <div className="p-4 space-y-3">
                  {conges.map((conge, idx) => (
                    <div key={idx} className="flex flex-col space-y-1 text-sm border-b pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-blue-900">{conge.type}</p>
                        {renderStatutBadge(conge.statut)}
                      </div>
                      <p className="text-gray-700">
                        <span className="font-medium">Période:</span> {format(conge.dateDebut, "dd/MM/yyyy")} - {format(conge.dateFin, "dd/MM/yyyy")}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Durée:</span> {conge.nombreJours} jour{conge.nombreJours > 1 ? 's' : ''}
                      </p>
                      {conge.commentaire && (
                        <p className="text-gray-600 italic border-l-2 border-gray-300 pl-2 mt-1">{conge.commentaire}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  const monthSummary = getMonthSummary();
  const upcomingLeaves = getUpcomingLeaves();

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 rounded-lg bg-gray-100 p-1">
          <TabsTrigger value="calendrier" className="rounded-md">Calendrier</TabsTrigger>
          <TabsTrigger value="historique" className="rounded-md">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendrier" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-lg lg:col-span-2">
              <CardHeader className="bg-slate-50 rounded-t-lg border-b">
                <CardTitle className="text-lg font-bold text-slate-800">Calendrier des absences</CardTitle>
                <CardDescription className="text-slate-600">
                  {employeNom ? `Visualisation des périodes d'absence pour ${employeNom}` : "Visualisation des périodes d'absence de l'employé"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6 px-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={goToPreviousMonth}
                    className="flex items-center gap-1 bg-white shadow-sm hover:bg-slate-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Mois précédent
                  </Button>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-800 capitalize">
                      {format(selectedMonth, 'MMMM yyyy', { locale: fr })}
                    </h3>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={goToNextMonth}
                    className="flex items-center gap-1 bg-white shadow-sm hover:bg-slate-50"
                  >
                    Mois suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={goToCurrentMonth}
                  className="mx-auto mb-4 flex items-center gap-1 shadow-sm"
                >
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Aujourd'hui
                </Button>
                
                <div className="rounded-lg p-4 border-2 border-gray-300 shadow-lg bg-white backdrop-blur-sm overflow-hidden">
                  <Calendar
                    mode="single"
                    selected={currentDate}
                    onSelect={(date) => date && setCurrentDate(date)}
                    month={selectedMonth}
                    onMonthChange={setSelectedMonth}
                    locale={fr}
                    className="rounded-md pointer-events-auto"
                    components={{
                      Day: ({ date, ...props }) => renderCalendarDay(date, undefined, props)
                    }}
                    showOutsideDays={true}
                  />
                </div>
                
                <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <h4 className="font-bold mb-3 text-slate-800 flex items-center">
                    <Info className="h-4 w-4 text-blue-600 mr-2" />
                    Légende des congés
                  </h4>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-green-500 rounded-sm mr-2"></div>
                      <span>Congé validé</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-yellow-500 rounded-sm mr-2"></div>
                      <span>En attente</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-red-500 rounded-sm mr-2"></div>
                      <span>Refusé</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
                      <span>Plusieurs événements</span>
                    </div>
                  </div>
                  
                  {/* Descriptif de fonctionnement du calendrier */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-bold text-blue-800 mb-2">Fonctionnement du calendrier:</h5>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-blue-900">
                      <li>Les jours avec congés sont colorés selon leur statut</li>
                      <li>Le chiffre indique le nombre de congés pour cette date</li>
                      <li>Passez votre souris sur un jour pour voir les détails</li>
                      <li>Utilisez les boutons de navigation pour changer de mois</li>
                    </ul>
                    
                    <h5 className="font-bold text-blue-800 mt-4 mb-2">Exemple d'utilisation</h5>
                    <p className="text-sm text-blue-900">
                      <span className="font-medium">Comment lire le calendrier:</span> Les jours avec congés sont mis en évidence. 
                      Par exemple, 28 mars 2025, vous avez un congé maladie validé de 2 jours. 
                      Passez votre souris sur n'importe quel jour coloré pour voir les détails complets du congé.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-md">
                <CardHeader className="pb-3 bg-slate-50 border-b">
                  <CardTitle className="text-lg font-bold text-slate-800 capitalize">
                    {format(selectedMonth, 'MMMM yyyy', { locale: fr })}
                  </CardTitle>
                  <CardDescription>
                    Résumé du mois
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-slate-700">Total des demandes:</span>
                      <span className="font-bold text-blue-600">{monthSummary.total}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-slate-700">Jours d'absence:</span>
                      <span className="font-bold text-blue-600">{monthSummary.totalDays}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-slate-700">Validées:</span>
                      <Badge className="bg-green-100 text-green-800 border-0">{monthSummary.approved}</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-slate-700">En attente:</span>
                      <Badge className="bg-yellow-100 text-yellow-800 border-0">{monthSummary.pending}</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium text-slate-700">Refusées:</span>
                      <Badge className="bg-red-100 text-red-800 border-0">{monthSummary.rejected}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader className="pb-3 bg-slate-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                    <CalendarIcon className="h-5 w-5 text-purple-600" />
                    Congés à venir
                  </CardTitle>
                  <CardDescription>
                    Prochaines absences planifiées
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {upcomingLeaves.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingLeaves.map((conge) => (
                        <div key={conge.id} className="p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-bold text-slate-800">{conge.type}</div>
                            {renderStatutBadge(conge.statut)}
                          </div>
                          <div className="text-sm text-slate-600 mb-1">
                            <span>Du</span> {format(conge.dateDebut, "dd/MM/yyyy")}
                            <span> au</span> {format(conge.dateFin, "dd/MM/yyyy")}
                          </div>
                          <div className="text-sm text-slate-700 font-medium">
                            {conge.nombreJours} jour{conge.nombreJours > 1 ? 's' : ''}
                          </div>
                          {conge.commentaire && (
                            <div className="mt-2 text-sm italic text-slate-500 border-l-2 border-slate-300 pl-2">
                              {conge.commentaire}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 py-4">
                      Aucun congé planifié prochainement
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="historique" className="mt-6">
          <Card className="shadow-md">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-lg font-bold">Historique des congés</CardTitle>
              <CardDescription>
                Toutes les demandes de congés et absences passées
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {congesData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Jours</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {congesData.map((conge) => (
                      <TableRow key={conge.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{conge.type}</TableCell>
                        <TableCell>
                          {format(conge.dateDebut, "dd/MM/yyyy")} - {format(conge.dateFin, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{conge.nombreJours}</TableCell>
                        <TableCell>{renderStatutBadge(conge.statut)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Alert>
                  <AlertDescription>
                    Aucun historique de congés pour cet employé.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CongesCalendrierShared;
