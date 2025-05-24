
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
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MasseSalarialeTabProps {
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

const MasseSalarialeTab: React.FC<MasseSalarialeTabProps> = ({ period, filters }) => {
  // Génération de données pour la démonstration
  const generateEvolutionData = () => {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, i) => {
      const baseSalary = 1100000 + Math.random() * 200000; // Salaire de base fluctuant autour de 1.1M-1.3M MAD
      const growth = Math.min(1 + (i / 24), 1.15); // Croissance graduelle avec un maximum de 15%
      
      return {
        name: month,
        salaireBrut: Math.round(baseSalary * growth),
        salaireNet: Math.round(baseSalary * growth * 0.78), // ~78% du brut
        coutEmployeur: Math.round(baseSalary * growth * 1.15), // ~115% du brut
        active: i <= currentMonth
      };
    });
  };

  const repartitionCotisations = [
    { name: "CNSS", value: 18 },
    { name: "AMO", value: 7 },
    { name: "IR", value: 15 },
    { name: "CIMR", value: 5 }
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const evolutionData = generateEvolutionData();
  const departementData = [
    { name: "RH", salaire: 280000 },
    { name: "IT", salaire: 450000 },
    { name: "Finance", salaire: 320000 },
    { name: "Ventes", salaire: 220000 }
  ];

  const tableData = [
    { mois: "Septembre 2023", brut: 1240500, cotisations: 285315, ir: 186075, net: 769110, coutTotal: 1426575 },
    { mois: "Octobre 2023", brut: 1255200, cotisations: 288696, ir: 188280, net: 778224, coutTotal: 1443480 },
    { mois: "Novembre 2023", brut: 1275600, cotisations: 293388, ir: 191340, net: 790872, coutTotal: 1466940 },
    { mois: "Décembre 2023", brut: 1269400, cotisations: 291962, ir: 190410, coutTotal: 1459810, net: 787028 },
    { mois: "Janvier 2024", brut: 1282200, cotisations: 294906, ir: 192330, net: 794964, coutTotal: 1474530 }
  ];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Évolution de la masse salariale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="salaireBrut" 
                  name="Salaire Brut" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="salaireNet" 
                  name="Salaire Net" 
                  stroke="#82ca9d" 
                />
                <Line 
                  type="monotone" 
                  dataKey="coutEmployeur" 
                  name="Coût Employeur" 
                  stroke="#ffc658" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition par département</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Bar dataKey="salaire" name="Salaire brut" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition des cotisations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={repartitionCotisations}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {repartitionCotisations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Détail mensuel</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mois</TableHead>
                <TableHead>Brut</TableHead>
                <TableHead>Cotisations</TableHead>
                <TableHead>IR</TableHead>
                <TableHead>Net</TableHead>
                <TableHead>Coût total employeur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.mois}</TableCell>
                  <TableCell>{formatNumber(row.brut)}</TableCell>
                  <TableCell>{formatNumber(row.cotisations)}</TableCell>
                  <TableCell>{formatNumber(row.ir)}</TableCell>
                  <TableCell className="font-medium">{formatNumber(row.net)}</TableCell>
                  <TableCell>{formatNumber(row.coutTotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasseSalarialeTab;
