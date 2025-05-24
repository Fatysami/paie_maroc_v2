
import { useState, useEffect, useCallback } from "react";
import { CheckCircle, AlertTriangle, XCircle, Send, X, Check } from "lucide-react";
import { Evaluation, Critere } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface EvaluationDetailProps {
  evaluation: Evaluation;
  onComplete: (evaluation: Evaluation) => void;
  onClose: () => void;
  onBack?: () => void;
  onEdit?: (evaluation: Evaluation) => void;
}

export const EvaluationDetail = ({ evaluation, onComplete, onClose, onBack, onEdit }: EvaluationDetailProps) => {
  const [notes, setNotes] = useState<Record<string, number>>({});
  const [commentaires, setCommentaires] = useState<Record<string, string>>({});
  const [signatureEmploye, setSignatureEmploye] = useState<boolean | string>(evaluation.signatureEmploye || false);
  const [signatureManager, setSignatureManager] = useState<boolean>(evaluation.signatureManager || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  
  useEffect(() => {
    // Initialize notes and commentaires from evaluation data
    const initialNotes: Record<string, number> = {};
    const initialCommentaires: Record<string, string> = {};
    
    evaluation.criteres.forEach(critere => {
      initialNotes[critere.id] = critere.note || 0;
      initialCommentaires[critere.id] = critere.commentaire || "";
    });
    
    setNotes(initialNotes);
    setCommentaires(initialCommentaires);
  }, [evaluation]);
  
  const handleNoteChange = (critereId: string, value: number) => {
    setNotes(prevNotes => ({
      ...prevNotes,
      [critereId]: value
    }));
  };
  
  const handleCommentaireChange = (critereId: string, value: string) => {
    setCommentaires(prevCommentaires => ({
      ...prevCommentaires,
      [critereId]: value
    }));
  };
  
  const isEvaluationComplete = useCallback(() => {
    return evaluation.criteres.every(critere => {
      const note = notes[critere.id];
      return note !== undefined && note !== null;
    });
  }, [evaluation, notes]);
  
  const handleCompleteEvaluation = async () => {
    setIsSubmitting(true);
    
    // Prepare updated criteres with notes and commentaires
    const updatedCriteres = evaluation.criteres.map(critere => ({
      ...critere,
      note: notes[critere.id] || 0,
      commentaire: commentaires[critere.id] || ""
    }));
    
    // Create a new evaluation object with updated criteres and signatures
    const updatedEvaluation: Evaluation = {
      ...evaluation,
      criteres: updatedCriteres,
      signatureEmploye: signatureEmploye,
      signatureManager: signatureManager
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Call the onComplete callback
    onComplete(updatedEvaluation);
    
    // Show success toast
    toast.success("Évaluation complétée avec succès!");
    
    setIsSubmitting(false);
    onClose();
  };
  
  const handleSignEvaluation = () => {
    setIsConfirmationOpen(true);
  };
  
  const handleConfirmSign = () => {
    setSignatureEmploye(true);
    setIsConfirmationOpen(false);
    toast.success("Évaluation signée par l'employé!");
  };
  
  const handleCancelSign = () => {
    setIsConfirmationOpen(false);
  };
  
  const isNoteInvalid = (critereId: string): boolean => {
    const note = notes[critereId];
    if (note === undefined || isNaN(note)) return true;
    return note < 0 || note > 5;
  };
  
  const canSign = () => {
    if (!isEvaluationComplete()) return false;
    // Fixed type comparison by checking for boolean value
    if (signatureEmploye === true) return true;
    return false;
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{evaluation.titre}</DialogTitle>
          <DialogDescription>
            {evaluation.description || ""}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {evaluation.criteres.map((critere) => (
            <div key={critere.id} className="border rounded-md p-4">
              <Label htmlFor={`note-${critere.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                {critere.nom}
              </Label>
              <div className="flex items-center space-x-2 mt-2">
                <Input
                  type="number"
                  id={`note-${critere.id}`}
                  placeholder="Note (0-5)"
                  min="0"
                  max="5"
                  value={notes[critere.id] !== undefined ? notes[critere.id] : ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    handleNoteChange(critere.id, value);
                  }}
                  className="w-24"
                />
                {isNoteInvalid(critere.id) && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
              
              <Textarea
                placeholder="Commentaires"
                value={commentaires[critere.id] || ""}
                onChange={(e) => handleCommentaireChange(critere.id, e.target.value)}
                className="mt-2"
              />
            </div>
          ))}
        </div>
        
        <DialogFooter className="mt-8">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
          </DialogClose>
          
          {canSign() ? (
            <Button type="button" onClick={handleSignEvaluation}>
              <Send className="h-4 w-4 mr-2" />
              Signer l'évaluation
            </Button>
          ) : (
            <Button type="button" onClick={handleCompleteEvaluation} disabled={isSubmitting || !isEvaluationComplete()}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Soumission...
                </>
              ) : (
                <>
                  Compléter l'évaluation
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
      
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmation de signature</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir signer cette évaluation ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleCancelSign}>
              Annuler
            </Button>
            <Button type="button" onClick={handleConfirmSign}>
              Confirmer et signer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default EvaluationDetail;
