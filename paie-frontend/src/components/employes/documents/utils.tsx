
import React from 'react';
import { Document, DocumentStatus } from "./types";
import { toast } from "sonner";
import { 
  File, 
  FileText, 
  Image, 
  FileArchive, 
  FileSpreadsheet 
} from "lucide-react";

export const getFileIcon = (fileName?: string) => {
  if (!fileName) return <File className="h-5 w-5" />;
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <Image className="h-5 w-5 text-blue-500" />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    case 'zip':
    case 'rar':
      return <FileArchive className="h-5 w-5 text-yellow-600" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

export const formatFileSize = (bytes?: number) => {
  if (!bytes) return '';
  
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const handleFileUpload = (
  document: Document | null, 
  onFileSelected: (file: File, document: Document | null) => void
) => {
  // Create a new file input element
  const fileInputElement = window.document.createElement('input');
  fileInputElement.type = 'file';
  fileInputElement.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
  
  fileInputElement.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      onFileSelected(file, document);
    }
  });
  
  fileInputElement.click();
};

export const guessDocumentType = (fileName: string) => {
  let guessedType = "";
  if (fileName.toLowerCase().includes("contrat")) guessedType = "Contrat de travail";
  else if (fileName.toLowerCase().includes("cin")) guessedType = "CIN";
  else if (fileName.toLowerCase().includes("rib")) guessedType = "Attestation RIB";
  return guessedType;
};
