
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import DeclarationExport from "@/components/employe/paie/declarations/DeclarationExport";

const Declarations = () => {
  const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' });
  const currentYear = new Date().getFullYear().toString();
  
  // Mock user data for the navbar
  const mockUser = {
    name: "Mohammed Alami",
    avatar: "/placeholder.svg",
    role: "Administrateur RH",
  };

  // Handle logout function
  const handleLogout = () => {
    // Here you would implement the actual logout logic
    // navigate("/connexion");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar user={mockUser} onLogout={handleLogout} />
      
      <main className="container mx-auto py-8 px-4 max-w-7xl pt-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Déclarations fiscales et sociales</h1>
          <p className="text-muted-foreground mt-2">
            Générez et suivez vos déclarations mensuelles CNSS, IR et CIMR
          </p>
        </div>

        <div className="space-y-6">
          <Alert className="bg-blue-50 text-blue-800 border-blue-200">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Rappel des dates limites</AlertTitle>
            <AlertDescription>
              CNSS (Damancom): avant le 10 du mois suivant<br />
              IR (Simpl-IR): avant le 30 du mois suivant<br />
              CIMR: avant le 15 du mois suivant
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="ir">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ir">IR (Simpl-IR)</TabsTrigger>
              <TabsTrigger value="cnss">CNSS (Damancom)</TabsTrigger>
              <TabsTrigger value="cimr">CIMR</TabsTrigger>
            </TabsList>

            <TabsContent value="ir">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Impôt sur le Revenu (IR)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Génération de la déclaration IR mensuelle au format CSV pour import dans Simpl-IR (DGI).
                    La déclaration inclut tous les employés ayant reçu un salaire pour la période sélectionnée.
                  </p>
                  <DeclarationExport type="IR" month={currentMonth} year={currentYear} />
                </CardContent>
              </Card>
              
              <h3 className="text-lg font-medium mb-2">Historique des déclarations IR</h3>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-2 text-left">Période</th>
                      <th className="p-2 text-left">Date de génération</th>
                      <th className="p-2 text-left">Total déclaré</th>
                      <th className="p-2 text-left">Statut</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t hover:bg-muted/50">
                      <td className="p-2">Avril 2023</td>
                      <td className="p-2">05/05/2023</td>
                      <td className="p-2">16 616,75 MAD</td>
                      <td className="p-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Envoyé
                        </span>
                      </td>
                      <td className="p-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm mr-2">
                          Télécharger
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Voir détail
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-muted/50">
                      <td className="p-2">Mars 2023</td>
                      <td className="p-2">04/04/2023</td>
                      <td className="p-2">15 890,25 MAD</td>
                      <td className="p-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Envoyé
                        </span>
                      </td>
                      <td className="p-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm mr-2">
                          Télécharger
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Voir détail
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="cnss">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Déclaration CNSS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Génération du fichier de déclaration CNSS au format CSV pour import dans la plateforme Damancom.
                    Les données incluent les salaires bruts déclarables et les jours travaillés.
                  </p>
                  <DeclarationExport type="CNSS" month={currentMonth} year={currentYear} />
                </CardContent>
              </Card>
              
              <h3 className="text-lg font-medium mb-2">Historique des déclarations CNSS</h3>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-2 text-left">Période</th>
                      <th className="p-2 text-left">Date de génération</th>
                      <th className="p-2 text-left">Montant cotisations</th>
                      <th className="p-2 text-left">Statut</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t hover:bg-muted/50">
                      <td className="p-2">Avril 2023</td>
                      <td className="p-2">07/05/2023</td>
                      <td className="p-2">9 548,90 MAD</td>
                      <td className="p-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Envoyé
                        </span>
                      </td>
                      <td className="p-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm mr-2">
                          Télécharger
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Voir détail
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-muted/50">
                      <td className="p-2">Mars 2023</td>
                      <td className="p-2">06/04/2023</td>
                      <td className="p-2">9 325,50 MAD</td>
                      <td className="p-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Envoyé
                        </span>
                      </td>
                      <td className="p-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm mr-2">
                          Télécharger
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Voir détail
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="cimr">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Déclaration CIMR</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Génération du fichier de déclaration CIMR (Caisse Interprofessionnelle Marocaine de Retraite) au format CSV.
                    Ce régime de retraite complémentaire est facultatif mais très répandu au Maroc.
                  </p>
                  <DeclarationExport type="CIMR" month={currentMonth} year={currentYear} />
                </CardContent>
              </Card>
              
              <h3 className="text-lg font-medium mb-2">Historique des déclarations CIMR</h3>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-2 text-left">Période</th>
                      <th className="p-2 text-left">Date de génération</th>
                      <th className="p-2 text-left">Cotisations employé</th>
                      <th className="p-2 text-left">Cotisations employeur</th>
                      <th className="p-2 text-left">Statut</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t hover:bg-muted/50">
                      <td className="p-2">Avril 2023</td>
                      <td className="p-2">12/05/2023</td>
                      <td className="p-2">3 045,00 MAD</td>
                      <td className="p-2">4 567,50 MAD</td>
                      <td className="p-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Envoyé
                        </span>
                      </td>
                      <td className="p-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm mr-2">
                          Télécharger
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Voir détail
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t hover:bg-muted/50">
                      <td className="p-2">Mars 2023</td>
                      <td className="p-2">14/04/2023</td>
                      <td className="p-2">3 045,00 MAD</td>
                      <td className="p-2">4 567,50 MAD</td>
                      <td className="p-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Envoyé
                        </span>
                      </td>
                      <td className="p-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm mr-2">
                          Télécharger
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Voir détail
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <InfoIcon className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Informations sur le régime CIMR</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      La CIMR est un régime de retraite complémentaire facultatif au Maroc. Les cotisations sont 
                      réparties entre l'employeur et le salarié, généralement à hauteur de 60% pour l'employeur 
                      et 40% pour le salarié. Les taux standard sont de 3% pour l'employé et 4,5% pour l'employeur, 
                      mais peuvent être ajustés dans les paramètres de paie.
                    </p>
                    <p className="text-sm text-amber-700 mt-2">
                      Les cotisations CIMR sont déclarées et versées mensuellement, avec une échéance fixée 
                      généralement au 15 du mois suivant.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Declarations;
