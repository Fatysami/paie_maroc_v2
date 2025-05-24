
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

interface AbsencesTabProps {
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

const AbsencesTab: React.FC<AbsencesTabProps> = ({ period, filters }) => {
  // Données pour les absences par département
  const absencesDepartement = [
    { departement: 'RH', jours: 12 },
    { departement: 'IT', jours: 18 },
    { departement: 'Finance', jours: 8 },
    { departement: 'Ventes', jours: 22 },
    { departement: 'Marketing', jours: 15 },
    { departement: 'Opérations', jours: 28 }
  ];

  // Données pour le type d'absences
  const typeAbsences = [
    { name: 'Maladie', value: 45 },
    { name: 'Congés payés', value: 102 },
    { name: 'Congés sans solde', value: 12 },
    { name: 'Formation', value: 18 },
    { name: 'Autre', value: 8 }
  ];

  // Données pour l'évolution du taux d'absentéisme
  const evolutionAbsenteisme = [
    { mois: 'Jan', taux: 3.2 },
    { mois: 'Fév', taux: 3.8 },
    { mois: 'Mar', taux: 4.1 },
    { mois: 'Avr', taux: 3.5 },
    { mois: 'Mai', taux: 4.2 },
    { mois: 'Juin', taux: 4.5 },
    { mois: 'Juil', taux: 4.7 }
  ];

  // Données pour le statut des demandes de congés
  const statutConges = [
    { name: 'Approuvés', value: 85 },
    { name: 'En attente', value: 10 },
    { name: 'Refusés', value: 5 }
  ];

  // Données pour le tableau des top absences
  const topAbsences = [
    { employe: 'Mohammed Alami', service: 'Ventes', jours: 12, motif: 'Maladie' },
    { employe: 'Fatima Benali', service: 'IT', jours: 8, motif: 'Congé sans solde' },
    { employe: 'Karim Idrissi', service: 'Opérations', jours: 7, motif: 'Maladie' },
    { employe: 'Samira El Ouafi', service: 'Marketing', jours: 6, motif: 'Formation' },
    { employe: 'Youssef Berrada', service: 'RH', jours: 5, motif: 'Maladie' }
  ];

  const COLORS_TYPE = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const COLORS_STATUT = ['#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Absences par département</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={absencesDepartement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="departement" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="jours" name="Jours d'absence" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Type d'absences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeAbsences}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeAbsences.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_TYPE[index % COLORS_TYPE.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} jours`, 'Nombre de jours']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Évolution du taux d'absentéisme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionAbsenteisme}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis domain={[0, 8]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Taux d\'absentéisme']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="taux" 
                    name="Taux d'absentéisme" 
                    stroke="#FF8042" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statut des demandes de congés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statutConges}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statutConges.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_STATUT[index % COLORS_STATUT.length]} />
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
          <CardTitle className="text-lg">Top 5 des employés avec le plus d'absences</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Jours d'absence</TableHead>
                <TableHead>Motif principal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topAbsences.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.employe}</TableCell>
                  <TableCell>{row.service}</TableCell>
                  <TableCell>{row.jours}</TableCell>
                  <TableCell>{row.motif}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AbsencesTab;
