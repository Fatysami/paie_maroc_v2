
import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Users, 
  Filter,
  RefreshCw
} from "lucide-react";
import { addDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { VueCalendrier, DemandeConge } from "@/types/conges";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Données fictives pour simuler les demandes de congés
const MOCK_CONGES: DemandeConge[] = [
  {
    id: "1",
    employeId: "101",
    employeNom: "Youssef Alami",
    typeCongeId: "1",
    typeCongeNom: "Congés annuels",
    dateDebut: "2025-04-05",
    dateFin: "2025-04-12",
    nombreJours: 7,
    statut: "validee",
    dateCreation: "2025-03-15",
    commentaire: "Vacances en famille"
  },
  {
    id: "2",
    employeId: "102",
    employeNom: "Fatima Amrani",
    typeCongeId: "2",
    typeCongeNom: "Congé Maladie",
    dateDebut: "2025-04-10",
    dateFin: "2025-04-15",
    nombreJours: 5,
    statut: "validee",
    dateCreation: "2025-03-25",
    justificatifUrl: "https://example.com/certificat.pdf"
  },
  {
    id: "3",
    employeId: "103",
    employeNom: "Karim Benali",
    typeCongeId: "6",
    typeCongeNom: "Congé décès proche",
    dateDebut: "2025-04-08",
    dateFin: "2025-04-10",
    nombreJours: 3,
    statut: "validee",
    dateCreation: "2025-04-07"
  },
  {
    id: "4",
    employeId: "104",
    employeNom: "Amina Khalil",
    typeCongeId: "3",
    typeCongeNom: "Congé Maternité",
    dateDebut: "2025-04-20",
    dateFin: "2025-07-27",
    nombreJours: 98,
    statut: "validee",
    dateCreation: "2025-03-10"
  },
  {
    id: "5",
    employeId: "105",
    employeNom: "Mohammed Tazi",
    typeCongeId: "1",
    typeCongeNom: "Congés annuels",
    dateDebut: "2025-04-14",
    dateFin: "2025-04-18",
    nombreJours: 5,
    statut: "en_attente",
    dateCreation: "2025-04-01"
  }
];

// Associations entre types de congés et couleurs
const TYPE_CONGE_COLORS: Record<string, string> = {
  "Congés annuels": "bg-green-500",
  "Congé Maladie": "bg-blue-500",
  "Congé Maternité": "bg-pink-500",
  "Congé Paternité": "bg-purple-500",
  "Congé Mariage": "bg-orange-500",
  "Congé décès proche": "bg-gray-500"
};

const CalendrierConges = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [vue, setVue] = useState<VueCalendrier>("mois");
  const [conges, setConges] = useState<DemandeConge[]>(MOCK_CONGES);
  const [filteredConges, setFilteredConges] = useState<DemandeConge[]>(MOCK_CONGES);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState<boolean>(false);

  // Filtrer les congés en fonction de la vue et de la date actuelle
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...conges];
      
      if (vue === "jour" && selectedDate) {
        filtered = conges.filter(conge => {
          const dateDebut = parseISO(conge.dateDebut);
          const dateFin = parseISO(conge.dateFin);
          return (selectedDate >= dateDebut && selectedDate <= dateFin);
        });
      } else if (vue === "semaine" && selectedDate) {
        const debut = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const fin = endOfWeek(selectedDate, { weekStartsOn: 1 });
        filtered = conges.filter(conge => {
          const dateDebut = parseISO(conge.dateDebut);
          const dateFin = parseISO(conge.dateFin);
          return (dateDebut <= fin && dateFin >= debut);
        });
      } else if (vue === "mois" && selectedDate) {
        const debut = startOfMonth(selectedDate);
        const fin = endOfMonth(selectedDate);
        filtered = conges.filter(conge => {
          const dateDebut = parseISO(conge.dateDebut);
          const dateFin = parseISO(conge.dateFin);
          return (dateDebut <= fin && dateFin >= debut);
        });
      }
      
      setFilteredConges(filtered);
      setLoading(false);
    }, 500);
  }, [vue, selectedDate, conges]);

  // Gestion de la navigation dans le calendrier
  const handlePrevious = () => {
    if (vue === "jour") {
      setSelectedDate(prev => prev ? addDays(prev, -1) : new Date());
    } else if (vue === "semaine") {
      setSelectedDate(prev => prev ? addDays(prev, -7) : new Date());
    } else if (vue === "mois") {
      setSelectedDate(prev => prev ? subMonths(prev, 1) : new Date());
    } else if (vue === "annee") {
      setSelectedDate(prev => {
        if (!prev) return new Date();
        const newDate = new Date(prev);
        newDate.setFullYear(newDate.getFullYear() - 1);
        return newDate;
      });
    }
  };
  
  const handleNext = () => {
    if (vue === "jour") {
      setSelectedDate(prev => prev ? addDays(prev, 1) : new Date());
    } else if (vue === "semaine") {
      setSelectedDate(prev => prev ? addDays(prev, 7) : new Date());
    } else if (vue === "mois") {
      setSelectedDate(prev => prev ? addMonths(prev, 1) : new Date());
    } else if (vue === "annee") {
      setSelectedDate(prev => {
        if (!prev) return new Date();
        const newDate = new Date(prev);
        newDate.setFullYear(newDate.getFullYear() + 1);
        return newDate;
      });
    }
  };
  
  const handleToday = () => {
    setSelectedDate(new Date());
  };

  // Formatage de la période affichée selon la vue
  const getPeriodLabel = () => {
    if (!selectedDate) return "";
    
    if (vue === "jour") {
      return format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr });
    } else if (vue === "semaine") {
      const debut = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const fin = endOfWeek(selectedDate, { weekStartsOn: 1 });
      
      if (isSameMonth(debut, fin)) {
        return `${format(debut, 'd', { locale: fr })} - ${format(fin, 'd MMMM yyyy', { locale: fr })}`;
      } else {
        return `${format(debut, 'd MMM', { locale: fr })} - ${format(fin, 'd MMM yyyy', { locale: fr })}`;
      }
    } else if (vue === "mois") {
      return format(selectedDate, 'MMMM yyyy', { locale: fr });
    } else {
      return format(selectedDate, 'yyyy');
    }
  };

  // Simuler le rafraîchissement des données
  const handleRefresh = () => {
    setLoading(true);
    toast.info("Actualisation des données du calendrier...");
    
    // Simuler un délai de chargement
    setTimeout(() => {
      setLoading(false);
      toast.success("Calendrier des congés actualisé");
    }, 1000);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
          <div>
            <CardTitle className="text-xl">Calendrier des congés</CardTitle>
            <CardDescription>
              Visualisez les périodes de congés pour tous les employés
            </CardDescription>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </Button>
            
            <Select value={vue} onValueChange={(value) => setVue(value as VueCalendrier)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Vue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jour">Jour</SelectItem>
                <SelectItem value="semaine">Semaine</SelectItem>
                <SelectItem value="mois">Mois</SelectItem>
                <SelectItem value="annee">Année</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handlePrevious} disabled={loading}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday} disabled={loading}>
                Aujourd'hui
              </Button>
              <Button variant="outline" size="icon" onClick={handleNext} disabled={loading}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-center my-4">
          <h3 className="text-lg font-semibold">
            {getPeriodLabel()}
          </h3>
        </div>
        
        <div className="grid md:grid-cols-5 gap-4">
          {/* Calendrier interactif (à gauche) */}
          <div className="md:col-span-3 border rounded-md p-2">
            <div className="flex justify-center items-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md"
                disabled={loading}
                
                // Personnalisation pour afficher les jours avec congés
                modifiers={{
                  hasConge: conges.flatMap(conge => {
                    const start = new Date(conge.dateDebut);
                    const end = new Date(conge.dateFin);
                    const days = [];
                    let current = start;
                    
                    while (current <= end) {
                      days.push(new Date(current));
                      current.setDate(current.getDate() + 1);
                    }
                    
                    return days;
                  })
                }}
                modifiersClassNames={{
                  hasConge: "border border-blue-500 bg-blue-50"
                }}
              />
            </div>
          </div>
          
          {/* Liste des congés pour la période sélectionnée (à droite) */}
          <div className="md:col-span-2 border rounded-md">
            <div className="p-4 border-b">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Congés {vue === "jour" ? "du jour" : `de la ${vue}`}</span>
                <Badge variant="outline" className="ml-auto">
                  {filteredConges.length}
                </Badge>
              </h4>
            </div>
            
            <ScrollArea className="h-[350px] p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : filteredConges.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Aucun congé pour cette période</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredConges.map((conge) => (
                    <div key={conge.id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{conge.employeNom}</h5>
                        <Badge 
                          variant={conge.statut === "validee" ? "success" : 
                                  conge.statut === "en_attente" ? "outline" : 
                                  conge.statut === "refusee" ? "destructive" : "secondary"}
                        >
                          {conge.statut === "validee" ? "Validé" : 
                           conge.statut === "en_attente" ? "En attente" : 
                           conge.statut === "refusee" ? "Refusé" : "Annulé"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center mt-2">
                        <div 
                          className={`w-3 h-3 rounded-full mr-2 ${TYPE_CONGE_COLORS[conge.typeCongeNom] || 'bg-slate-500'}`}
                        />
                        <span className="text-sm">{conge.typeCongeNom}</span>
                      </div>
                      
                      <div className="text-sm mt-2 text-muted-foreground">
                        Du {format(new Date(conge.dateDebut), 'dd/MM/yyyy')} au {format(new Date(conge.dateFin), 'dd/MM/yyyy')}
                        <span className="ml-1">({conge.nombreJours} jour{conge.nombreJours > 1 ? 's' : ''})</span>
                      </div>
                      
                      {conge.commentaire && (
                        <div className="text-sm mt-1 italic truncate">{conge.commentaire}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="text-sm font-medium">Légende:</div>
          <div className="flex flex-wrap gap-4">
            {Object.entries(TYPE_CONGE_COLORS).map(([type, colorClass]) => (
              <div key={type} className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${colorClass}`}></div>
                <span className="text-sm">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendrierConges;
