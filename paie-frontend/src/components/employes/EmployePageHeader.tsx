
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface EmployePageHeaderProps {
  employeCount: number;
  onAddDialogOpenChange: (open: boolean) => void;
  isAddDialogOpen: boolean;
}

const EmployePageHeader = ({ 
  employeCount, 
  onAddDialogOpenChange, 
  isAddDialogOpen 
}: EmployePageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-blue-primary">Gestion des Employés</h1>
        <p className="text-muted-foreground">
          Gérez efficacement votre personnel avec l'aide de l'IA
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Dialog open={isAddDialogOpen} onOpenChange={onAddDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-blue-primary hover:bg-blue-primary/90">
              <UserPlus size={16} className="mr-2" />
              Ajouter un employé
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </div>
  );
};

export default EmployePageHeader;
