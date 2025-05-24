
import React, { useState } from "react";
import EmployeLayout from "@/components/employe/EmployeLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  FileText, 
  DollarSign, 
  Clock, 
  Star, 
  FileCheck,
  BarChart4,
  Target,
  GraduationCap,
  Users,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import BulletinDetail from "@/components/employe/paie/BulletinDetail";
import { BulletinData } from "@/components/employe/paie/types/bulletinTypes";
import { useToast } from "@/hooks/use-toast";

const TableauDeBordEmploye = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Simulation du bulletin du mois courant
  const bulletinDuMois: BulletinData = {
    id: "1",
    mois: "Mai",
    annee: "2023",
    employeId: "emp-001",
    montantBrut: 12500,
    montantNet: 9875.45,
    dateGeneration: "31/05/2023",
    datePaiement: "02/06/2023",
    statut: "payé",
    elements: [
      { type: "salaire", nom: "Salaire de base", montant: 12500 },
      { type: "cotisation", nom: "CNSS", montant: 450, tauxOuQuantite: 3.6 },
      { type: "cotisation", nom: "AMO", montant: 250, tauxOuQuantite: 2.0 },
      { type: "cotisation", nom: "IR", montant: 1924.55, tauxOuQuantite: 15.4 }
    ]
  };

  const handleViewCurrentMonthBulletin = () => {
    setIsDialogOpen(true);
  };

  const handleNavigateToAllBulletins = () => {
    navigate("/espace-employe/bulletins");
  };

  const handleDownloadBulletin = () => {
    toast({
      title: "Téléchargement en cours",
      description: "Le bulletin de paie est en cours de téléchargement..."
    });
    
    setTimeout(() => {
      toast({
        title: "Téléchargement terminé",
        description: "Le bulletin de paie a été téléchargé avec succès."
      });
    }, 1500);
  };

  return (
    <EmployeLayout title="Tableau de bord">
      <div className="space-y-8">
        {/* Bannière de bienvenue */}
        <div className="p-6 bg-blue-50 rounded-xl dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-semibold mb-2">Bonjour, Mohamed 👋</h2>
          <p className="text-muted-foreground mb-4">Voici un aperçu de vos informations professionnelles</p>
          <div className="flex flex-wrap gap-6 mt-4">
            <Button 
              className="bg-blue-primary text-white hover:bg-blue-primary/80"
              onClick={handleViewCurrentMonthBulletin}
            >
              <FileText className="mr-2 h-4 w-4" /> Voir bulletin du mois
            </Button>
            <Button variant="outline" onClick={() => navigate("/espace-employe/conges")}>
              <Calendar className="mr-2 h-4 w-4" /> Demander un congé
            </Button>
          </div>
        </div>

        {/* Statistiques progression et objectifs */}
        <div>
          <h3 className="text-lg font-medium mb-4">Objectifs et performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Objectifs trimestriels</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Dossiers traités</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Qualité du service</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Satisfaction client</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Compétences</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Technique</span>
                      <span className="font-medium">4.5/5</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Communication</span>
                      <span className="font-medium">4.2/5</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Travail d'équipe</span>
                      <span className="font-medium">4.8/5</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Évolution de carrière</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12%</div>
                <p className="text-xs text-muted-foreground mb-2">Progression annuelle</p>
                <div className="flex items-center mt-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>En avance sur les objectifs</span>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Prochaine évaluation: <span className="font-medium">15 juillet 2023</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Informations principales */}
        <div>
          <h3 className="text-lg font-medium mb-4">Résumé personnel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Salaire Net</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7 800 MAD</div>
                <p className="text-xs text-muted-foreground mt-1">Dernier paiement: 28/05/2023</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Jours de Congés</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 jours</div>
                <p className="text-xs text-muted-foreground mt-1">Sur 26 jours annuels</p>
                <Progress value={46} className="h-2 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Évaluation</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Très Bien</div>
                <p className="text-xs text-muted-foreground mt-1">Dernière évaluation: Avril 2023</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Heures Travaillées</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">160h / mois</div>
                <p className="text-xs text-muted-foreground mt-1">Temps plein (8h/jour)</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistiques de présence */}
        <div>
          <h3 className="text-lg font-medium mb-4">Présence et assiduité</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Taux de présence</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">97.2%</div>
                <Progress value={97.2} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">Excellente assiduité ce trimestre</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ponctualité</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">95.8%</div>
                <Progress value={95.8} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">2 retards ce mois-ci</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Heures supplémentaires</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8h</div>
                <p className="text-xs text-muted-foreground mt-2">Ce mois-ci</p>
                <div className="mt-3 text-sm">
                  <span className="font-medium">4h</span> récupérées
                  <span className="font-medium ml-3">4h</span> payées
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Formations */}
        <div>
          <h3 className="text-lg font-medium mb-4">Formations et développement</h3>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Parcours de formation</CardTitle>
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>Vos formations récentes et à venir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 border rounded-md hover:bg-accent">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Excel avancé</p>
                      <p className="text-sm text-muted-foreground">Terminé le 15/04/2023</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Complété</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md hover:bg-accent">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Management d'équipe</p>
                      <p className="text-sm text-muted-foreground">Du 20/06/2023 au 25/06/2023</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">À venir</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md hover:bg-accent">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Communication efficace</p>
                      <p className="text-sm text-muted-foreground">Proposé pour Septembre 2023</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Recommandé</Badge>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <GraduationCap className="mr-2 h-4 w-4" /> Voir toutes les formations
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Section Activités Récentes et Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Activités Récentes</CardTitle>
              <CardDescription>Vos dernières actions et événements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { icon: FileText, date: "10 juin 2023", action: "Bulletin de paie de Mai 2023 disponible" },
                  { icon: Calendar, date: "05 juin 2023", action: "Demande de congé acceptée (20-24 juin 2023)" },
                  { icon: FileCheck, date: "01 juin 2023", action: "Attestation de travail générée" },
                  { icon: BarChart4, date: "15 mai 2023", action: "Évaluation trimestrielle complétée" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Documents Récents</CardTitle>
              <CardDescription>Vos derniers documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Bulletin Mai 2023", type: "PDF", date: "31/05/2023" },
                  { name: "Attestation de travail", type: "PDF", date: "01/06/2023" },
                  { name: "Contrat de travail", type: "PDF", date: "01/01/2023" },
                  { name: "Réglement intérieur", type: "PDF", date: "01/01/2023" }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.date}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-secondary px-2 py-1 rounded-md">{doc.type}</span>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4" onClick={handleNavigateToAllBulletins}>
                Tous les documents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal pour afficher le bulletin */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Bulletin de paie - {bulletinDuMois.mois} {bulletinDuMois.annee}</DialogTitle>
            <DialogDescription>
              Vous pouvez visualiser, télécharger ou imprimer ce bulletin
            </DialogDescription>
          </DialogHeader>
          <BulletinDetail bulletin={bulletinDuMois} />
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Fermer
            </Button>
            <Button variant="outline" onClick={handleDownloadBulletin}>
              <FileText className="mr-2 h-4 w-4" /> Télécharger PDF
            </Button>
            <Button onClick={handleNavigateToAllBulletins}>
              Voir tous les bulletins
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </EmployeLayout>
  );
};

export default TableauDeBordEmploye;
