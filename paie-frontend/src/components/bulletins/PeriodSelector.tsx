
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PeriodSelectorProps {
  periodeSelectionne: string;
  setPeriodeSelectionne: (value: string) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ periodeSelectionne, setPeriodeSelectionne }) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="periode" className="whitespace-nowrap">Période:</Label>
      <Select 
        value={periodeSelectionne} 
        onValueChange={setPeriodeSelectionne}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sélectionner une période" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2023-04">Avril 2023</SelectItem>
          <SelectItem value="2023-03">Mars 2023</SelectItem>
          <SelectItem value="2023-02">Février 2023</SelectItem>
          <SelectItem value="2023-01">Janvier 2023</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PeriodSelector;
