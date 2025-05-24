
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AbsenceStats, TypeAbsence, AnalyseAbsence } from "@/types/absences";
import { AlertTriangle, TrendingUp, TrendingDown, Users, Calendar, DollarSign } from "lucide-react";

// Données d'exemple pour la démonstration
const generateMockAbsenceStats = (): AbsenceStats => {
  return {
    total: 127,
    maladie: 45,
    injustifiees: 12,
    retards: 34,
    exceptionnelles: 18,
    sansSolde: 8,
    autres: 10,
    enAttente: 18,
    validees: 93,
    refusees: 9,
    regularisees: 7,
    impactPaie: 54,
    totalJours: 187,
    coutTotal: 48250,
    tauxAbsenteisme: 4.2,
    evolutionMensuelle: {
      "Jan": 3.1,
      "Fév": 3.2,
      "Mar": 3.5,
      "Avr": 3.8,
      "Mai": 4.0,
      "Juin": 4.2
    },
    repartitionService: {
      "Informatique": 3.2,
      "Finances": 2.8,
      "Marketing": 4.5,
      "RH": 2.4,
      "Production": 5.6,
      "Commercial": 3.9
    }
  };
};

const generateMockAnalyseAbsence = (): AnalyseAbsence => {
  return {
    periode: "Juin 2024",
    tauxAbsenteisme: 4.2,
    coutTotal: 48250,
    repartitionTypes: {
      "maladie": 45,
      "absence_injustifiee": 12,
      "retard": 34,
      "absence_exceptionnelle": 18,
      "absence_sans_solde": 8,
      "autre": 10
    },
    tendances: {
      direction: "hausse",
      pourcentage: 8.5
    },
    topDepartements: [
      { nom: "Production", taux: 5.6, cout: 15200 },
      { nom: "Marketing", taux: 4.5, cout: 9800 },
      { nom: "Commercial", taux: 3.9, cout: 8500 }
    ],
    topEmployes: [
      { id: "5", nom: "Karima Bennani", nombreAbsences: 5, nombreJours: 12 },
      { id: "8", nom: "Youssef Nadori", nombreAbsences: 4, nombreJours: 8 },
      { id: "3", nom: "Karim Lahmidi", nombreAbsences: 4, nombreJours: 6 }
    ]
  };
};

// Couleurs pour les graphiques
const COLORS = {
  maladie: "#8884d8",
  injustifiees: "#FF8042",
  retards: "#FFBB28",
  exceptionnelles: "#0088FE",
  sansSolde: "#00C49F",
  autres: "#777777"
};

const COLORS_STATUT = {
  enAttente: "#FFBB28",
  validees: "#00C49F",
  refusees: "#FF8042",
  regularisees: "#8884d8"
};

interface StatistiquesAbsencesProps {
  departementId?: string;
}

