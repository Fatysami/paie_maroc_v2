
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Document, DocumentStatus } from "./documents/types";
import { Employe } from "@/pages/GestionEmployes";
import { handleFileUpload, guessDocumentType } from "./documents/utils";
import DocumentForm from "./documents/DocumentForm";
import AllDocumentsTab from "./documents/AllDocumentsTab";
import ObligatoiresTab from "./documents/ObligatoiresTab";
import UploadTab from "./documents/UploadTab";

interface DetailDocumentsProps {
  employe: Employe;
  onUpdate: (updatedEmploye: Employe) => void;
  isNewEmploye?: boolean;
}

const DetailDocuments = ({ employe, onUpdate, isNewEmploye = false }: DetailDocumentsProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState(isNewEmploye ? "upload" : "tous");

  // Make sure employe.documents exists before using it and properly typed
  const employeDocuments = employe.documents || { contratSigne: false, cin: false, rib: false };
  
  const initialDocuments: Document[] = [
    ...(employeDocuments.contratSigne === true ? [{
      id: "doc-1",
      nom: "Contrat de travail",
      type: "Contrat de travail",
      description: "Contrat CDI signé",
      dateUpload: new Date().toISOString(),
      fileName: "contrat_cdi_signe.pdf",
      fileSize: 1240000,
      uploadedBy: "Mohammed Alami",
      status: 'uploaded' as DocumentStatus,
      obligatoire: true
    }] : []),
    ...(employeDocuments.cin === true ? [{
      id: "doc-2",
      nom: "Carte d'identité nationale",
      type: "CIN",
      description: "Copie recto-verso de la CIN",
      dateUpload: new Date().toISOString(),
      fileName: "cin_recto_verso.jpg",
      fileSize: 520000,
      uploadedBy: "Mohammed Alami",
      status: 'uploaded' as DocumentStatus,
      obligatoire: true
    }] : []),
    ...(employeDocuments.rib === true ? [{
      id: "doc-3",
      nom: "Attestation RIB",
      type: "Attestation RIB",
      description: "Attestation bancaire du RIB",
      dateUpload: new Date().toISOString(),
      fileName: "attestation_rib.pdf",
      fileSize: 780000,
      uploadedBy: "Mohammed Alami",
      status: 'uploaded' as DocumentStatus,
      obligatoire: true
    }] : [])
  ];

  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  const obligatoiresManquants = [
    { 
      id: "req-1", 
      nom: "Contrat de travail", 
      type: "Contrat de travail", 
      description: "Document légal obligatoire",
      status: 'pending' as DocumentStatus,
      obligatoire: true
    },
    { 
      id: "req-2", 
      nom: "Carte d'identité nationale", 
      type: "CIN", 
      description: "Document légal obligatoire",
      status: 'pending' as DocumentStatus,
      obligatoire: true
    },
    { 
      id: "req-3", 
      nom: "Attestation RIB", 
      type: "Attestation RIB", 
      description: "Document requis pour le paiement du salaire",
      status: 'pending' as DocumentStatus,
      obligatoire: true
    }
  ].filter(doc => !documents.some(d => d.type === doc.type));

  const handleAddDocument = () => {
    setEditingDocument(null);
    setIsAddDialogOpen(true);
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setIsAddDialogOpen(true);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success("Document supprimé avec succès");
    updateEmployeDocuments();
  };

  const handleFileSelected = (file: File, document: Document | null) => {
    if (document && document.id) {
      setDocuments(docs => docs.map(doc => 
        doc.id === document.id ? { 
          ...doc, 
          fileName: file.name,
          fileSize: file.size,
          dateUpload: new Date().toISOString(),
          status: 'uploaded' as DocumentStatus,
          uploadedBy: "Mohammed Alami"
        } : doc
      ));
      
      toast.success(`Document "${document.nom}" mis à jour avec succès`);
    } else {
      const newDocId = `doc-${documents.length + 1}`;
      
      const guessedType = guessDocumentType(file.name);
      
      const obligatoireManquant = obligatoiresManquants.find(doc => 
        guessedType && doc.type === guessedType
      );
      
      if (obligatoireManquant) {
        setDocuments([...documents, {
          id: newDocId,
          nom: obligatoireManquant.nom,
          type: obligatoireManquant.type,
          description: obligatoireManquant.description,
          fileName: file.name,
          fileSize: file.size,
          dateUpload: new Date().toISOString(),
          status: 'uploaded' as DocumentStatus,
          uploadedBy: "Mohammed Alami",
          obligatoire: true
        }]);
        
        toast.success(`Document obligatoire "${obligatoireManquant.nom}" ajouté avec succès`);
      } else {
        setIsAddDialogOpen(true);
        setEditingDocument({
          nom: file.name.split('.')[0] || "Nouveau document",
          type: "",
          description: "",
          dateExpiration: "",
          obligatoire: false,
          fileName: file.name,
          fileSize: file.size,
          dateUpload: new Date().toISOString(),
          uploadedBy: "Mohammed Alami",
          status: 'uploaded' as DocumentStatus
        });
      }
    }
    
    updateEmployeDocuments();
  };

  const handleUploadDocument = (document: Document | null) => {
    const fileInputHandler = (file: File, doc: Document | null) => {
      handleFileSelected(file, doc);
    };
    
    handleFileUpload(document, fileInputHandler);
  };

  const onSubmitDocument = (data: Document) => {
    if (editingDocument && editingDocument.id) {
      setDocuments(docs => docs.map(doc => 
        doc.id === editingDocument.id ? { 
          ...doc, 
          ...data,
          status: doc.status || 'pending' as DocumentStatus
        } : doc
      ));
      
      toast.success(`Document "${data.nom}" mis à jour avec succès`);
    } else {
      const newDocId = `doc-${documents.length + 1}`;
      
      setDocuments([...documents, {
        ...data,
        ...editingDocument,
        id: newDocId,
        status: editingDocument?.fileName ? 'uploaded' as DocumentStatus : 'pending' as DocumentStatus
      }]);
      
      toast.success(`Document "${data.nom}" ajouté avec succès`);
    }
    
    setIsAddDialogOpen(false);
    setEditingDocument(null);
    
    updateEmployeDocuments();
  };

  const updateEmployeDocuments = () => {
    const contratSigne = documents.some(doc => doc.type === "Contrat de travail" && doc.status === 'uploaded');
    const cin = documents.some(doc => doc.type === "CIN" && doc.status === 'uploaded');
    const rib = documents.some(doc => doc.type === "Attestation RIB" && doc.status === 'uploaded');
    
    const updatedEmploye = {
      ...employe,
      documents: {
        ...employe.documents,
        contratSigne,
        cin,
        rib
      }
    };
    
    onUpdate(updatedEmploye);
  };

  return (
    <div className="space-y-8">
      {isNewEmploye && (
        <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Gestion des documents de l'employé</h3>
          <p className="text-blue-700">
            Cet espace vous permet de télécharger et gérer tous les documents relatifs à {employe.prenom} {employe.nom}.
            Commencez par télécharger les documents obligatoires.
          </p>
        </div>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tous">Tous les documents</TabsTrigger>
          <TabsTrigger value="obligatoires">Documents obligatoires</TabsTrigger>
          <TabsTrigger value="upload">Télécharger</TabsTrigger>
        </TabsList>

        <TabsContent value="tous">
          <AllDocumentsTab 
            documents={documents}
            onEdit={handleEditDocument}
            onDelete={handleDeleteDocument}
            onUpload={handleUploadDocument}
            onAddDocument={handleAddDocument}
          />
        </TabsContent>

        <TabsContent value="obligatoires">
          <ObligatoiresTab 
            documents={documents}
            obligatoiresManquants={obligatoiresManquants}
            onUpload={handleUploadDocument}
          />
        </TabsContent>

        <TabsContent value="upload">
          <UploadTab 
            employe={employe}
            documents={documents}
            obligatoiresManquants={obligatoiresManquants}
            onUpload={handleUploadDocument}
            onFormOpen={(doc) => {
              setEditingDocument(doc);
              setIsAddDialogOpen(true);
            }}
            isNewEmploye={isNewEmploye}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingDocument?.id ? "Modifier le document" : "Ajouter un document"}</DialogTitle>
            <DialogDescription>
              {editingDocument?.id 
                ? "Modifiez les informations du document ci-dessous."
                : "Remplissez les informations pour ajouter un nouveau document."}
            </DialogDescription>
          </DialogHeader>
          <DocumentForm 
            editingDocument={editingDocument} 
            onSubmit={(data) => {
              onSubmitDocument(data);
              setIsAddDialogOpen(false);
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailDocuments;
