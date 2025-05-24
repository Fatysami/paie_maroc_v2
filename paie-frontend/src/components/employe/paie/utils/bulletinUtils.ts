
/**
 * Utility functions for bulletin components
 */

/**
 * Calculate the total amount of cotisations from bulletin elements
 */
export const calculateTotalCotisations = (elements?: {
  type: "salaire" | "prime" | "avantage" | "retenue" | "cotisation";
  nom: string;
  montant: number;
  tauxOuQuantite?: number;
}[]) => {
  if (!elements) return 0;
  
  return elements
    .filter(el => el.type === "cotisation")
    .reduce((acc, el) => acc + el.montant, 0);
};

/**
 * Get the appropriate color for each type of element
 */
export const getTypeElementColor = (type: string) => {
  switch (type) {
    case "salaire":
      return "text-blue-600 dark:text-blue-400";
    case "prime":
      return "text-green-600 dark:text-green-400";
    case "avantage":
      return "text-purple-600 dark:text-purple-400";
    case "retenue":
      return "text-red-600 dark:text-red-400";
    case "cotisation":
      return "text-orange-600 dark:text-orange-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

/**
 * Get badge component class based on status
 */
export const getStatutBadgeClass = (statut: string) => {
  switch (statut) {
    case "payé":
      return "bg-green-500";
    case "en attente":
      return "text-yellow-600 border-yellow-600";
    case "erreur":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
