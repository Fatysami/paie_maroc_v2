
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Bulletin {
  id: string;
  employe: { id: string; nom: string; prenom: string; matricule: string };
  periode: { mois: string; annee: string };
  montantNet: number;
  dateGeneration: string | null;
  dateEnvoi: string | null;
  statut: string;
}

interface EtatPaie {
  id: string;
  nom: string;
  description: string;
  periodes: string[];
  dernierTelechargement: string;
}

interface Rapport {
  id: string;
  nom: string;
  description: string;
  format: string;
  dernierTelechargement: string;
}

export interface EmailOptions {
  message: string;
  ccRH: boolean;
}

export const useBulletins = () => {
  const { toast } = useToast();
  const [selectedBulletins, setSelectedBulletins] = useState<string[]>([]);

  // Données mockées pour les bulletins de paie
  const bulletins: Bulletin[] = [
    {
      id: "1",
      employe: { id: "1", nom: "El Alaoui", prenom: "Mohamed", matricule: "EMP-2023-0042" },
      periode: { mois: "Avril", annee: "2023" },
      montantNet: 14500.75,
      dateGeneration: "2023-05-02T14:30:00",
      dateEnvoi: "2023-05-03T09:15:00",
      statut: "envoyé"
    },
    {
      id: "2",
      employe: { id: "2", nom: "Benani", prenom: "Leila", matricule: "EMP-2023-0043" },
      periode: { mois: "Avril", annee: "2023" },
      montantNet: 21300.50,
      dateGeneration: "2023-05-02T14:35:00",
      dateEnvoi: null,
      statut: "généré"
    },
    {
      id: "3",
      employe: { id: "3", nom: "Rachidi", prenom: "Karim", matricule: "EMP-2022-0039" },
      periode: { mois: "Avril", annee: "2023" },
      montantNet: 18200.25,
      dateGeneration: "2023-05-02T14:40:00",
      dateEnvoi: null,
      statut: "généré"
    },
    {
      id: "4",
      employe: { id: "4", nom: "Safi", prenom: "Nadia", matricule: "EMP-2023-0044" },
      periode: { mois: "Avril", annee: "2023" },
      montantNet: 12800.00,
      dateGeneration: null,
      dateEnvoi: null,
      statut: "en_attente"
    }
  ];

  // Données mockées pour les états de paie
  const etatsPaie: EtatPaie[] = [
    {
      id: "1",
      nom: "État CNSS",
      description: "Déclaration mensuelle CNSS",
      periodes: ["2023-04", "2023-03"],
      dernierTelechargement: "2023-05-05T10:15:00"
    },
    {
      id: "2",
      nom: "Etat IR",
      description: "Déclaration de l'Impôt sur le Revenu",
      periodes: ["2023-04", "2023-03", "2023-02"],
      dernierTelechargement: "2023-05-04T11:30:00"
    },
    {
      id: "3",
      nom: "Ordre de virement",
      description: "Ordre de virement des salaires",
      periodes: ["2023-04"],
      dernierTelechargement: "2023-05-02T16:45:00"
    }
  ];

  // Données mockées pour les rapports personnalisés
  const rapportsPersonnalises: Rapport[] = [
    {
      id: "1",
      nom: "Synthèse des salaires par département",
      description: "Détails des salaires bruts/nets par département",
      format: "excel",
      dernierTelechargement: "2023-05-01T09:20:00"
    },
    {
      id: "2",
      nom: "Analyse des primes et indemnités",
      description: "Répartition des primes et indemnités par employé",
      format: "pdf",
      dernierTelechargement: "2023-04-28T14:10:00"
    },
    {
      id: "3",
      nom: "Coût total des charges patronales",
      description: "Détail des charges patronales par catégorie",
      format: "excel",
      dernierTelechargement: "2023-04-15T11:30:00"
    }
  ];

  // Extraire le mois et l'année à partir de la période
  const getPeriodeLabels = (periodeStr: string) => {
    const [annee, mois] = periodeStr.split('-');
    const moisNoms = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    return {
      moisNom: moisNoms[parseInt(mois) - 1],
      annee
    };
  };

  // Générer tous les bulletins d'une période
  const genererTousBulletins = () => {
    toast({
      title: "Génération en cours",
      description: "Génération de tous les bulletins de paie pour la période sélectionnée..."
    });

    // Simuler la génération des bulletins
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        toast({
          title: "Génération terminée",
          description: "Tous les bulletins de paie ont été générés avec succès."
        });
        resolve();
      }, 3000);
    });
  };

  // Envoyer les bulletins par email
  const envoyerBulletins = (options: EmailOptions) => {
    toast({
      title: "Envoi en cours",
      description: `Envoi des bulletins par email...`
    });

    // Simuler l'envoi des bulletins
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        toast({
          title: "Envoi terminé",
          description: `Les bulletins de paie ont été envoyés avec succès.`
        });
        setSelectedBulletins([]);
        resolve();
      }, 2000);
    });
  };

  return {
    bulletins,
    etatsPaie,
    rapportsPersonnalises,
    selectedBulletins,
    setSelectedBulletins,
    getPeriodeLabels,
    genererTousBulletins,
    envoyerBulletins
  };
};
