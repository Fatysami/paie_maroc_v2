
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle, Upload, Download } from "lucide-react";
import { Document } from "./types";
import { toast } from "sonner";
import { getFileIcon } from "./utils";

interface ObligatoiresTabProps {
  documents: Document[];
  obligatoiresManquants: Document[];
  onUpload: (document: Document) => void;
}

const ObligatoiresTab = ({ documents, obligatoiresManquants, onUpload }: ObligatoiresTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Documents obligatoires</h3>
        <Button 
          variant="outline" 
          onClick={() => onUpload(null)}
          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
        >
          <Upload className="h-4 w-4 mr-2" />
          Télécharger un document obligatoire
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-base flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
              Documents téléchargés
            </CardTitle>
            <CardDescription>
              Documents obligatoires déjà présents dans le dossier
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {documents.filter(doc => doc.obligatoire && doc.status === 'uploaded').length > 0 ? (
              <ul className="divide-y">
                {documents
                  .filter(doc => doc.obligatoire && doc.status === 'uploaded')
                  .map((doc) => (
                    <li key={doc.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(doc.fileName)}
                        <div>
                          <p className="font-medium">{doc.nom}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(0)} KB` : ''}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toast.info("Téléchargement simulé")}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
              </ul>
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">Aucun document obligatoire téléchargé</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="bg-amber-50 border-b border-amber-100">
            <CardTitle className="text-base flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
              Documents manquants
            </CardTitle>
            <CardDescription>
              Documents obligatoires à télécharger
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {obligatoiresManquants.length > 0 ? (
              <ul className="divide-y">
                {obligatoiresManquants.map((doc) => (
                  <li key={doc.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <XCircle className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium">{doc.nom}</p>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-amber-500 hover:bg-amber-600"
                      onClick={() => onUpload({...doc, status: 'pending'})}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Télécharger
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center">
                <div className="mx-auto bg-green-100 h-12 w-12 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-medium text-green-700">Tous les documents obligatoires sont présents</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ObligatoiresTab;
