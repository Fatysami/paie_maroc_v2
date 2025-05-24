
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus, Download, Clock, FileDown, FileCog, ArrowLeft, ArrowRight, AlertTriangle, BarChart2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

import GenerationCFV from '@/components/employe/paie/bancaire/GenerationCFV';
import SuiviPaiements from '@/components/employe/paie/bancaire/SuiviPaiements';
import ComparaisonVirements from '@/components/employe/paie/bancaire/ComparaisonVirements';
import AssistantButton from '@/components/chatbot/AssistantButton';

const IntegrationBancaire = () => {
  const navigate = useNavigate();
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const handleNewFileClick = () => {
    setIsNewFileDialogOpen(true);
  };

  const handleCreateNewFile = () => {
    if (!selectedMonth || !selectedYear) {
      toast.error("Veuillez sélectionner un mois et une année");
      return;
    }

    // Close the dialog
    setIsNewFileDialogOpen(false);
    
    // Reset the tab to generation
    const tabsElement = document.querySelector('[data-state="active"][role="tab"]');
    if (tabsElement) {
      const generationTab = document.querySelector('[value="generation"][role="tab"]');
      if (generationTab) {
        (generationTab as HTMLElement).click();
      }
    }
    
    // Show success toast
    toast.success(`Nouveau fichier créé pour ${selectedMonth} ${selectedYear}`);
  };

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const years = ["2023", "2024", "2025", "2026"];

  const currentYear = new Date().getFullYear().toString();
  const currentMonth = months[new Date().getMonth()];

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intégration Bancaire</h1>
          <p className="text-muted-foreground mt-1">
            Génération des fichiers de virement et suivi des paiements
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => navigate("/preparation-paie")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour à la paie
          </Button>
          <Button onClick={handleNewFileClick}>
            <Plus className="h-4 w-4 mr-2" /> Nouveau fichier
          </Button>
        </div>
      </div>
      
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4 text-blue-700" />
        <AlertTitle className="text-blue-800">À savoir avant de commencer</AlertTitle>
        <AlertDescription className="text-blue-700">
          <p className="mb-2">
            Les fichiers de virement générés doivent être importés dans votre portail bancaire pour effectuer les paiements.
            Chaque banque a des exigences spécifiques concernant le format des fichiers.
          </p>
          <Button variant="link" className="p-0 h-auto text-blue-700 underline">
            Consulter la documentation bancaire <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="generation" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="grid grid-cols-3 w-[600px]">
            <TabsTrigger value="generation">
              <FileCog className="h-4 w-4 mr-2" /> Génération CFV
            </TabsTrigger>
            <TabsTrigger value="suivi">
              <Clock className="h-4 w-4 mr-2" /> Suivi des paiements
            </TabsTrigger>
            <TabsTrigger value="comparaison">
              <BarChart2 className="h-4 w-4 mr-2" /> Comparaison
            </TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-muted-foreground hidden md:block">
            Dernière génération: 30/05/2023 à 17:42
          </div>
        </div>
        
        <TabsContent value="generation" className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="col-span-1">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Formats supportés</h3>
                    <div className="text-sm grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span>CFV (Attijariwafa)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>CSV (Standard)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                        <span>TXT (Format texte)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                        <span>XML (SEPA)</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-1">Guides bancaires</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <FileDown className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Button variant="link" className="p-0 h-auto">
                          Guide Attijariwafa
                        </Button>
                      </div>
                      <div className="flex items-center text-sm">
                        <FileDown className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Button variant="link" className="p-0 h-auto">
                          Guide BMCE
                        </Button>
                      </div>
                      <div className="flex items-center text-sm">
                        <FileDown className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Button variant="link" className="p-0 h-auto">
                          Guide CIH Bank
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-1">Liens utiles</h3>
                    <div className="space-y-2 text-sm">
                      <Button variant="link" className="p-0 h-auto">
                        Portail Attijariwafa
                      </Button>
                      <div className="flex flex-col">
                        <Button variant="link" className="p-0 h-auto">
                          Portail BMCE Bank
                        </Button>
                      </div>
                      <Button variant="link" className="p-0 h-auto">
                        Portail CIH Bank
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="col-span-1 md:col-span-3">
              <GenerationCFV />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="suivi" className="pt-2">
          <SuiviPaiements />
        </TabsContent>
        
        <TabsContent value="comparaison" className="pt-2">
          <ComparaisonVirements />
        </TabsContent>
      </Tabs>
      
      {/* Dialog for creating a new file */}
      <Dialog open={isNewFileDialogOpen} onOpenChange={setIsNewFileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau fichier de virement</DialogTitle>
            <DialogDescription>
              Sélectionnez la période pour laquelle vous souhaitez générer un fichier de virement.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="month" className="text-sm font-medium">Mois</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Sélectionner un mois" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="year" className="text-sm font-medium">Année</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Sélectionner une année" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFileDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateNewFile}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add AI Assistant */}
      <AssistantButton />
    </div>
  );
};

export default IntegrationBancaire;
