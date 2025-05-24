
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Gratuit",
    price: "0 MAD",
    description: "Idéal pour les auto-entrepreneurs et petites structures",
    features: [
      "Jusqu'à 5 employés",
      "Calcul de paie basique",
      "Bulletins de paie standards",
      "Support par email",
      "1 utilisateur"
    ],
    highlighted: false,
    buttonText: "Commencer gratuitement",
    buttonVariant: "outline" as const
  },
  {
    name: "Standard",
    price: "499 MAD",
    period: "/mois",
    description: "Parfait pour les PME et entreprises en croissance",
    features: [
      "Jusqu'à 50 employés",
      "Calcul de paie avancé (IR, CNSS, AMO)",
      "Déclarations sociales et fiscales",
      "Exports PDF et Excel",
      "Support prioritaire",
      "3 utilisateurs"
    ],
    highlighted: true,
    buttonText: "Essayer pendant 14 jours",
    buttonVariant: "default" as const
  },
  {
    name: "Premium",
    price: "999 MAD",
    period: "/mois",
    description: "Pour les grandes entreprises avec des besoins complexes",
    features: [
      "Employés illimités",
      "Toutes les fonctionnalités Standard",
      "Intégration avec les systèmes bancaires",
      "API pour connecter vos outils",
      "Support dédié 24/7",
      "Utilisateurs illimités"
    ],
    highlighted: false,
    buttonText: "Contacter l'équipe commerciale",
    buttonVariant: "outline" as const
  }
];

const PricingSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/50 dark:from-background dark:to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-primary mb-4">
            Tarifs flexibles et transparents
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choisissez le plan qui convient à votre entreprise. Tous les plans incluent des mises à jour régulières.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-background rounded-2xl p-8 transition-all duration-300 border ${
                plan.highlighted 
                ? 'shadow-xl scale-105 border-blue-primary ring-2 ring-blue-primary ring-opacity-20 z-10' 
                : 'shadow-md hover:shadow-lg'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-green-cta text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Populaire
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-blue-primary">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  )}
                </div>
                <p className="text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-cta flex-shrink-0 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                <Link to="/inscription" className="w-full block">
                  <Button 
                    variant={plan.buttonVariant} 
                    className={`w-full ${
                      plan.highlighted 
                      ? 'bg-green-cta hover:bg-green-cta/90 text-white' 
                      : plan.buttonVariant === 'outline' 
                        ? 'border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white' 
                        : ''
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
