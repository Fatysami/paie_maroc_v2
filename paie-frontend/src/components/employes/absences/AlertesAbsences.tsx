
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Search, 
  CheckCircle, 
  User, 
  Filter, 
  Trash2, 
  Bell, 
  BellOff 
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { AlerteAbsence } from "@/types/absences";

// Données d'exemple pour la démonstration
const generateMockAlertes = (): AlerteAbsence[] => {
  return [
    {
      type: "absence_repetee",
      date: new Date().toISOString(),
      message: "Mohamed El Alaoui a eu 3 absences dans les 30 derniers jours",
      niveau: "warning",
      notifieManager: true,
      notifieRH: true,
      resolue: false
    },
    {
      type: "retard_frequent",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      message: "Salma Benjelloun a eu 5 retards ce mois-ci",
      niveau: "danger",
      notifieManager: true,
      notifieRH: true,
      resolue: false
    },
    {
      type: "pattern_suspect",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      message: "Karim Lahmidi - Tendance de prendre des absences les lundis et vendredis",
      niveau: "warning",
      notifieManager: true,
      notifieRH: true,
      resolue: false
    },
    {
      type: "justificatif_manquant",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      message: "Ilham Tazi - Justificatif manquant pour absence maladie du 12/04/2024",
      niveau: "info",
      notifieManager: false,
      notifieRH: true,
      resolue: true,
      dateResolution: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      type: "absence_injustifiee",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      message: "Yassine Mourid - Absence injustifiée de 2 jours nécessitant une action disciplinaire",
      niveau: "danger",
      notifieManager: true,
      notifieRH: true,
      resolue: false
    },
    {
      type: "retard_frequent",
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      message: "Loubna Kadiri - Plus de 200 minutes de retard cumulées ce mois",
      niveau: "danger",
      notifieManager: true,
      notifieRH: true,
      resolue: true,
      dateResolution: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
};

const AlertesAbsences: React.FC = () => {
  const [tabActif, setTabActif] = useState("actives");
  const [recherche, setRecherche] = useState("");
  const [filtreNiveau, setFiltreNiveau] = useState("tous");
  const [filtreType, setFiltreType] = useState("tous");
  const [alertes, setAlertes] = useState<AlerteAbsence[]>(generateMockAlertes());
  
  const handleMarquerResolue = (indexAlerte: number) => {
    const nouvellesAlertes = [...alertes];
    nouvellesAlertes[indexAlerte] = {
      ...nouvellesAlertes[indexAlerte],
      resolue: true,
      dateResolution: new Date().toISOString()
    };
    setAlertes(nouvellesAlertes);
    toast.success("Alerte marquée comme résolue");
  };
  
  const handleSupprimerAlerte = (indexAlerte: number) => {
    const nouvellesAlertes = alertes.filter((_, index) => index !== indexAlerte);
    setAlertes(nouvellesAlertes);
    toast.success("Alerte supprimée avec succès");
  };
  
  const handleToggleNotification = (indexAlerte: number, cible: "manager" | "rh") => {
    const nouvellesAlertes = [...alertes];
    if (cible === "manager") {
      nouvellesAlertes[indexAlerte].notifieManager = !nouvellesAlertes[indexAlerte].notifieManager;
    } else {
      nouvellesAlertes[indexAlerte].notifieRH = !nouvellesAlertes[indexAlerte].notifieRH;
    }
    setAlertes(nouvellesAlertes);
    toast.success(`Notification ${cible === "manager" ? "manager" : "RH"} ${nouvellesAlertes[indexAlerte].notifieManager ? "activée" : "désactivée"}`);
  };
  
  // Filtrage des alertes
  const filtrerAlertes = () => {
    return alertes.filter(alerte => {
      // Filtre par recherche
      const matchRecherche = alerte.message.toLowerCase().includes(recherche.toLowerCase());
      
      // Filtre par niveau
      const matchNiveau = filtreNiveau === "tous" || alerte.niveau === filtreNiveau;
      
      // Filtre par type
      const matchType = filtreType === "tous" || alerte.type === filtreType;
      
      // Filtre par statut (résolue ou active)
      const matchStatut = tabActif === "toutes" || 
                         (tabActif === "actives" && !alerte.resolue) || 
                         (tabActif === "resolues" && alerte.resolue);
      
      return matchRecherche && matchNiveau && matchType && matchStatut;
    });
  };
  
  const alertesFiltrees = filtrerAlertes();
  
  const getNiveauBadge = (niveau: string) => {
    switch(niveau) {
      case "info":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Info</Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Attention</Badge>;
      case "danger":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Urgent</Badge>;
      default:
        return <Badge variant="outline">{niveau}</Badge>;
    }
  };
  
  const getIconeType = (type: string) => {
    switch(type) {
      case "absence_repetee":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "retard_frequent":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "pattern_suspect":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "justificatif_manquant":
        return <Filter className="h-5 w-5 text-purple-500" />;
      case "absence_injustifiee":
        return <Trash2 className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex justify-between items-center">
            <span>Alertes d'absences</span>
            <Badge variant="outline" className="bg-gray-100 border-gray-200">
              {alertesFiltrees.length} / {alertes.filter(a => !a.resolue).length} actives
            </Badge>
          </CardTitle>
          <CardDescription>
            Système de suivi des absences répétées, retards fréquents et patterns anormaux
          </CardDescription>
          
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
              <Select value={filtreNiveau} onValueChange={setFiltreNiveau}>
                <SelectTrigger>
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les niveaux</SelectItem>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="warning">Attention</SelectItem>
                  <SelectItem value="danger">Urgence</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filtreType} onValueChange={setFiltreType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'alerte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les types</SelectItem>
                  <SelectItem value="absence_repetee">Absences répétées</SelectItem>
                  <SelectItem value="retard_frequent">Retards fréquents</SelectItem>
                  <SelectItem value="pattern_suspect">Pattern suspect</SelectItem>
                  <SelectItem value="justificatif_manquant">Justificatif manquant</SelectItem>
                  <SelectItem value="absence_injustifiee">Absence injustifiée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={tabActif} onValueChange={setTabActif} className="w-full">
            <TabsList className="w-full flex justify-around p-0 bg-gray-100 rounded-none">
              <TabsTrigger value="actives" className="flex-1 py-3 data-[state=active]:bg-white rounded-none">
                Actives ({alertes.filter(a => !a.resolue).length})
              </TabsTrigger>
              <TabsTrigger value="resolues" className="flex-1 py-3 data-[state=active]:bg-white rounded-none">
                Résolues ({alertes.filter(a => a.resolue).length})
              </TabsTrigger>
              <TabsTrigger value="toutes" className="flex-1 py-3 data-[state=active]:bg-white rounded-none">
                Toutes ({alertes.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="actives" className="p-0 m-0">
              {renderListeAlertes(alertesFiltrees)}
            </TabsContent>
            
            <TabsContent value="resolues" className="p-0 m-0">
              {renderListeAlertes(alertesFiltrees)}
            </TabsContent>
            
            <TabsContent value="toutes" className="p-0 m-0">
              {renderListeAlertes(alertesFiltrees)}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="bg-slate-50 border-t py-3 text-sm text-slate-600">
          <p>Les alertes sont générées automatiquement selon les règles définies dans les paramètres</p>
        </CardFooter>
      </Card>
    </div>
  );
  
  function renderListeAlertes(alertes: AlerteAbsence[]) {
    if (alertes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500 text-center">Aucune alerte trouvée</p>
          <p className="text-gray-400 text-sm text-center">Ajustez vos filtres ou vérifiez plus tard</p>
        </div>
      );
    }
    
    return alertes.map((alerte, index) => (
      <div 
        key={`${alerte.type}-${index}`} 
        className={`border-b last:border-b-0 p-4 ${alerte.resolue ? 'bg-gray-50' : ''}`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1">{getIconeType(alerte.type)}</div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="font-medium">
                  {alerte.message.split(' - ')[0]} 
                </div>
                {getNiveauBadge(alerte.niveau)}
              </div>
              
              <div className="text-sm text-gray-500">
                {format(new Date(alerte.date), "d MMMM yyyy", { locale: fr })}
                {alerte.resolue && alerte.dateResolution && (
                  <span> • Résolue le {format(new Date(alerte.dateResolution), "d MMMM", { locale: fr })}</span>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 mb-2">
              {alerte.message.includes(' - ') ? alerte.message.split(' - ')[1] : alerte.message}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm"
                className="flex gap-1 items-center"
                onClick={() => handleToggleNotification(index, "manager")}
              >
                {alerte.notifieManager ? (
                  <>
                    <Bell className="h-3.5 w-3.5" />
                    <span>Manager notifié</span>
                  </>
                ) : (
                  <>
                    <BellOff className="h-3.5 w-3.5" />
                    <span>Notifier manager</span>
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex gap-1 items-center"
                onClick={() => handleToggleNotification(index, "rh")}
              >
                {alerte.notifieRH ? (
                  <>
                    <Bell className="h-3.5 w-3.5" />
                    <span>RH notifié</span>
                  </>
                ) : (
                  <>
                    <BellOff className="h-3.5 w-3.5" />
                    <span>Notifier RH</span>
                  </>
                )}
              </Button>
              
              {!alerte.resolue && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => handleMarquerResolue(index)}
                >
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  Marquer comme résolue
                </Button>
              )}
              
              <Button 
                variant="outline"
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleSupprimerAlerte(index)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Supprimer
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
              >
                <User className="h-3.5 w-3.5 mr-1" />
                Voir employé
              </Button>
            </div>
          </div>
        </div>
      </div>
    ));
  }
};

export default AlertesAbsences;
