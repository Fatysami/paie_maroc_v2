
import { 
  Calculator, 
  Users, 
  FileText, 
  FileSpreadsheet, 
  FileOutput, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: <Calculator className="h-8 w-8 text-blue-primary" />,
    title: "Automatisation de la paie",
    description: "Calcul automatique de l'IR, CNSS, AMO et autres cotisations conformément à la législation marocaine."
  },
  {
    icon: <Users className="h-8 w-8 text-blue-primary" />,
    title: "Gestion des employés",
    description: "Gérez facilement les informations des employés, contrats, congés et absences en un seul endroit."
  },
  {
    icon: <FileText className="h-8 w-8 text-blue-primary" />,
    title: "Déclarations fiscales et sociales",
    description: "Générez automatiquement vos déclarations CNSS, CIMR, IR et autres obligations légales."
  },
  {
    icon: <FileSpreadsheet className="h-8 w-8 text-blue-primary" />,
    title: "Bulletins de paie",
    description: "Création et envoi automatiques des bulletins de paie personnalisés pour chaque employé."
  },
  {
    icon: <FileOutput className="h-8 w-8 text-blue-primary" />,
    title: "Export multi-formats",
    description: "Exportez facilement vos données en PDF, Excel ou intégrez-les directement avec votre banque."
  },
  {
    icon: <Shield className="h-8 w-8 text-blue-primary" />,
    title: "Conformité garantie",
    description: "Restez conforme aux évolutions législatives avec des mises à jour régulières du système."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-secondary/50 dark:bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-primary mb-4">
            Fonctionnalités Clés
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Notre solution offre tous les outils nécessaires pour simplifier la gestion de votre paie au Maroc.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-background rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border"
            >
              <div className="bg-primary/5 dark:bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-primary">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
