
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download, Eye, Mail, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Import refactored components
import BulletinSummaryCards from "./BulletinSummaryCards";
import BulletinSalaryTable from "./BulletinSalaryTable";
import BulletinPrintView from "./BulletinPrintView";
import BulletinPreview from "./BulletinPreview";

// Import types and utilities
import { BulletinDetailProps, BulletinData, BulletinElement } from "./types/bulletinTypes";
import { calculateTotalCotisations, getTypeElementColor, getStatutBadgeClass } from "./utils/bulletinUtils";

const BulletinDetail = ({ bulletin }: BulletinDetailProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [printMode, setPrintMode] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Simuler un bulletin si non fourni
  const defaultBulletin: BulletinData = {
    id: "1",
    mois: "Mai",
    annee: "2023",
    employeId: "1",
    dateGeneration: "31/05/2023",
    datePaiement: "02/06/2023",
    montantBrut: 12500,
    montantNet: 9875.45,
    statut: "payé",
    elements: [
      { type: "salaire", nom: "Salaire de base", montant: 10000, tauxOuQuantite: 1 },
      { type: "prime", nom: "Prime de transport", montant: 800, tauxOuQuantite: 1 },
      { type: "prime", nom: "Prime d'ancienneté", montant: 500, tauxOuQuantite: 5 },
      { type: "prime", nom: "Prime de rendement", montant: 1200, tauxOuQuantite: 1 },
      { type: "retenue", nom: "Avance sur salaire", montant: -1000, tauxOuQuantite: 1 },
      { type: "cotisation", nom: "CNSS", montant: -448, tauxOuQuantite: 4.48 },
      { type: "cotisation", nom: "AMO", montant: -226, tauxOuQuantite: 2.26 },
      { type: "cotisation", nom: "IR", montant: -950.55, tauxOuQuantite: 1 },
    ],
  };

  const bulletinData = bulletin || defaultBulletin;

  const handleEnvoiEmail = () => {
    // Logique pour envoyer par email
    toast({
      title: "Envoi en cours",
      description: "Le bulletin est en cours d'envoi par email..."
    });
    console.log("Envoi du bulletin par email");
  };

  const handleTelechargement = () => {
    // Logique pour télécharger le PDF
    toast({
      title: "Téléchargement en cours",
      description: "Le bulletin est en cours de téléchargement..."
    });
    console.log("Téléchargement du bulletin");
  };

  // Utiliser useEffect pour détecter quand printMode change et déclencher l'impression
  useEffect(() => {
    if (printMode) {
      // Attendez que le DOM soit mis à jour avant d'imprimer
      const timer = setTimeout(() => {
        window.print();
        // Réinitialisez l'état après l'impression
        setPrintMode(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [printMode]);

  const handlePrintPreview = () => {
    console.log("Impression demandée");
    // Activer le mode impression, l'useEffect se chargera de lancer l'impression
    setPrintMode(true);
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "payé":
        return <Badge className="bg-green-500">Payé</Badge>;
      case "en attente":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">En attente</Badge>;
      case "erreur":
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  if (printMode) {
    return (
      <BulletinPrintView 
        bulletinData={bulletinData} 
        onClose={() => setPrintMode(false)} 
        printRef={printRef} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {!showPreview ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Bulletin de Paie - {bulletinData.mois} {bulletinData.annee}</CardTitle>
              <div className="text-sm text-muted-foreground mt-1">
                Généré le {bulletinData.dateGeneration} • Payé le {bulletinData.datePaiement}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatutBadge(bulletinData.statut)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <BulletinSummaryCards 
              montantBrut={bulletinData.montantBrut}
              montantNet={bulletinData.montantNet}
              calculateTotalCotisations={() => calculateTotalCotisations(bulletinData.elements)}
            />

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Détail des éléments de paie</h3>
              <BulletinSalaryTable 
                elements={bulletinData.elements}
                montantNet={bulletinData.montantNet}
                montantBrut={bulletinData.montantBrut}
                calculateTotalCotisations={() => calculateTotalCotisations(bulletinData.elements)}
              />
            </div>

            <Alert className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Mentions légales</AlertTitle>
              <AlertDescription>
                Conformément à l'article 370 du Code du travail marocain. Ce bulletin de paie doit être conservé sans limitation de durée.
              </AlertDescription>
            </Alert>

          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="mr-2 h-4 w-4" /> Aperçu PDF
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrintPreview}>
                <Printer className="mr-2 h-4 w-4" /> Imprimer
              </Button>
              <Button variant="outline" onClick={handleEnvoiEmail}>
                <Mail className="mr-2 h-4 w-4" /> Envoyer par e-mail
              </Button>
              <Button onClick={handleTelechargement}>
                <Download className="mr-2 h-4 w-4" /> Télécharger PDF
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <BulletinPreview 
          bulletinData={bulletinData}
          onClose={() => setShowPreview(false)}
          onPrint={handlePrintPreview}
          onDownload={handleTelechargement}
        />
      )}

      <style>
        {`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container,
          .print-container * {
            visibility: visible;
          }
          .print-only,
          .print-only * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print:hidden {
            display: none !important;
          }
        }
      `}
      </style>
    </div>
  );
};

export default BulletinDetail;
