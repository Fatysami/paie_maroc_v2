
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Upload, FileText } from "lucide-react";
import { Document } from "./types";
import DocumentCard from "./DocumentCard";

interface AllDocumentsTabProps {
  documents: Document[];
  onEdit: (document: Document) => void;
  onDelete: (id: string) => void;
  onUpload: (document: Document | null) => void;
  onAddDocument: () => void;
}

const AllDocumentsTab = ({ 
  documents, 
  onEdit, 
  onDelete, 
  onUpload, 
  onAddDocument 
}: AllDocumentsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tous les documents</h3>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onUpload(null)}>
            <Upload className="h-4 w-4 mr-2" />
            Télécharger un fichier
          </Button>
          <Button onClick={onAddDocument}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouveau document
          </Button>
        </div>
      </div>

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((document) => (
            <DocumentCard 
              key={document.id} 
              document={document} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              onUpload={onUpload} 
            />
          ))}
        </div>
      ) : (
        <Card className="flex items-center justify-center py-8 text-center">
          <div className="space-y-2">
            <div className="mx-auto bg-muted h-12 w-12 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium">Aucun document trouvé</h3>
            <p className="text-sm text-muted-foreground">
              Utilisez le bouton "Télécharger un fichier" pour ajouter des documents.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AllDocumentsTab;
