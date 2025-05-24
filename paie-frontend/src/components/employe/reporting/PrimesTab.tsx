
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

interface PrimesTabProps {
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

const PrimesTab: React.FC<PrimesTabProps> = ({ period, filters }) => {
  // Données pour la répartition des primes par type
  const typePrimes = [
    { name: 'Performance', value: 250000 },
    { name: 'Ancienneté', value: 125000 },
    { name: 'Transport', value: 95000 },
    { name: 'Représentation', value: 75000 },
    { name: 'Exceptionnelle', value: 65000 }
  ];

  // Données pour les primes par département
  const primesDepartement = [
    { departement: 'RH', montant: 85000 },
    { departement: 'IT', montant: 170000 },
    { departement: 'Finance', montant: 120000 },
    { departement: 'Ventes', montant: 145000 },
    { departement: 'Marketing', montant: 90000 }
  ];

  // Données pour l'évolution des primes
  const evolutionPrimes = [
    { mois: 'Jan', montant: 95000 },
    { mois: 'Fév', montant: 92000 },
    { mois: 'Mar', montant: 98000 },
    { mois: 'Avr', montant: 102000 },
    { mois: 'Mai', montant: 105000 },
    { mois: 'Juin', montant: 112000 },
    { mois: 'Juil', montant: 118000 }
  ];

  // Données pour le tableau des top primes
  const topPrimes = [
    { employe: 'Samir El Amrani', poste: 'Directeur Commercial', type: 'Performance', montant: 18000 },
    { employe: 'Nadia Belkacem', poste: 'Développeur Senior', type: 'Performance', montant: 12000 },
    { employe: 'Hassan Tazi', poste: 'Chef Comptable', type: 'Ancienneté', montant: 9500 },
    { employe: 'Laila Chahid', poste: 'Responsable Marketing', type: 'Performance', montant: 8500 },
    { employe: 'Omar Bensouda', poste: 'Architecte Logiciel', type: 'Exceptionnelle', montant: 7500 }
  ];

  const COLORS_TYPE = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition des primes par type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typePrimes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typePrimes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_TYPE[index % COLORS_TYPE.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Primes par département</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={primesDepartement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="departement" />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Bar dataKey="montant" name="Montant total" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Évolution des primes versées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionPrimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="montant" 
                  name="Montant total des primes" 
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
          <CardTitle className="text-lg">Top 5 des primes individuelles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Type de prime</TableHead>
                <TableHead>Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPrimes.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.employe}</TableCell>
                  <TableCell>{row.poste}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{formatNumber(row.montant)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrimesTab;
