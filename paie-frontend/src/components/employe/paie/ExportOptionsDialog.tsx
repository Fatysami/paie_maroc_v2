
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileArchive, FileText, Download } from "lucide-react";

interface ExportOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (options: ExportOptions) => void;
  bulletinIds?: string[];
  isBulkExport?: boolean;
}

export interface ExportOptions {
  format: "pdf" | "excel" | "csv";
  periode?: {
    debut: string;
    fin: string;
  };
  inclureDetails: boolean;
  inclureCumuls: boolean;
  inclureSignature: boolean;
  protection: boolean;
  motDePasse?: string;
}

const ExportOptionsDialog: React.FC<ExportOptionsDialogProps> = ({
  open,
  onOpenChange,
  onExport,
  bulletinIds = [],
  isBulkExport = false,
}) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: "pdf",
    inclureDetails: true,
    inclureCumuls: true,
    inclureSignature: false,
    protection: false,
  });

  const [motDePasse, setMotDePasse] = useState<string>("");

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleExport = () => {
    const exportOptions = {
      ...options,
      motDePasse: options.protection ? motDePasse : undefined,
    };
    onExport(exportOptions);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Options d'exportation</DialogTitle>
          <DialogDescription>
            {isBulkExport
              ? `Configurer l'exportation de ${bulletinIds.length} bulletin(s)`
              : "Configurer l'exportation du bulletin"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Format d'exportation</Label>
            <RadioGroup
              value={options.format}
              onValueChange={(value) => handleOptionChange("format", value)}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center">
                  <FileText className="mr-1 h-4 w-4" /> PDF
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel">Excel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv">CSV</Label>
              </div>
            </RadioGroup>
          </div>

          {isBulkExport && (
            <div className="space-y-2">
              <Label>Regroupement</Label>
              <Select
                defaultValue="archive"
                onValueChange={(value) => console.log(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un mode de regroupement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="archive">
                    <div className="flex items-center">
                      <FileArchive className="mr-2 h-4 w-4" />
                      Archive ZIP (un fichier par bulletin)
                    </div>
                  </SelectItem>
                  <SelectItem value="merge">Fusionner en un seul document</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label className="text-base">Options de contenu</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inclureDetails"
                    checked={options.inclureDetails}
                    onCheckedChange={(checked) =>
                      handleOptionChange("inclureDetails", !!checked)
                    }
                  />
                  <Label htmlFor="inclureDetails">
                    Inclure tous les détails de calcul
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inclureCumuls"
                    checked={options.inclureCumuls}
                    onCheckedChange={(checked) =>
                      handleOptionChange("inclureCumuls", !!checked)
                    }
                  />
                  <Label htmlFor="inclureCumuls">
                    Inclure les cumuls annuels
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inclureSignature"
                    checked={options.inclureSignature}
                    onCheckedChange={(checked) =>
                      handleOptionChange("inclureSignature", !!checked)
                    }
                  />
                  <Label htmlFor="inclureSignature">
                    Inclure la signature électronique
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="protection"
                  checked={options.protection}
                  onCheckedChange={(checked) =>
                    handleOptionChange("protection", !!checked)
                  }
                />
                <Label htmlFor="protection">
                  Protéger par mot de passe
                </Label>
              </div>
              {options.protection && (
                <div className="pl-6 pt-2">
                  <Label htmlFor="password" className="text-sm">
                    Mot de passe
                  </Label>
                  <input
                    type="password"
                    id="password"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Entrez un mot de passe"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Exporter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportOptionsDialog;
