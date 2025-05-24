
import { Document, DocumentStatus } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Pencil, Trash2, Download, Upload } from "lucide-react";
import { getFileIcon, formatFileSize } from "./utils";

interface DocumentCardProps {
  document: Document;
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
  onUpload: (document: Document) => void;
}

const getStatusBadge = (status?: string) => {
  switch (status) {
    case 'uploaded':
      return <Badge variant="outline" className="bg-green-100 text-green-800">Téléchargé</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    case 'expired':
      return <Badge variant="outline" className="bg-red-100 text-red-800">Expiré</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-100 text-red-800">Rejeté</Badge>;
    default:
      return <Badge variant="outline">Non défini</Badge>;
  }
};

const DocumentCard = ({ document, onEdit, onDelete, onUpload }: DocumentCardProps) => {
  return (
    <Card className={document.obligatoire ? "border-blue-200" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center">
              {getFileIcon(document.fileName)}
              <span className="ml-2 truncate">{document.nom}</span>
            </CardTitle>
            <CardDescription className="truncate">
              {document.description || document.type}
            </CardDescription>
          </div>
          {document.obligatoire && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Obligatoire
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Statut:</span>
            {getStatusBadge(document.status)}
          </div>
          {document.fileName && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Fichier:</span>
              <span className="font-medium truncate max-w-[150px]">{document.fileName}</span>
            </div>
          )}
          {document.fileSize && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Taille:</span>
              <span>{formatFileSize(document.fileSize)}</span>
            </div>
          )}
          {document.dateUpload && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Téléchargé le:</span>
              <span>{new Date(document.dateUpload).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => document.status === 'uploaded' ? 
            toast.info("Téléchargement simulé") : 
            onUpload(document)
          }
        >
          {document.status === 'uploaded' ? 
            <Download className="h-4 w-4 mr-1" /> : 
            <Upload className="h-4 w-4 mr-1" />
          }
          {document.status === 'uploaded' ? "Télécharger" : "Importer"}
        </Button>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(document)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => document.id && onDelete(document.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
