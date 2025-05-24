
import React from "react";

type BulletinSummaryCardsProps = {
  montantBrut: number;
  montantNet: number;
  calculateTotalCotisations: () => number;
};

const BulletinSummaryCards = ({ 
  montantBrut, 
  montantNet, 
  calculateTotalCotisations 
}: BulletinSummaryCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Salaire brut</div>
        <div className="text-2xl font-bold">{montantBrut.toLocaleString('fr-FR')} MAD</div>
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Total cotisations</div>
        <div className="text-2xl font-bold text-red-500">
          {calculateTotalCotisations().toLocaleString('fr-FR')} MAD
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Net à payer</div>
        <div className="text-2xl font-bold text-green-600">{montantNet.toLocaleString('fr-FR')} MAD</div>
      </div>
    </div>
  );
};

export default BulletinSummaryCards;
