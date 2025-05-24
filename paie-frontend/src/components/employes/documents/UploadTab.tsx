
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Download } from "lucide-react";
import { Document } from "./types";
import { toast } from "sonner";
import { getFileIcon } from "./utils";

interface UploadTabProps {
  employe: { prenom: string; nom: string };
  documents: Document[];
  obligatoiresManquants: Document[];
  onUpload: (document: Document | null) => void;
  onFormOpen: (document: Document | null) => void;
  isNewEmploye?: boolean;
}

const UploadTab = ({ 
  employe, 
  documents, 
  obligatoiresManquants, 
  onUpload, 
  onFormOpen,
  isNewEmploye = false 
}: UploadTabProps) => {
  const isNewEmployeClass = isNewEmploye ? "animate-pulse border-blue-300 bg-blue-50" : "";

  return (
    <div className={`space-y-6 ${isNewEmployeClass}`}>
      <Card>
        <CardHeader>
          <CardTitle>Télécharger des documents</CardTitle>
          <CardDescription>
            Importez des fichiers pour le dossier de {employe.prenom} {employe.nom}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onUpload(null)}
          >
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Upload className="h-12 w-12 mx-auto text-gray-400" />
            </div>
            <div className="mt-4 flex text-sm text-gray-600">
              <Label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
              >
                <span>Télécharger un fichier</span>
              </Label>
              <p className="pl-1">ou glisser-déposer</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              PDF, DOC, DOCX, JPG, PNG jusqu'à 10MB
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium mb-3">Documents fréquemment téléchargés</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Contrat de travail", "CIN", "Attestation RIB", "Diplôme"].map((doc) => (
                <Button 
                  key={doc} 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => {
                    const obligatoire = obligatoiresManquants.find(d => d.type === doc);
                    if (obligatoire) {
                      onUpload({...obligatoire, status: 'pending'});
                    } else {
                      onFormOpen({
                        nom: doc,
                        type: doc,
                        description: "",
                        dateExpiration: "",
                        obligatoire: true
                      });
                    }
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {doc}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {documents.filter(doc => doc.dateUpload).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documents récemment téléchargés</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y border rounded-md">
              {documents
                .filter(doc => doc.dateUpload)
                .sort((a, b) => 
                  new Date(b.dateUpload || '').getTime() - new Date(a.dateUpload || '').getTime()
                )
                .slice(0, 3)
                .map((doc) => (
                  <li key={doc.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(doc.fileName)}
                      <div>
                        <p className="font-medium">{doc.nom}</p>
                        <p className="text-xs text-muted-foreground">
                          Téléchargé le {new Date(doc.dateUpload || '').toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600"
                      onClick={() => toast.info("Téléchargement simulé")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UploadTab;
