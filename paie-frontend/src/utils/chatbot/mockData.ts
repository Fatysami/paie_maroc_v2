
import { ChatMessageType, AIResponseType } from '@/types/chatbot';

// Mock messages for the chatbot
export const mockMessages: ChatMessageType[] = [
  {
    id: '1',
    content: "Bonjour ! Je suis votre assistant RH virtuel. Comment puis-je vous aider aujourd'hui ?",
    sender: 'assistant',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'delivered'
  }
];

// Mock suggestions for the chatbot
export const mockSuggestions: string[] = [
  "Combien de jours de congés me reste-t-il ?",
  "Où trouver mon bulletin de salaire ?",
  "Quand sera versé mon prochain salaire ?",
  "Comment demander une attestation de travail ?",
  "Pourquoi mon salaire a baissé ce mois-ci ?"
];

// Mock HR admin suggestions
export const mockHRSuggestions: string[] = [
  "Simulation d'embauche à 15000 MAD",
  "Impact prime 2000 MAD sur IR",
  "Audit des cotisations sociales",
  "Vérification taux CNSS employés",
  "Liste des absences non justifiées ce mois"
];

// Employee-focused response generation
const employeeResponses: Record<string, AIResponseType> = {
  "congés": {
    message: "Selon nos données, il vous reste 12 jours de congés payés pour l'année en cours. Votre solde se décompose ainsi : 10 jours de congés annuels + 2 jours de compensation.",
    actions: [
      {
        type: 'navigate',
        label: 'Demander un congé',
        icon: 'calendar'
      },
      {
        type: 'download',
        label: 'Historique congés',
        icon: 'download'
      }
    ]
  },
  "bulletin": {
    message: "Vos bulletins de paie sont disponibles dans votre espace personnel. Le dernier bulletin (Mai 2024) a été généré le 28/05/2024.",
    actions: [
      {
        type: 'download',
        label: 'Télécharger bulletin Mai 2024',
        icon: 'download'
      },
      {
        type: 'navigate',
        label: 'Tous mes bulletins',
        icon: 'file'
      }
    ]
  },
  "salaire": {
    message: "Votre prochain salaire sera versé le 30 du mois en cours. Le montant net prévu est de 10,754.25 MAD par virement bancaire sur votre compte CIH Bank.",
    actions: []
  },
  "attestation": {
    message: "Vous pouvez demander une attestation de travail directement depuis votre espace personnel. Le document sera généré automatiquement et pourra être téléchargé immédiatement.",
    actions: [
      {
        type: 'create',
        label: 'Générer une attestation',
        icon: 'file'
      }
    ]
  },
  "baisse": {
    message: "Après analyse, votre salaire de mai 2024 (10,754.25 MAD) est inférieur à celui d'avril (11,234.80 MAD) en raison d'une absence non justifiée de 2 jours (déduction de 480.55 MAD).",
    actions: [
      {
        type: 'navigate',
        label: 'Voir détail absence',
        icon: 'calendar'
      }
    ]
  }
};

// HR admin-focused response generation
const hrResponses: Record<string, AIResponseType> = {
  "simulation": {
    message: "Voici le résultat de la simulation d'embauche à 15,000 MAD brut :\n- Salaire net : 12,237.90 MAD\n- Coût employeur total : 17,295.00 MAD\n- Charges patronales : 2,295.00 MAD\n- IR mensuel : 1,053.30 MAD",
    actions: [
      {
        type: 'execute',
        label: 'Afficher détail simulation',
        icon: 'file'
      },
      {
        type: 'download',
        label: 'Exporter PDF',
        icon: 'download'
      }
    ]
  },
  "prime": {
    message: "Impact d'une prime de 2,000 MAD pour l'employé Salma EL KADIRI (actuel brut: 15,400 MAD) :\n- IR avant prime : 1,053.30 MAD\n- IR avec prime : 1,303.30 MAD\n- Augmentation IR : 250.00 MAD\n- Net à percevoir de la prime : 1,750.00 MAD",
    actions: [
      {
        type: 'execute',
        label: 'Appliquer la prime',
        icon: 'file'
      }
    ]
  },
  "audit": {
    message: "Audit des cotisations sociales pour mai 2024 :\n- 3 employés dépassent le plafond CNSS (salaire > 6,000 MAD)\n- Tous les taux CNSS sont conformes (4.29%)\n- AMO correctement appliquée (2.26%)\n- CIMR : 1 employé avec taux erroné (3% au lieu de 6%)",
    actions: [
      {
        type: 'navigate',
        label: 'Corriger anomalies',
        icon: 'file'
      }
    ]
  },
  "taux": {
    message: "Vérification des taux CNSS : tous les 23 employés ont le taux correct de 4.29%. Les plafonds sont bien appliqués. Total à verser à la CNSS pour mai 2024 : 12,672.36 MAD.",
    actions: []
  },
  "absences": {
    message: "Liste des absences non justifiées pour mai 2024 :\n- Karim ALAOUI : 3 jours (du 10 au 12 mai)\n- Yasmine RADI : 1 jour (22 mai)\n- Mohamed TAZI : 0.5 jour (14 mai après-midi)\n\nImpact total sur la paie : 2,876.30 MAD",
    actions: [
      {
        type: 'navigate',
        label: 'Voir détails absences',
        icon: 'calendar'
      },
      {
        type: 'execute',
        label: 'Régulariser',
        icon: 'file'
      }
    ]
  }
};

// Generate AI response based on user message
export function generateAIResponse(message: string, isEmployee: boolean): AIResponseType {
  const normalizedMessage = message.toLowerCase();
  
  // Default response if no match is found
  let response: AIResponseType = {
    message: isEmployee 
      ? "Je ne comprends pas complètement votre demande. Pourriez-vous reformuler ou choisir l'une des suggestions ci-dessous ?"
      : "Je n'ai pas toutes les informations pour répondre à cette question spécifique. Veuillez préciser ou choisir une autre requête.",
    actions: []
  };
  
  // Check for keywords in the message and return appropriate response
  if (isEmployee) {
    if (normalizedMessage.includes("congé")) {
      response = employeeResponses["congés"];
    } else if (normalizedMessage.includes("bulletin") || normalizedMessage.includes("fiche de paie")) {
      response = employeeResponses["bulletin"];
    } else if (normalizedMessage.includes("salaire") || normalizedMessage.includes("paiement") || normalizedMessage.includes("versement")) {
      response = employeeResponses["salaire"];
    } else if (normalizedMessage.includes("attestation") || normalizedMessage.includes("certificat")) {
      response = employeeResponses["attestation"];
    } else if (normalizedMessage.includes("baisse") || normalizedMessage.includes("moins") || normalizedMessage.includes("diminué")) {
      response = employeeResponses["baisse"];
    }
  } else {
    // HR admin responses
    if (normalizedMessage.includes("simulation") || normalizedMessage.includes("embauche") || normalizedMessage.includes("recruter")) {
      response = hrResponses["simulation"];
    } else if (normalizedMessage.includes("prime") || normalizedMessage.includes("bonus")) {
      response = hrResponses["prime"];
    } else if (normalizedMessage.includes("audit") || normalizedMessage.includes("vérifier") || normalizedMessage.includes("contrôle")) {
      response = hrResponses["audit"];
    } else if (normalizedMessage.includes("taux") || normalizedMessage.includes("cnss") || normalizedMessage.includes("cotisation")) {
      response = hrResponses["taux"];
    } else if (normalizedMessage.includes("absence") || normalizedMessage.includes("absent") || normalizedMessage.includes("manqué")) {
      response = hrResponses["absences"];
    }
  }
  
  return response;
}
