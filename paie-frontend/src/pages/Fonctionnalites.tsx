
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Users,
  Calculator,
  CalendarDays,
  UserCircle,
  FileText,
  Banknote,
  BarChart4,
  Brain,
  Bot,
  Play,
  Check,
  ChevronRight,
  Clock,
  ShieldCheck,
  Sparkles,
  Wallet,
  LineChart,
  BadgeCheck,
  Lightbulb,
  Phone,
  BookOpen,
} from "lucide-react";

const Fonctionnalites = () => {
  const [activeTab, setActiveTab] = useState("rh");

  // Feature categories with their icons and features
  const featureCategories = [
    {
      id: "rh",
      title: "Gestion RH & Employés",
      icon: <Users className="h-6 w-6 text-blue-primary" />,
      features: [
        "Suivi des dossiers salariés (fiche, contrat, historique)",
        "Historique des modifications",
        "Rôles & permissions avancées",
        "Documents, pièces justificatives, pièces sociales",
      ],
    },
    {
      id: "paie",
      title: "Paie Maroc",
      icon: <Calculator className="h-6 w-6 text-blue-primary" />,
      features: [
        "Gestion des salaires fixes et variables",
        "Primes, avantages en nature, retenues",
        "Calcul automatique IR, CNSS, AMO, CIMR (lois 2025)",
        "Génération automatique des bulletins PDF",
      ],
    },
    {
      id: "conges",
      title: "Congés & Absences",
      icon: <CalendarDays className="h-6 w-6 text-blue-primary" />,
      features: [
        "Demande et validation en ligne",
        "Calendrier RH intégré",
        "Gestion des absences justifiées / non justifiées",
        "Impact automatique sur la paie",
      ],
    },
    {
      id: "self",
      title: "Self-Service Employé",
      icon: <UserCircle className="h-6 w-6 text-blue-primary" />,
      features: [
        "Accès aux bulletins, congés, absences",
        "Notifications & alertes",
        "Assistant RH avec IA (à venir)",
      ],
    },
    {
      id: "declarations",
      title: "Déclarations sociales & fiscales",
      icon: <FileText className="h-6 w-6 text-blue-primary" />,
      features: [
        "Export CNSS (Damancom)",
        "Export IR mensuel (Simpl-IR)",
        "Export CIMR",
        "Historique et justificatifs",
      ],
    },
    {
      id: "bancaire",
      title: "Intégration bancaire",
      icon: <Banknote className="h-6 w-6 text-blue-primary" />,
      features: [
        "Génération de fichier CFV (Attijari, BMCE, CIH…)",
        "Suivi des virements par employé",
        "Paiements groupés automatisés",
      ],
    },
    {
      id: "reporting",
      title: "Reporting RH & Analytique",
      icon: <BarChart4 className="h-6 w-6 text-blue-primary" />,
      features: [
        "Masse salariale, turnover, absences, primes",
        "Indicateurs en temps réel",
        "Exports PDF / Excel / PowerPoint",
        "Tableaux de bord dynamiques",
      ],
    },
    {
      id: "simulateur",
      title: "Simulateur de paie intelligent",
      icon: <Brain className="h-6 w-6 text-blue-primary" />,
      features: [
        "Brut → Net / Net → Brut",
        "Respect des barèmes IR & cotisations marocaines",
        "Projection de paie avec IA",
      ],
    },
    {
      id: "assistant",
      title: "Assistant RH IA",
      icon: <Bot className="h-6 w-6 text-blue-primary" />,
      features: [
        "Aide au calcul, réponse aux employés, analyse IR",
        "Alerte sur anomalies RH",
        "Génération automatique de réponses",
      ],
    },
  ];

  // Value proposition data
  const valueProps = [
    {
      title: "Pour les RH",
      benefits: [
        "Gain de temps, conformité",
        "Réduction erreurs",
        "Traçabilité complète",
      ],
      icon: <Clock className="h-10 w-10 text-blue-primary" />,
    },
    {
      title: "Pour les employés",
      benefits: [
        "Autonomie et transparence",
        "Visualisation claire",
        "Accès en ligne",
      ],
      icon: <UserCircle className="h-10 w-10 text-blue-primary" />,
    },
    {
      title: "Pour la direction",
      benefits: [
        "Pilotage stratégique RH",
        "Tableaux de bord",
        "Prévision budgétaire",
      ],
      icon: <LineChart className="h-10 w-10 text-blue-primary" />,
    },
  ];

  const testimonials = [
    {
      quote: "Notre gestion de paie a gagné 70% en efficacité depuis qu'on utilise PaieSimplifiée.",
      author: "Karim Bennani",
      role: "DRH, Société Industrielle Marocaine",
    },
    {
      quote: "Fini les erreurs de calcul IR et CNSS. Le logiciel est toujours à jour avec la législation marocaine.",
      author: "Nadia Tazi",
      role: "Responsable Paie, PME Casablanca",
    },
    {
      quote: "L'intégration bancaire nous fait gagner un temps précieux chaque mois lors des virements de salaires.",
      author: "Mohamed El Alami",
      role: "DAF, Groupe Immobilier",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Section 1: Introduction */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-primary mb-6">
              Toutes vos fonctions RH & Paie, dans un seul outil
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Découvrez une solution puissante, 100% conforme au droit marocain, pensée pour les RH modernes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="text-sm py-1.5 bg-blue-100 text-blue-primary dark:bg-blue-900/30 border-none">
                <ShieldCheck className="h-4 w-4 mr-1" /> Conformité CNSS
              </Badge>
              <Badge className="text-sm py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 border-none">
                <Check className="h-4 w-4 mr-1" /> Conforme IR 2025
              </Badge>
              <Badge className="text-sm py-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 border-none">
                <Sparkles className="h-4 w-4 mr-1" /> IA Intégrée
              </Badge>
              <Badge className="text-sm py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 border-none">
                <Wallet className="h-4 w-4 mr-1" /> Compatible CIMR
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Feature Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-primary">
            Nos fonctionnalités complètes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mr-4">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>

                  <ul className="space-y-2 pl-2">
                    {category.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-cta mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Demo/Video Section */}
      <section className="py-16 bg-blue-50 dark:bg-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-blue-primary">
              Fonctionnalités en action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment notre solution simplifie votre quotidien RH et paie
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white dark:bg-card rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 relative bg-gray-200 dark:bg-gray-800">
              {/* Placeholder for video - in production, replace with actual video */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button variant="outline" size="lg" className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white">
                  <Play className="h-6 w-6 text-blue-primary" />
                  <span className="ml-2">Voir la démo</span>
                </Button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71" 
                alt="Démo du logiciel" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                Découvrez notre suite complète de fonctionnalités
              </h3>
              <p className="text-muted-foreground mb-4">
                Notre solution s'adapte parfaitement à votre entreprise, quelle que soit sa taille, pour une gestion RH et paie sans faille.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Button className="bg-blue-primary hover:bg-blue-primary/90">
                  <Phone className="mr-2 h-4 w-4" /> Demander une démo
                </Button>
                <Button variant="outline" className="border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white">
                  <BookOpen className="mr-2 h-4 w-4" /> Consulter la documentation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Value Proposition */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-blue-primary">
              La valeur ajoutée pour tous vos collaborateurs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une solution qui répond aux besoins de chaque département
            </p>
          </div>

          <Tabs defaultValue="rh" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="rh">Pour les RH</TabsTrigger>
              <TabsTrigger value="employes">Pour les employés</TabsTrigger>
              <TabsTrigger value="direction">Pour la direction</TabsTrigger>
            </TabsList>
            
            {valueProps.map((prop, index) => (
              <TabsContent value={["rh", "employes", "direction"][index]} key={prop.title}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl flex items-center justify-center">
                        {prop.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-4">{prop.title}</h3>
                        <ul className="space-y-3">
                          {prop.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start">
                              <BadgeCheck className="h-5 w-5 text-green-cta mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-lg">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-blue-50 dark:bg-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-blue-primary">
              Ce qu'en disent nos clients
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des entreprises marocaines qui nous font confiance
            </p>
          </div>

          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="bg-white dark:bg-card rounded-xl shadow p-8 text-center mx-4">
                    <div className="mb-6 text-blue-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                      </svg>
                    </div>
                    <p className="text-lg mb-6 italic">{testimonial.quote}</p>
                    <div>
                      <p className="font-semibold text-blue-primary">{testimonial.author}</p>
                      <p className="text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-6">
              <CarouselPrevious className="relative mr-2 left-0" />
              <CarouselNext className="relative ml-2 right-0" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Section 5: Call to Action */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-gradient-to-bl from-green-100/40 to-transparent dark:from-green-900/10 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/3 bg-gradient-to-tr from-blue-100/30 to-transparent dark:from-blue-900/10 rounded-tr-full"></div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-blue-primary">
              Prêt à simplifier votre paie au Maroc ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Rejoignez plus de 500 entreprises marocaines qui font confiance à PaieSimplifiée pour leur gestion RH et paie.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/signup">
                <Button className="bg-green-cta text-white hover:bg-green-cta/90 px-6 py-6 text-lg w-full sm:w-auto">
                  Essayez gratuitement pendant 14 jours
                </Button>
              </Link>
              <Button variant="outline" className="border-blue-primary text-blue-primary hover:bg-blue-primary hover:text-white px-6 py-6 text-lg w-full sm:w-auto">
                <Phone className="mr-2 h-5 w-5" />
                Demander un appel avec un conseiller
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Badge className="px-4 py-2 bg-white dark:bg-card border shadow-sm">
                <ShieldCheck className="h-5 w-5 mr-2 text-blue-primary" />
                Conformité CNSS & IR
              </Badge>
              <Badge className="px-4 py-2 bg-white dark:bg-card border shadow-sm">
                <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                Support expert RH
              </Badge>
              <Badge className="px-4 py-2 bg-white dark:bg-card border shadow-sm">
                <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                IA Intégrée
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Fonctionnalites;
