
import React from "react";
import { Navigate } from "react-router-dom";
import AssistantButton from "@/components/chatbot/AssistantButton";

// Cette page redirige simplement vers le tableau de bord employé
const EspaceEmploye = () => {
  // Simulons un état d'authentification (à remplacer par votre logique d'authentification réelle)
  const isAuthenticated = true; // À remplacer par votre logique d'authentification

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Add the AI Assistant to the employee space
  return (
    <>
      <Navigate to="/espace-employe/tableau-de-bord" replace />
      <AssistantButton isEmployee={true} />
    </>
  );
};

export default EspaceEmploye;
