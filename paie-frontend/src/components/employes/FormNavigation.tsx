
import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  activeTab: string;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

const FormNavigation = ({ 
  activeTab, 
  onPrevious, 
  onNext, 
  onCancel, 
  isLastStep, 
  isFirstStep 
}: FormNavigationProps) => {
  return (
    <div className="flex justify-between pt-2">
      {!isFirstStep ? (
        <Button type="button" variant="outline" onClick={onPrevious}>
          Précédent
        </Button>
      ) : (
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      )}
      
      {!isLastStep ? (
        <Button type="button" onClick={onNext}>
          Suivant
        </Button>
      ) : (
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Ajouter l'employé
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
