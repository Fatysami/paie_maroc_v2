
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EffectifsTabProps {
  period: {
    debut: Date;
    fin: Date;
  };
  filters: {
    departement: string;
    statut: string;
    typeContrat: string;
    sexe: string;
  };
}

const EffectifsTab: React.FC<EffectifsTabProps> = ({ period, filters }) => {
  // Données pour la répartition par âge
  const ageData = [
    { name: '< 25 ans', count: 12 },
    { name: '25-34 ans', count: 42 },
    { name: '35-44 ans', count: 38 },
    { name: '45-54 ans', count: 25 },
    { name: '> 55 ans', count: 10 }
  ];

  // Données pour la répartition par sexe
  const sexeData = [
    { name: 'Hommes', value: 73 },
    { name: 'Femmes', value: 54 }
  ];

  // Données pour la répartition par type de contrat
  const contratData = [
    { name: 'CDI', value: 105 },
    { name: 'CDD', value: 15 },
    { name: 'Stage', value: 5 },
    { name: 'Intérim', value: 2 }
  ];

  // Données pour l'évolution des effectifs
  const evolutionData = [
    { name: 'Jan', total: 121 },
    { name: 'Fév', total: 122 },
    { name: 'Mar', total: 120 },
    { name: 'Avr', total: 122 },
    { name: 'Mai', total: 125 },
    { name: 'Juin', total: 126 },
    { name: 'Juil', total: 127 }
  ];

  // Données du tableau des mouvements
  const mouvementData = [
    { mois: 'Février 2024', embauches: 3, departs: 2, total: 122, turnover: '1.6%' },
    { mois: 'Mars 2024', embauches: 1, departs: 3, total: 120, turnover: '2.5%' },
    { mois: 'Avril 2024', embauches: 4, departs: 2, total: 122, turnover: '1.7%' },
    { mois: 'Mai 2024', embauches: 5, departs: 2, total: 125, turnover: '1.6%' },
    { mois: 'Juin 2024', embauches: 3, departs: 2, total: 126, turnover: '1.6%' },
    { mois: 'Juillet 2024', embauches: 2, departs: 1, total: 127, turnover: '0.8%' }
  ];

  const COLORS_SEXE = ['#8884d8', '#FF8042'];
  const COLORS_CONTRAT = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition par âge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Nombre d'employés" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition par sexe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sexeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sexeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_SEXE[index % COLORS_SEXE.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Type de contrat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contratData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contratData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_CONTRAT[index % COLORS_CONTRAT.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Évolution des effectifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  name="Effectif total" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mouvements du personnel</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Période</TableHead>
                <TableHead>Embauches</TableHead>
                <TableHead>Départs</TableHead>
                <TableHead>Effectif total</TableHead>
                <TableHead>Taux de turnover</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mouvementData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.mois}</TableCell>
                  <TableCell className="text-green-600">{row.embauches}</TableCell>
                  <TableCell className="text-red-600">{row.departs}</TableCell>
                  <TableCell>{row.total}</TableCell>
                  <TableCell>{row.turnover}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EffectifsTab;