const StatistiquesAbsences: React.FC<StatistiquesAbsencesProps> = ({ departementId }) => {
  const [periode, setPeriode] = useState("mois");
  const [tabActif, setTabActif] = useState("apercu");
  
  const stats = generateMockAbsenceStats();
  const analyse = generateMockAnalyseAbsence();
  
  // Préparation des données pour les graphiques
  const dataTypes = [
    { name: "Maladie", value: stats.maladie, color: COLORS.maladie },
    { name: "Injustifiées", value: stats.injustifiees, color: COLORS.injustifiees },
    { name: "Retards", value: stats.retards, color: COLORS.retards },
    { name: "Exceptionnelles", value: stats.exceptionnelles, color: COLORS.exceptionnelles },
    { name: "Sans solde", value: stats.sansSolde, color: COLORS.sansSolde },
    { name: "Autres", value: stats.autres, color: COLORS.autres },
  ];
  
  const dataStatuts = [
    { name: "En attente", value: stats.enAttente, color: COLORS_STATUT.enAttente },
    { name: "Validées", value: stats.validees, color: COLORS_STATUT.validees },
    { name: "Refusées", value: stats.refusees, color: COLORS_STATUT.refusees },
    { name: "Régularisées", value: stats.regularisees, color: COLORS_STATUT.regularisees },
  ];
  
  const dataEvolution = Object.entries(stats.evolutionMensuelle).map(([mois, taux]) => ({
    name: mois,
    taux: taux
  }));
  
  const dataServices = Object.entries(stats.repartitionService).map(([service, taux]) => ({
    name: service,
    taux: taux
  }));
  
  return (
    <div className="space-y-6">
      {/* En-tête avec les filtres */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold">Statistiques des absences</h2>
        <div className="flex space-x-2">
          <Select value={periode} onValueChange={setPeriode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mois">Mois en cours</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="semestre">Semestre</SelectItem>
              <SelectItem value="annee">Année</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Cartes de métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Taux d'absentéisme</p>
                <h3 className="text-2xl font-bold text-blue-900">{stats.tauxAbsenteisme}%</h3>
              </div>
              <div className="rounded-full bg-blue-100 p-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              {analyse.tendances.direction === "hausse" 
                ? `↗ En hausse de ${analyse.tendances.pourcentage}% vs période précédente` 
                : `↘ En baisse de ${analyse.tendances.pourcentage}% vs période précédente`}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">Total absences</p>
                <h3 className="text-2xl font-bold text-amber-900">{stats.total}</h3>
              </div>
              <div className="rounded-full bg-amber-100 p-2">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-amber-700 mt-2">
              {stats.enAttente} en attente de validation
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Jours d'absence</p>
                <h3 className="text-2xl font-bold text-green-900">{stats.totalJours}</h3>
              </div>
              <div className="rounded-full bg-green-100 p-2">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-700 mt-2">
              {Math.round(stats.totalJours / stats.total * 10) / 10} jours en moyenne par absence
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Coût estimé</p>
                <h3 className="text-2xl font-bold text-red-900">{stats.coutTotal.toLocaleString()} DH</h3>
              </div>
              <div className="rounded-full bg-red-100 p-2">
                <DollarSign className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-red-700 mt-2">
              {stats.impactPaie} absences avec impact sur la paie
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Alerte si le taux est élevé */}
      {stats.tauxAbsenteisme > 4.0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Taux d'absentéisme élevé</h4>
            <p className="text-sm text-amber-700">
              Le taux d'absentéisme actuel de {stats.tauxAbsenteisme}% est supérieur à l'objectif de 4%. 
              Consultez l'analyse détaillée pour identifier les causes potentielles.
            </p>
          </div>
        </div>
      )}
      
      {/* Onglets pour les différentes vues de statistiques */}
      <Tabs value={tabActif} onValueChange={setTabActif} className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="apercu">Aperçu général</TabsTrigger>
          <TabsTrigger value="departements">Par département</TabsTrigger>
          <TabsTrigger value="tendances">Tendances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="apercu" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique de répartition par type */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par type d'absence</CardTitle>
                <CardDescription>Distribution des absences par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dataTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} absences`, 'Nombre']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Graphique de répartition par statut */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par statut</CardTitle>
                <CardDescription>État actuel des demandes d'absence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dataStatuts}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Nombre d'absences">
                        {dataStatuts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Employés les plus absents */}
          <Card>
            <CardHeader>
              <CardTitle>Top employés avec le plus d'absences</CardTitle>
              <CardDescription>Sur la période sélectionnée</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-medium">Employé</th>
                      <th className="text-center py-2 px-4 font-medium">Nombre d'absences</th>
                      <th className="text-center py-2 px-4 font-medium">Jours cumulés</th>
                      <th className="text-center py-2 px-4 font-medium">Impact paie estimé</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyse.topEmployes.map((employe) => (
                      <tr key={employe.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{employe.nom}</td>
                        <td className="py-2 px-4 text-center">{employe.nombreAbsences}</td>
                        <td className="py-2 px-4 text-center">{employe.nombreJours}</td>
                        <td className="py-2 px-4 text-center">
                          {(employe.nombreJours * 500).toLocaleString()} DH
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departements" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Taux d'absentéisme par département</CardTitle>
              <CardDescription>Comparaison entre services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dataServices}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Taux d\'absentéisme']} />
                    <Legend />
                    <Bar dataKey="taux" name="Taux d'absentéisme (%)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Détail par département</CardTitle>
              <CardDescription>Analyse coût et absences par service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-medium">Département</th>
                      <th className="text-center py-2 px-4 font-medium">Taux d'absentéisme</th>
                      <th className="text-center py-2 px-4 font-medium">Coût estimé</th>
                      <th className="text-center py-2 px-4 font-medium">Actions recommandées</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyse.topDepartements.map((dept) => (
                      <tr key={dept.nom} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{dept.nom}</td>
                        <td className="py-2 px-4 text-center">
                          <span className={`font-medium ${dept.taux > 4 ? 'text-red-600' : 'text-green-600'}`}>
                            {dept.taux}%
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center">{dept.cout.toLocaleString()} DH</td>
                        <td className="py-2 px-4 text-center text-sm">
                          {dept.taux > 5 
                            ? "Entretien avec responsable requis" 
                            : dept.taux > 4 
                              ? "Surveillance accrue recommandée"
                              : "Niveau normal - aucune action"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tendances" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du taux d'absentéisme</CardTitle>
              <CardDescription>Tendance mensuelle sur le semestre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dataEvolution}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Taux d\'absentéisme']} />
                    <Legend />
                    <Bar dataKey="taux" name="Taux d'absentéisme (%)" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Analyse des tendances</CardTitle>
              <CardDescription>Interprétation des données et recommandations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-medium text-blue-800 mb-2">Tendance générale</h4>
                  <p className="text-blue-700">
                    Le taux d'absentéisme est en {analyse.tendances.direction === "hausse" ? "hausse" : "baisse"} de {analyse.tendances.pourcentage}% 
                    par rapport à la période précédente. {analyse.tendances.direction === "hausse" 
                    ? "Cette hausse mérite une attention particulière." 
                    : "Cette baisse est un signe positif."}
                  </p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-md">
                  <h4 className="font-medium text-slate-800 mb-2">Facteurs contributifs identifiés</h4>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>Les absences pour maladie représentent {Math.round(stats.maladie/stats.total*100)}% du total</li>
                    <li>Les retards fréquents concernent principalement le département {analyse.topDepartements[0].nom}</li>
                    <li>Le mois ayant le taux le plus élevé est {Object.entries(stats.evolutionMensuelle).sort((a, b) => b[1] - a[1])[0][0]}</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-md">
                  <h4 className="font-medium text-green-800 mb-2">Recommandations</h4>
                  <ul className="list-disc list-inside text-green-700 space-y-1">
                    <li>Organiser une réunion avec les responsables du département {analyse.topDepartements[0].nom}</li>
                    <li>Évaluer les conditions de travail pour réduire les absences maladie</li>
                    <li>Mettre en place des incitations pour réduire les retards fréquents</li>
                    <li>Revoir la politique de validation des absences pour plus de rigueur</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatistiquesAbsences;
