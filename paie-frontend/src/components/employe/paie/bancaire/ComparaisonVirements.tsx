
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Download, Filter, ArrowUpDown, FileDown, Info } from 'lucide-react';

type ComparisonData = {
  employe: string;
  matricule: string;
  brutBulletin: number;
  netBulletin: number;
  montantVirement: number;
  ecart: number;
  statut: 'cohérent' | 'incohérent' | 'non_payé';
};

const ComparaisonVirements = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("Mai");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [viewMode, setViewMode] = useState<string>("table");
  
  // Mock data for comparison
  const comparisonData: ComparisonData[] = [
    { 
      employe: "SALMA EL KADIRI", 
      matricule: "EMP-2023-014", 
      brutBulletin: 15400.00, 
      netBulletin: 10754.25, 
      montantVirement: 10754.25, 
      ecart: 0, 
      statut: 'cohérent' 
    },
    { 
      employe: "MOHAMED TAZI", 
      matricule: "EMP-2023-015", 
      brutBulletin: 18750.00, 
      netBulletin: 13250.50, 
      montantVirement: 13250.50, 
      ecart: 0, 
      statut: 'cohérent' 
    },
    { 
      employe: "YASMINE RADI", 
      matricule: "EMP-2023-018", 
      brutBulletin: 21000.00, 
      netBulletin: 14800.75, 
      montantVirement: 14600.00, 
      ecart: 200.75, 
      statut: 'incohérent' 
    },
    { 
      employe: "KARIM ALAOUI", 
      matricule: "EMP-2023-020", 
      brutBulletin: 12800.00, 
      netBulletin: 9450.20, 
      montantVirement: 0, 
      ecart: 9450.20, 
      statut: 'non_payé' 
    },
    { 
      employe: "LAILA BENNIS", 
      matricule: "EMP-2023-021", 
      brutBulletin: 16200.00, 
      netBulletin: 11450.80, 
      montantVirement: 11450.80, 
      ecart: 0, 
      statut: 'cohérent' 
    }
  ];

  // Compute summary data for charts
  const statusCount = comparisonData.reduce((acc, curr) => {
    acc[curr.statut] = (acc[curr.statut] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    { name: 'Cohérent', value: statusCount['cohérent'] || 0, color: '#10b981' },
    { name: 'Incohérent', value: statusCount['incohérent'] || 0, color: '#f59e0b' },
    { name: 'Non payé', value: statusCount['non_payé'] || 0, color: '#ef4444' }
  ];

  const barData = [
    { name: 'Total Brut', value: comparisonData.reduce((sum, item) => sum + item.brutBulletin, 0) },
    { name: 'Total Net', value: comparisonData.reduce((sum, item) => sum + item.netBulletin, 0) },
    { name: 'Total Virements', value: comparisonData.reduce((sum, item) => sum + item.montantVirement, 0) },
    { name: 'Écart', value: comparisonData.reduce((sum, item) => sum + item.ecart, 0) }
  ];

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const years = ["2023", "2024", "2025", "2026"];

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', { 
      style: 'currency', 
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="month-select" className="text-sm font-medium">Mois:</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger id="month-select" className="w-[140px]">
                <SelectValue placeholder="Sélectionnez un mois" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="year-select" className="text-sm font-medium">Année:</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="year-select" className="w-[120px]">
                <SelectValue placeholder="Sélectionnez une année" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" /> Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Exporter
          </Button>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-700" />
        <AlertDescription className="text-blue-700">
          Cet outil compare les montants des bulletins de paie avec les virements bancaires générés pour détecter les écarts potentiels.
        </AlertDescription>
      </Alert>

      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="table">Tableau</TabsTrigger>
          <TabsTrigger value="summary">Récapitulatif</TabsTrigger>
          <TabsTrigger value="charts">Graphiques</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Comparaison Paie / Virements - {selectedMonth} {selectedYear}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Employé</TableHead>
                      <TableHead className="w-[100px]">Matricule</TableHead>
                      <TableHead className="text-right">Brut Bulletin</TableHead>
                      <TableHead className="text-right">Net Bulletin</TableHead>
                      <TableHead className="text-right">Montant Virement</TableHead>
                      <TableHead className="text-right">Écart</TableHead>
                      <TableHead className="text-center">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisonData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.employe}</TableCell>
                        <TableCell>{item.matricule}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.brutBulletin)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.netBulletin)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.montantVirement)}</TableCell>
                        <TableCell className={`text-right font-medium ${item.ecart > 0 ? 'text-red-500' : ''}`}>
                          {formatCurrency(item.ecart)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${item.statut === 'cohérent' ? 'bg-green-100 text-green-800' : 
                              item.statut === 'incohérent' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                            {item.statut === 'cohérent' ? 'Cohérent' : 
                             item.statut === 'incohérent' ? 'Incohérent' : 'Non payé'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="pt-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Récapitulatif des virements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-green-50 p-4">
                      <p className="text-sm text-green-800 font-medium">Total Brut</p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(comparisonData.reduce((sum, item) => sum + item.brutBulletin, 0))}
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="text-sm text-blue-800 font-medium">Total Net</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(comparisonData.reduce((sum, item) => sum + item.netBulletin, 0))}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-purple-50 p-4">
                      <p className="text-sm text-purple-800 font-medium">Total Virements</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {formatCurrency(comparisonData.reduce((sum, item) => sum + item.montantVirement, 0))}
                      </p>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-4">
                      <p className="text-sm text-amber-800 font-medium">Écart Total</p>
                      <p className="text-2xl font-bold text-amber-900">
                        {formatCurrency(comparisonData.reduce((sum, item) => sum + item.ecart, 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statut des paiements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
                      <span className="text-xl font-bold text-green-700">
                        {statusCount['cohérent'] || 0}
                      </span>
                      <span className="text-xs text-green-600">Cohérents</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-amber-50 rounded-lg">
                      <span className="text-xl font-bold text-amber-700">
                        {statusCount['incohérent'] || 0}
                      </span>
                      <span className="text-xs text-amber-600">Incohérents</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-red-50 rounded-lg">
                      <span className="text-xl font-bold text-red-700">
                        {statusCount['non_payé'] || 0}
                      </span>
                      <span className="text-xs text-red-600">Non payés</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">Taux de cohérence</h4>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-medium inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-100">
                            {Math.round((statusCount['cohérent'] || 0) / comparisonData.length * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div style={{ width: `${(statusCount['cohérent'] || 0) / comparisonData.length * 100}%` }} 
                             className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="pt-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribution des statuts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} employé(s)`, 'Nombre']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comparaison des montants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Montant']} />
                      <Bar dataKey="value" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComparaisonVirements;
