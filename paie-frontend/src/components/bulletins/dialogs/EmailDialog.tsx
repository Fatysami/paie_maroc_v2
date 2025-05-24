
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface EmailOptions {
  message: string;
  ccRH: boolean;
}

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onConfirm: (options: EmailOptions) => void;
}

const EmailDialog: React.FC<EmailDialogProps> = ({
  open,
  onOpenChange,
  onConfirm
}) => {
  const [emailOptions, setEmailOptions] = useState<EmailOptions>({
    message: "Veuillez trouver ci-joint votre bulletin de paie.",
    ccRH: true
  });

  const handleConfirm = () => {
    onConfirm(emailOptions);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Envoyer les bulletins par email</DialogTitle>
          <DialogDescription>
            Les bulletins seront envoyés aux adresses email des employés sélectionnés.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email-message">Message personnalisé</Label>
            <Textarea 
              id="email-message" 
              value={emailOptions.message}
              onChange={(e) => setEmailOptions({...emailOptions, message: e.target.value})}
              placeholder="Message qui accompagnera l'envoi des bulletins"
              className="min-h-[100px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cc-rh" 
              checked={emailOptions.ccRH}
              onCheckedChange={(checked) => 
                setEmailOptions({...emailOptions, ccRH: !!checked})
              }
            />
            <Label htmlFor="cc-rh">Envoyer une copie au service RH</Label>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleConfirm}>
            Envoyer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;
