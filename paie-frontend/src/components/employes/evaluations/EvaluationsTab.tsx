
import { useState } from "react";
import { Evaluation } from "./types";
import { EvaluationsList } from "./EvaluationsList";
import { EvaluationForm } from "./EvaluationForm";
import EvaluationDetail from "./EvaluationDetail";
import { toast } from "sonner";
import { Employe } from "@/pages/GestionEmployes";

interface EvaluationsTabProps {
  employe: Employe;
  onUpdate: (updatedEmploye: Employe) => void;
}

export const EvaluationsTab = ({ employe, onUpdate }: EvaluationsTabProps) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>(employe.evaluations || []);
  const [view, setView] = useState<"list" | "form" | "detail">("list");
  const [currentEvaluation, setCurrentEvaluation] = useState<Evaluation | null>(null);
  
  const handleCreateEvaluation = () => {
    setCurrentEvaluation(null);
    setView("form");
  };
  
  const handleViewEvaluation = (evaluation: Evaluation) => {
    setCurrentEvaluation(evaluation);
    setView("detail");
  };
  
  const handleEditEvaluation = (evaluation: Evaluation) => {
    setCurrentEvaluation(evaluation);
    setView("form");
  };
  
  const handleCancelForm = () => {
    setView("list");
    setCurrentEvaluation(null);
  };
  
  const handleSubmitEvaluation = (evaluation: Evaluation) => {
    // Si c'est une nouvelle évaluation
    if (!currentEvaluation || !currentEvaluation.id) {
      setEvaluations([...evaluations, evaluation]);
      toast.success("Nouvelle évaluation créée avec succès");
    } else {
      // Si c'est une mise à jour
      setEvaluations(evaluations.map(e => e.id === evaluation.id ? evaluation : e));
      toast.success("Évaluation mise à jour avec succès");
    }
    
    // Mettre à jour l'employé avec les nouvelles évaluations
    const updatedEmploye = {
      ...employe,
      evaluations: [...evaluations.filter(e => !currentEvaluation || e.id !== evaluation.id), evaluation]
    };
    
    // Si c'est une évaluation terminée, mettre à jour le score
    if (evaluation.status === "terminée" && evaluation.noteGlobale) {
      updatedEmploye.evaluationScore = Math.round(evaluation.noteGlobale * 20);
      updatedEmploye.risqueTurnover = evaluation.risqueTurnover || "faible";
    }
    
    onUpdate(updatedEmploye);
    setView("list");
    setCurrentEvaluation(null);
  };
  
  const handleCompleteEvaluation = (updatedEvaluation: Evaluation) => {
    setEvaluations(evaluations.map(e => e.id === updatedEvaluation.id ? updatedEvaluation : e));
    
    // Mettre à jour l'employé avec les nouvelles évaluations et le score d'évaluation
    const updatedEmploye = {
      ...employe,
      evaluations: evaluations.map(e => e.id === updatedEvaluation.id ? updatedEvaluation : e),
      evaluationScore: Math.round(updatedEvaluation.noteGlobale * 20),
      risqueTurnover: updatedEvaluation.risqueTurnover || "faible"
    };
    
    onUpdate(updatedEmploye);
    toast.success("Évaluation terminée avec succès");
    setView("list");
    setCurrentEvaluation(updatedEvaluation);
  };
  
  return (
    <div>
      {view === "list" && (
        <EvaluationsList
          evaluations={evaluations}
          onCreateEvaluation={handleCreateEvaluation}
          onViewEvaluation={handleViewEvaluation}
        />
      )}
      
      {view === "form" && (
        <EvaluationForm
          evaluation={currentEvaluation || undefined}
          employeId={employe.id}
          onSubmit={handleSubmitEvaluation}
          onCancel={handleCancelForm}
        />
      )}
      
      {view === "detail" && currentEvaluation && (
        <EvaluationDetail
          evaluation={currentEvaluation}
          onClose={() => setView("list")}
          onComplete={handleCompleteEvaluation}
          onEdit={handleEditEvaluation}
          onBack={() => setView("list")}
        />
      )}
    </div>
  );
};
