
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 w-1/3 h-1/3 bg-gradient-to-bl from-blue-100/40 to-transparent dark:from-blue-900/20 rounded-bl-full" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/4 h-1/4 bg-gradient-to-tr from-green-100/30 to-transparent dark:from-green-900/10 rounded-tr-full" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text content */}
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-primary mb-6 leading-tight">
              Gérez votre paie en toute simplicité et conformité au Maroc !
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Un logiciel performant pour automatiser la gestion de paie, déclarations sociales et fiscales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/inscription">
                <Button className="bg-green-cta text-white hover:bg-green-cta/90 px-8 py-6 text-lg">
                  Essayer gratuitement
                </Button>
              </Link>
              <Link to="/fonctionnalites">
                <Button variant="outline" className="border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white px-8 py-6 text-lg">
                  Voir les fonctionnalités
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Image/Illustration */}
          <div className="lg:w-1/2 lg:pl-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full -z-10" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-full -z-10" />
              <img 
                src="/lovable-uploads/51339b58-4037-4593-8c25-2e98706d1983.png" 
                alt="Professionnels marocains travaillant sur la gestion de paie" 
                className="rounded-2xl shadow-xl w-full object-cover h-[400px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
