
import { z } from "zod";

export const documentSchema = z.object({
  nom: z.string().min(2, { message: "Le nom du document est requis" }),
  type: z.string().min(2, { message: "Le type de document est requis" }),
  description: z.string().optional(),
  dateExpiration: z.string().optional(),
  obligatoire: z.boolean().default(false),
});

export type DocumentStatus = 'uploaded' | 'pending' | 'expired' | 'rejected';

export type Document = z.infer<typeof documentSchema> & {
  id?: string;
  dateUpload?: string;
  fileName?: string;
  fileSize?: number;
  uploadedBy?: string;
  status?: DocumentStatus;
  fileUrl?: string;
};

export const DOCUMENT_TYPES = [
  "Contrat de travail",
  "Avenant au contrat",
  "CIN",
  "Attestation RIB",
  "Attestation CNSS",
  "Diplôme",
  "Certificat médical",
  "Lettre de recommandation",
  "CV",
  "Fiche de poste",
  "Règlement intérieur signé",
  "Autre"
];
