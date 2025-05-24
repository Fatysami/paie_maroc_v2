
// Mock data for testing the Conges components
import { addDays } from "date-fns";

export interface CongeEmploye {
  id: string;
  type: string;
  dateDebut: Date;
  dateFin: Date;
  statut: "validé" | "en attente" | "refusé" | "annulé";
  nombreJours: number;
  commentaire?: string;
}

export const generateMockConges = (): CongeEmploye[] => {
  return [
    {
      id: "1",
      type: "Congés payés",
      dateDebut: new Date(2024, 5, 1),
      dateFin: new Date(2024, 5, 15),
      statut: "validé",
      nombreJours: 10,
      commentaire: "Congés d'été"
    },
    {
      id: "2",
      type: "Maladie",
      dateDebut: new Date(2024, 2, 10),
      dateFin: new Date(2024, 2, 12),
      statut: "validé",
      nombreJours: 3,
      commentaire: "Certificat médical fourni"
    },
    {
      id: "3",
      type: "Congés exceptionnels",
      dateDebut: new Date(2024, 7, 5),
      dateFin: new Date(2024, 7, 7),
      statut: "en attente",
      nombreJours: 3
    },
    {
      id: "4",
      type: "Congés sans solde",
      dateDebut: new Date(2024, 4, 20),
      dateFin: new Date(2024, 4, 22),
      statut: "refusé",
      nombreJours: 3,
      commentaire: "Refusé pour raisons de service"
    },
    {
      id: "5",
      type: "RTT",
      dateDebut: new Date(2024, 8, 12),
      dateFin: new Date(2024, 8, 12),
      statut: "validé",
      nombreJours: 1
    },
    {
      id: "6",
      type: "Formation",
      dateDebut: new Date(2024, 3, 15),
      dateFin: new Date(2024, 3, 19),
      statut: "validé",
      nombreJours: 5,
      commentaire: "Formation développement personnel"
    },
    {
      id: "7",
      type: "Congés payés",
      dateDebut: addDays(new Date(), 5),
      dateFin: addDays(new Date(), 10),
      statut: "validé",
      nombreJours: 6,
      commentaire: "Congés planifiés"
    },
    {
      id: "8",
      type: "Repos compensateur",
      dateDebut: addDays(new Date(), 15),
      dateFin: addDays(new Date(), 16),
      statut: "en attente",
      nombreJours: 2,
      commentaire: "En attente de validation"
    },
    {
      id: "9", 
      type: "Maladie",
      dateDebut: new Date(),
      dateFin: addDays(new Date(), 1),
      statut: "validé",
      nombreJours: 2,
      commentaire: "Maladie en cours"
    }
  ];
};
