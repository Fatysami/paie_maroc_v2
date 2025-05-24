
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const APropos = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-20 mt-16">
        <h1 className="text-4xl font-bold text-blue-primary mb-8 text-center">À Propos de Nous</h1>
        <p className="text-center text-lg mb-12">Page en construction. Découvrez bientôt notre histoire et notre mission.</p>
      </main>
      <Footer />
    </div>
  );
};

export default APropos;
