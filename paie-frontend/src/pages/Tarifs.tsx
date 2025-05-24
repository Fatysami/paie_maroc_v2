
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlansComparison from "@/components/subscription/PlansComparison";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";

const Tarifs = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20 mt-16">
        <div className="container mx-auto px-4 mb-12">
          <h1 className="text-4xl font-bold text-blue-primary mb-4 text-center">Nos Tarifs</h1>
          <p className="text-center text-lg mb-12">Choisissez le plan qui correspond le mieux aux besoins de votre entreprise.</p>
        
          <PlansComparison className="mb-12" />
        </div>
        
        <div className="bg-secondary/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Tous nos plans incluent</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Calcul automatique des paies",
                  description: "Toutes les primes, cotisations et retenues sont calculées automatiquement."
                },
                {
                  title: "Bulletins de paie conformes",
                  description: "Génération de bulletins conformes à la législation marocaine."
                },
                {
                  title: "Mises à jour légales automatiques",
                  description: "Nous mettons à jour le système lors des changements législatifs."
                },
                {
                  title: "Support client",
                  description: "Une équipe d'experts à votre service pour répondre à vos questions."
                }
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4">
                  <div className="h-12 w-12 rounded-full bg-green-cta/10 flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-green-cta" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {[
              {
                question: "Comment choisir le bon plan pour mon entreprise ?",
                answer: "Evaluez le nombre d'employés et d'utilisateurs dont vous avez besoin, ainsi que les fonctionnalités requises. Notre plan Basique est idéal pour les petites structures, le plan Pro pour les PME en croissance, et l'Entreprise pour les grandes organisations."
              },
              {
                question: "Puis-je changer de plan à tout moment ?",
                answer: "Oui, vous pouvez upgrader votre plan à tout moment. Le changement prend effet immédiatement et la facturation est ajustée au prorata. Pour passer à un plan inférieur, le changement prendra effet à la prochaine période de facturation."
              },
              {
                question: "Comment fonctionne la période d'essai ?",
                answer: "Tous les nouveaux comptes bénéficient d'une période d'essai gratuite de 14 jours avec toutes les fonctionnalités du plan Pro. Aucune carte bancaire n'est requise pour commencer l'essai."
              },
              {
                question: "Est-ce que je peux annuler mon abonnement ?",
                answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. L'accès à la plateforme sera maintenu jusqu'à la fin de la période déjà payée."
              }
            ].map((faq, index) => (
              <div key={index}>
                <h3 className="text-xl font-medium mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
                {index < 3 && <Separator className="mt-8" />}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tarifs;
