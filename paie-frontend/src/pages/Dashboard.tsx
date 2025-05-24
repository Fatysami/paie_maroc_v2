
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, FileText, DollarSign, Calendar, BellRing, 
  PlusCircle, FileUp, FileDown, CreditCard, LogOut,
  Clock, AlertTriangle, CheckCircle, BarChart3, PieChart
} from "lucide-react";

import Navbar from "@/components/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartPieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const areaData = [
  { name: "Jan", amount: 2400 },
  { name: "Fév", amount: 1398 },
  { name: "Mar", amount: 9800 },
  { name: "Avr", amount: 3908 },
  { name: "Mai", amount: 4800 },
  { name: "Juin", amount: 3800 },
  { name: "Juil", amount: 4300 },
];

const barData = [
  { name: "Jan", total: 1200 },
  { name: "Fév", total: 900 },
  { name: "Mar", total: 1600 },
  { name: "Avr", total: 1300 },
  { name: "Mai", total: 1800 },
  { name: "Juin", total: 1400 },
  { name: "Juil", total: 1700 },
];

const pieData = [
  { name: "Salaires", value: 70 },
  { name: "Charges", value: 20 },
  { name: "Divers", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

type UserRole = "admin" | "employee";

// Marquer comme literal type avec "as const" pour que TypeScript puisse faire la comparaison correctement
const ROLE = "admin" as UserRole; // ou "employee" comme UserRole pour tester différentes vues
const USER = {
  name: "Mohammed Alami",
  avatar: "/placeholder.svg",
  role: ROLE === "admin" ? "Administrateur RH" : "Employé",
  subscriptionStatus: "active", // active, pending, expired
  renewalDate: "30/09/2023",
  employeesCount: 24,
  lastPayslip: "Août 2023",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("overview");
  
  const handleLogout = () => {
    console.log("Déconnexion en cours...");
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  const handleManageSubscription = () => {
    console.log("Gestion de l'abonnement");
    toast.info("Redirection vers la gestion de l'abonnement");
    navigate("/parametres");
  };

  const handleAddEmployee = () => {
    toast.info("Redirection vers la gestion des employés");
    navigate("/employes");
  };

  const handleGeneratePay = () => {
    toast.info("Redirection vers la génération des bulletins");
    navigate("/generation-bulletins");
  };

  const handleDeclareCharges = () => {
    toast.info("Redirection vers les déclarations");
    navigate("/declarations");
  };

  const handleDownloadPayslip = () => {
    if (ROLE === "employee") {
      toast.info("Téléchargement du bulletin de paie");
      // In a real app, we would trigger a download here
      toast.success("Bulletin téléchargé avec succès", { duration: 3000 });
    } else if (ROLE === "admin") {
      navigate("/espace-employe/bulletins");
    }
  };

  const handleRequestLeave = () => {
    if (ROLE === "employee") {
      navigate("/espace-employe/conges");
    } else if (ROLE === "admin") {
      navigate("/conges");
    }
  };

  const handleViewSalaryHistory = () => {
    if (ROLE === "employee") {
      navigate("/espace-employe/bulletins");
    } else if (ROLE === "admin") {
      navigate("/historique");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "expired":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "pending":
        return "En attente";
      case "expired":
        return "Expiré";
      default:
        return "Inconnu";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        user={USER} 
        onLogout={handleLogout} 
      />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-primary">Bienvenue, {USER.name}</h1>
              <p className="text-muted-foreground">
                {USER.role} | Abonnement: <span className="inline-flex items-center">
                  <span className={`h-2.5 w-2.5 rounded-full mr-2 ${getStatusColor(USER.subscriptionStatus)}`}></span>
                  {getStatusText(USER.subscriptionStatus)}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
                <LogOut size={16} />
                Déconnexion
              </Button>
              <Button onClick={handleManageSubscription} className="bg-blue-primary hover:bg-blue-primary/90">
                {ROLE === "admin" ? "Gérer l'abonnement" : "Voir mon profil"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full" onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="overview">Vue Générale</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="activity">Activités Récentes</TabsTrigger>
              <TabsTrigger value="actions">Actions Rapides</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {ROLE === "admin" ? "Employés Actifs" : "Statut du Compte"}
                    </CardTitle>
                    {ROLE === "admin" ? <Users className="h-4 w-4 text-muted-foreground" /> : 
                      <CheckCircle className="h-4 w-4 text-green-500" />}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {ROLE === "admin" ? USER.employeesCount : "Compte Actif"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {ROLE === "admin" 
                        ? "+2 ce mois-ci" 
                        : "Votre compte est à jour"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {ROLE === "admin" ? "Bulletins ce mois" : "Dernier Bulletin"}
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {ROLE === "admin" ? "24" : USER.lastPayslip}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {ROLE === "admin" 
                        ? "Sur 24 employés" 
                        : "Téléchargeable"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {ROLE === "admin" ? "Total des Salaires" : "Salaire Net"}
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {ROLE === "admin" ? "145,200 DH" : "12,500 DH"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {ROLE === "admin" 
                        ? "Pour ce mois" 
                        : "Pour Août 2023"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {ROLE === "admin" ? "Prochaine Déclaration" : "Congés Restants"}
                    </CardTitle>
                    {ROLE === "admin" ? 
                      <Clock className="h-4 w-4 text-muted-foreground" /> : 
                      <Calendar className="h-4 w-4 text-muted-foreground" />}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {ROLE === "admin" ? "15/09/2023" : "18 jours"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {ROLE === "admin" 
                        ? "CNSS Trimestre 3" 
                        : "Sur 21 jours annuels"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Statut de l'Abonnement</CardTitle>
                  <CardDescription>
                    {USER.subscriptionStatus === "active" 
                      ? `Votre abonnement est actif jusqu'au ${USER.renewalDate}` 
                      : USER.subscriptionStatus === "pending" 
                        ? "Votre paiement est en cours de traitement" 
                        : "Votre abonnement a expiré, veuillez le renouveler"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`h-3 w-3 rounded-full ${getStatusColor(USER.subscriptionStatus)}`}></span>
                        <span className="text-sm font-medium">
                          {getStatusText(USER.subscriptionStatus)}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Renouvellement: {USER.renewalDate}
                      </span>
                    </div>
                    <Progress value={USER.subscriptionStatus === "active" ? 70 : USER.subscriptionStatus === "pending" ? 50 : 10} 
                      className={USER.subscriptionStatus === "active" ? "bg-green-100" : USER.subscriptionStatus === "pending" ? "bg-yellow-100" : "bg-red-100"} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleManageSubscription}
                  >
                    {USER.subscriptionStatus === "active" 
                      ? "Gérer l'abonnement" 
                      : USER.subscriptionStatus === "pending" 
                        ? "Vérifier le statut" 
                        : "Renouveler maintenant"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {ROLE === "admin" ? "Évolution des Salaires" : "Historique de Salaire"}
                    </CardTitle>
                    <CardDescription>
                      {ROLE === "admin" ? "Total mensuel des salaires versés" : "Évolution de votre salaire"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={areaData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="amount" stroke="#1E3A8A" fill="#93C5FD" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {ROLE === "admin" ? "Bulletins Générés" : "Jours Travaillés"}
                    </CardTitle>
                    <CardDescription>
                      {ROLE === "admin" ? "Nombre de bulletins de paie par mois" : "Nombre de jours travaillés par mois"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="total" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {ROLE === "admin" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition des Coûts</CardTitle>
                    <CardDescription>Distribution des charges salariales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartPieChart>
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
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activités Récentes</CardTitle>
                  <CardDescription>
                    {ROLE === "admin" 
                      ? "Dernières actions effectuées sur la plateforme" 
                      : "Vos dernières activités"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Détails</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ROLE === "admin" ? (
                        <>
                          <TableRow>
                            <TableCell>15/08/2023</TableCell>
                            <TableCell>Génération de bulletins</TableCell>
                            <TableCell>24 bulletins générés</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100 text-green-800">Complété</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>10/08/2023</TableCell>
                            <TableCell>Ajout d'employé</TableCell>
                            <TableCell>Ahmed Bennani</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100 text-green-800">Complété</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>05/08/2023</TableCell>
                            <TableCell>Déclaration CNSS</TableCell>
                            <TableCell>Trimestre 2, 2023</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100 text-green-800">Complété</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>01/08/2023</TableCell>
                            <TableCell>Renouvellement abonnement</TableCell>
                            <TableCell>Plan Premium</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100 text-green-800">Complété</Badge>
                            </TableCell>
                          </TableRow>
                        </>
                      ) : (
                        <>
                          <TableRow>
                            <TableCell>20/08/2023</TableCell>
                            <TableCell>Téléchargement bulletin</TableCell>
                            <TableCell>Bulletin Août 2023</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100 text-green-800">Complété</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>15/08/2023</TableCell>
                            <TableCell>Demande de congé</TableCell>
                            <TableCell>1 au 15 septembre</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>10/08/2023</TableCell>
                            <TableCell>Mise à jour profil</TableCell>
                            <TableCell>Changement adresse</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100 text-green-800">Complété</Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>01/08/2023</TableCell>
                            <TableCell>Connexion</TableCell>
                            <TableCell>Nouvel appareil</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100 text-green-800">Complété</Badge>
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Voir toutes les activités</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ROLE === "admin" ? (
                  <>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PlusCircle className="h-5 w-5 text-blue-primary" />
                          Ajouter un employé
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Créer un nouveau compte employé et configurer son profil.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full bg-blue-primary hover:bg-blue-primary/90"
                          onClick={handleAddEmployee}
                        >
                          Commencer
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileUp className="h-5 w-5 text-blue-primary" />
                          Générer les bulletins
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Créer les bulletins de paie pour le mois en cours.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full bg-blue-primary hover:bg-blue-primary/90"
                          onClick={handleGeneratePay}
                        >
                          Générer
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-primary" />
                          Déclarer charges sociales
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Préparer et soumettre les déclarations sociales et fiscales.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full bg-blue-primary hover:bg-blue-primary/90"
                          onClick={handleDeclareCharges}
                        >
                          Déclarer
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-blue-primary" />
                          Gérer l'abonnement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Consulter, modifier ou renouveler votre abonnement.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full bg-blue-primary hover:bg-blue-primary/90"
                          onClick={handleManageSubscription}
                        >
                          Gérer
                        </Button>
                      </CardFooter>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileDown className="h-5 w-5 text-blue-primary" />
                          Télécharger bulletin
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Télécharger votre dernier bulletin de paie.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full bg-blue-primary hover:bg-blue-primary/90"
                          onClick={handleDownloadPayslip}
                        >
                          Télécharger
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-primary" />
                          Demander un congé
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Soumettre une nouvelle demande de congé.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full bg-blue-primary hover:bg-blue-primary/90"
                          onClick={handleRequestLeave}
                        >
                          Demander
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-primary" />
                          Historique des salaires
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Consulter l'historique de vos bulletins de paie.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full bg-blue-primary hover:bg-blue-primary/90"
                          onClick={handleViewSalaryHistory}
                        >
                          Consulter
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-blue-primary" />
                          Gérer mon compte
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Consulter et modifier vos informations personnelles.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full bg-blue-primary hover:bg-blue-primary/90"
                          onClick={() => navigate("/espace-employe/profil")}
                        >
                          Gérer
                        </Button>
                      </CardFooter>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
