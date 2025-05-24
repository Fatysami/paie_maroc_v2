
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, Eye, Check, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { 
  generateIRDeclarationData, 
  generateCNSSDeclarationData, 
  generateCIMRDeclarationData, 
  exportToCSV 
} from "../utils/declarationUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";

type DeclarationExportProps = {
  type: "IR" | "CNSS" | "CIMR";
  month?: string;
  year?: string;
};

const DeclarationExport = ({ type, month = new Date().toLocaleString('fr-FR', { month: 'long' }), year = new Date().getFullYear().toString() }: DeclarationExportProps) => {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [exportStatus, setExportStatus] = useState<"idle" | "preview" | "exported" | "sent">("idle");
  const [declarationData, setDeclarationData] = useState<any[]>([]);
  const { toast } = useToast();

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  
  const years = ["2023", "2024", "2025"];
  
  const getDeclarationTitle = () => {
    switch (type) {
      case "IR":
        return "Déclaration IR (Simpl-IR)";
      case "CNSS":
        return "Déclaration CNSS (Damancom)";
      case "CIMR":
        return "Déclaration CIMR";
      default:
        return "Déclaration";
    }
  };

  const getDeclarationDescription = () => {
    switch (type) {
      case "IR":
        return "Impôt sur le revenu mensuel à déclarer via Simpl-IR";
      case "CNSS":
        return "Cotisations sociales mensuelles à déclarer via Damancom";
      case "CIMR":
        return "Cotisations de retraite complémentaire";
      default:
        return "";
    }
  };

  const handleGenerateDeclaration = () => {
    let data;
    if (type === "IR") {
      data = generateIRDeclarationData();
    } else if (type === "CNSS") {
      data = generateCNSSDeclarationData();
    } else if (type === "CIMR") {
      data = generateCIMRDeclarationData();
    } else {
      data = [];
    }
    
    setDeclarationData(data);
    setExportStatus("preview");
    
    toast({
      title: "Déclaration générée",
      description: `Les données pour ${selectedMonth} ${selectedYear} ont été générées avec succès.`
    });
  };

  const handleExportCSV = () => {
    const filename = `Declaration_${type}_${selectedMonth}_${selectedYear}.csv`;
    
    exportToCSV(declarationData, filename, type);
    
    setExportStatus("exported");
    
    toast({
      title: "Export réussi",
      description: `Le fichier ${filename} a été téléchargé.`
    });
  };

  const handleMarkAsSent = () => {
    setExportStatus("sent");
    
    toast({
      title: "Déclaration marquée comme envoyée",
      description: `La déclaration ${type} pour ${selectedMonth} ${selectedYear} a été marquée comme envoyée.`
    });
  };

  const renderDeclarationPreview = () => {
    if (type === "IR") {
      return (
        <div className="rounded-md border my-4">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left">Identifiant fiscal</th>
                <th className="p-2 text-left">Nom employé</th>
                <th className="p-2 text-left">Net imposable</th>
                <th className="p-2 text-right">IR retenu</th>
              </tr>
            </thead>
            <tbody>
              {declarationData.map((item, index) => (
                <tr key={index} className="border-t hover:bg-muted/50">
                  <td className="p-2">{item.identifiantFiscal}</td>
                  <td className="p-2">{item.nomEmploye}</td>
                  <td className="p-2">{item.netImposable.toLocaleString('fr-FR')} MAD</td>
                  <td className="p-2 text-right">{item.irRetenu.toLocaleString('fr-FR')} MAD</td>
                </tr>
              ))}
              <tr className="bg-muted/20 font-medium">
                <td colSpan={2} className="p-2 text-right">Total</td>
                <td className="p-2">
                  {declarationData.reduce((sum, item) => sum + item.netImposable, 0).toLocaleString('fr-FR')} MAD
                </td>
                <td className="p-2 text-right">
                  {declarationData.reduce((sum, item) => sum + item.irRetenu, 0).toLocaleString('fr-FR')} MAD
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else if (type === "CNSS") {
      return (
        <div className="rounded-md border my-4">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left">Matricule CNSS</th>
                <th className="p-2 text-left">Nom employé</th>
                <th className="p-2 text-center">Jours</th>
                <th className="p-2 text-right">Salaire brut</th>
                <th className="p-2 text-right">Cotisation employé</th>
                <th className="p-2 text-right">Cotisation employeur</th>
              </tr>
            </thead>
            <tbody>
              {declarationData.map((item, index) => (
                <tr key={index} className="border-t hover:bg-muted/50">
                  <td className="p-2">{item.matriculeCNSS}</td>
                  <td className="p-2">{item.nomEmploye}</td>
                  <td className="p-2 text-center">{item.joursDeclaration}</td>
                  <td className="p-2 text-right">{item.salaireBrut.toLocaleString('fr-FR')} MAD</td>
                  <td className="p-2 text-right">{item.cotisationSalariale.toLocaleString('fr-FR')} MAD</td>
                  <td className="p-2 text-right">{item.cotisationPatronale.toLocaleString('fr-FR')} MAD</td>
                </tr>
              ))}
              <tr className="bg-muted/20 font-medium">
                <td colSpan={3} className="p-2 text-right">Total</td>
                <td className="p-2 text-right">
                  {declarationData.reduce((sum, item) => sum + item.salaireBrut, 0).toLocaleString('fr-FR')} MAD
                </td>
                <td className="p-2 text-right">
                  {declarationData.reduce((sum, item) => sum + item.cotisationSalariale, 0).toLocaleString('fr-FR')} MAD
                </td>
                <td className="p-2 text-right">
                  {declarationData.reduce((sum, item) => sum + item.cotisationPatronale, 0).toLocaleString('fr-FR')} MAD
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else if (type === "CIMR") {
      return (
        <div className="rounded-md border my-4">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left">Matricule</th>
                <th className="p-2 text-left">Nom employé</th>
                <th className="p-2 text-right">Salaire base</th>
                <th className="p-2 text-right">Cotisation employé</th>
                <th className="p-2 text-right">Cotisation employeur</th>
                <th className="p-2 text-right">Total cotisations</th>
              </tr>
            </thead>
            <tbody>
              {declarationData.map((item, index) => (
                <tr key={index} className="border-t hover:bg-muted/50">
                  <td className="p-2">{item.matricule}</td>
                  <td className="p-2">{item.nomEmploye}</td>
                  <td className="p-2 text-right">{item.salaireBase.toLocaleString('fr-FR')} MAD</td>
                  <td className="p-2 text-right">{item.cotisationEmploye.toLocaleString('fr-FR')} MAD</td>
                  <td className="p-2 text-right">{item.cotisationEmployeur.toLocaleString('fr-FR')} MAD</td>
                  <td className="p-2 text-right">
                    {(item.cotisationEmploye + item.cotisationEmployeur).toLocaleString('fr-FR')} MAD
                  </td>
                </tr>
              ))}
              <tr className="bg-muted/20 font-medium">
                <td colSpan={2} className="p-2 text-right">Total</td>
                <td className="p-2 text-right">
                  {declarationData.reduce((sum, item) => sum + item.salaireBase, 0).toLocaleString('fr-FR')} MAD
                </td>
                <td className="p-2 text-right">
                  {declarationData.reduce((sum, item) => sum + item.cotisationEmploye, 0).toLocaleString('fr-FR')} MAD
                </td>
                <td className="p-2 text-right">
                  {declarationData.reduce((sum, item) => sum + item.cotisationEmployeur, 0).toLocaleString('fr-FR')} MAD
                </td>
                <td className="p-2 text-right">
                  {declarationData.reduce((sum, item) => sum + item.cotisationEmploye + item.cotisationEmployeur, 0).toLocaleString('fr-FR')} MAD
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{getDeclarationTitle()}</CardTitle>
            <p className="text-sm text-muted-foreground">{getDeclarationDescription()}</p>
          </div>
          {type === "CIMR" && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/integration-bancaire">
                <CreditCard className="h-4 w-4 mr-2" />
                Paiements bancaires
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="w-full sm:w-1/3">
            <label className="text-sm font-medium mb-1 block">Mois</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-1/3">
            <label className="text-sm font-medium mb-1 block">Année</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-1/3 flex items-end">
            <Button 
              className="w-full" 
              onClick={handleGenerateDeclaration}
              disabled={exportStatus === "preview" || exportStatus === "exported" || exportStatus === "sent"}
            >
              Générer la déclaration
            </Button>
          </div>
        </div>

        {exportStatus === "preview" && renderDeclarationPreview()}
        
        {exportStatus === "exported" && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
            <AlertDescription>
              Le fichier a été exporté avec succès. N'oubliez pas de le télécharger sur la plateforme officielle avant la date limite.
            </AlertDescription>
          </Alert>
        )}
        
        {exportStatus === "sent" && (
          <Alert className="mb-4 bg-blue-50 border-blue-200 text-blue-800">
            <AlertDescription>
              La déclaration a été marquée comme envoyée. Elle sera archivée dans l'historique des déclarations.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      {(exportStatus === "preview" || exportStatus === "exported") && (
        <CardFooter className="flex justify-between border-t p-4 bg-muted/20">
          <Button variant="outline" onClick={() => setExportStatus("idle")}>
            Modifier
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" disabled={exportStatus === "preview" && declarationData.length === 0} onClick={handleExportCSV}>
              <FileDown className="mr-2 h-4 w-4" /> Exporter CSV
            </Button>
            {exportStatus === "exported" && (
              <Button onClick={handleMarkAsSent}>
                <Check className="mr-2 h-4 w-4" /> Marquer comme envoyé
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DeclarationExport;
