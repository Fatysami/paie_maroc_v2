
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import PlansComparison from '@/components/subscription/PlansComparison';
import { ChevronLeft } from 'lucide-react';

const AbonnementPlans = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/tarifs" className="inline-flex items-center text-blue-primary hover:underline mb-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour aux tarifs
            </Link>
            <h1 className="text-3xl font-bold text-blue-primary">Choisissez votre plan d'abonnement</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Sélectionnez l'option qui correspond le mieux aux besoins de votre entreprise.
            </p>
          </div>
          
          <PlansComparison 
            buttonText="Choisir et continuer" 
            className="mb-12"
          />
          
          <div className="bg-muted/40 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-medium mb-4">Questions fréquentes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Puis-je changer de plan plus tard ?</h3>
                <p className="text-muted-foreground">Oui, vous pouvez passer à un plan supérieur à tout moment. Le changement prend effet immédiatement et nous ajustons votre facturation au prorata.</p>
              </div>
              <div>
                <h3 className="font-medium">Comment fonctionne la facturation annuelle ?</h3>
                <p className="text-muted-foreground">Les plans annuels sont facturés en une seule fois pour l'année entière. En choisissant l'option annuelle, vous bénéficiez d'une remise de 10% par rapport au paiement mensuel.</p>
              </div>
              <div>
                <h3 className="font-medium">Que se passe-t-il si je dépasse les limites de mon plan ?</h3>
                <p className="text-muted-foreground">Vous recevrez une notification vous informant que vous avez atteint les limites de votre plan actuel. Vous pourrez alors choisir de passer à un plan supérieur ou de rester sur votre plan actuel.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AbonnementPlans;
