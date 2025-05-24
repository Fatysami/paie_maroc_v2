
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/utils/supabaseClient';

const formSchema = z.object({
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide' })
});

type FormData = z.infer<typeof formSchema>;

const MotDePasseOublie: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Simulating password reset request for:', data.email);

      // In static data mode, just simulate a success response
      setTimeout(() => {
        setIsSubmitted(true);
        toast.success("Si cette adresse email est associée à un compte, un email de réinitialisation sera envoyé.");
        setIsLoading(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la demande de réinitialisation.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-4 mt-16">
        <div className="w-full max-w-md">
          <Card className="border-blue-primary/20 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold text-blue-primary">
                Mot de passe oublié
              </CardTitle>
              {!isSubmitted && (
                <CardDescription>
                  Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {isSubmitted ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto my-4 bg-blue-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-blue-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Vérifiez votre boîte mail</h3>
                  <p className="text-sm text-muted-foreground">
                    Nous avons envoyé un lien de réinitialisation à <strong>{form.getValues().email}</strong>.
                    Suivez les instructions dans l'email pour réinitialiser votre mot de passe.
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Si vous ne recevez pas d'email dans les prochaines minutes, vérifiez votre
                    dossier spam ou essayez à nouveau avec une autre adresse email.
                  </p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse email</FormLabel>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                placeholder="nom@exemple.com"
                                className="pl-10"
                                type="email"
                                autoComplete="email"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="w-full bg-blue-primary hover:bg-blue-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Envoi en cours...
                        </span>
                      ) : (
                        "Envoyer les instructions"
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link
                to="/connexion"
                className="text-sm font-medium text-blue-primary hover:underline inline-flex items-center"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Retour à la connexion
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MotDePasseOublie;
