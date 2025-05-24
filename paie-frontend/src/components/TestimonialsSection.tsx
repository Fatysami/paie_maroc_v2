
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Mohammed Alami",
    position: "Directeur RH, TechMaroc",
    content: "Ce logiciel a révolutionné notre gestion de paie. Nous avons économisé plus de 20 heures par mois et éliminé les erreurs de calcul. Un outil indispensable pour toute entreprise marocaine !",
    rating: 5,
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Fatima Benali",
    position: "Comptable, SoluMed",
    content: "La simplicité d'utilisation combinée à la puissance des fonctionnalités est impressionnante. Les déclarations fiscales qui me prenaient des jours sont maintenant générées en quelques clics.",
    rating: 5,
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "Karim Benjelloun",
    position: "Gérant, KBConsulting",
    content: "Un excellent rapport qualité-prix. Le support client est réactif et l'interface intuitive. Je recommande vivement à toutes les PME marocaines soucieuses de gagner du temps.",
    rating: 4,
    imageUrl: "https://randomuser.me/api/portraits/men/67.jpg"
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-primary mb-4">
            Ce que nos clients disent
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment notre solution aide les entreprises marocaines à simplifier leur gestion de paie.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-background rounded-2xl shadow-lg p-8 border">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img 
                    src={testimonials[activeIndex].imageUrl} 
                    alt={testimonials[activeIndex].name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-center">
                  {testimonials[activeIndex].name}
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-3">
                  {testimonials[activeIndex].position}
                </p>
                <div className="flex">
                  {renderStars(testimonials[activeIndex].rating)}
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                <blockquote className="text-lg italic">
                  "{testimonials[activeIndex].content}"
                </blockquote>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 gap-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeIndex ? 'bg-blue-primary' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Témoignage ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 -left-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-background h-10 w-10"
                onClick={handlePrev}
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 -right-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-background h-10 w-10"
                onClick={handleNext}
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
