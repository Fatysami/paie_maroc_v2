import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '@/types/user';
import { Company } from '@/types/company';
import { userService, companyService } from '@/utils/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import supabase from '@/utils/supabaseClient';
import { Key, Mail, User as UserIcon } from 'lucide-react';

// Schéma de validation du formulaire
const userSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }).optional().or(z.literal('')),
  role: z.enum(['admin', 'rh', 'manager', 'comptable', 'employee'], {
    required_error: 'Veuillez sélectionner un rôle',
    invalid_type_error: 'Rôle invalide',
  }),
  companyId: z.string({ required_error: 'Entreprise requise' }),
  isActive: z.boolean().default(true),
});

// Type du formulaire
type UserFormValues = z.infer<typeof userSchema>;

const UserForm: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const isEditMode = !!userId;
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const { appUser } = useAuth();
  const navigate = useNavigate();

  // Initialiser le formulaire
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'employee',
      companyId: appUser?.companyId || '',
      isActive: true,
    },
  });

  // Charger les entreprises
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const fetchedCompanies = await companyService.getAllCompanies();
        setCompanies(fetchedCompanies);
      } catch (error: any) {
        toast.error(`Erreur lors du chargement des entreprises: ${error.message}`);
      }
    };

    fetchCompanies();
  }, []);

  // Charger les données de l'utilisateur en mode édition
  useEffect(() => {
    const fetchUserData = async () => {
      if (isEditMode && userId) {
        setLoading(true);
        try {
          const userData = await userService.getUserById(userId);
          if (userData) {
            form.reset({
              email: userData.email,
              password: '', // On ne charge pas le mot de passe pour des raisons de sécurité
              role: userData.role as any, // Fix for type error
              companyId: userData.companyId,
              isActive: userData.isActive,
            });
          }
        } catch (error: any) {
          toast.error(`Erreur lors du chargement des données: ${error.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [isEditMode, userId, form]);

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true);

    try {
      if (isEditMode && userId) {
        // En mode édition
        const updateData: Partial<User> = {
          role: data.role,
          companyId: data.companyId,
          isActive: data.isActive,
        };

        // Si un nouveau mot de passe est fourni
        if (data.password) {
          // Mettre à jour le mot de passe dans Supabase Auth
          const { error: passwordError } = await supabase.auth.updateUser();

          if (passwordError) {
            throw new Error(`Erreur lors de la mise à jour du mot de passe: ${passwordError.message}`);
          }
        }

        // Mettre à jour les autres informations utilisateur
        await userService.updateUser(userId, updateData);
        toast.success('Utilisateur mis à jour avec succès');
        navigate('/users');
      } else {
        // En mode création
        // 1. Créer l'utilisateur dans Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp();

        if (authError) {
          throw new Error(`Erreur lors de la création du compte: ${authError.message}`);
        }

        // 2. Créer le profil utilisateur dans notre table personnalisée
        await userService.createUser({
          email: data.email,
          role: data.role,
          companyId: data.companyId,
          isActive: data.isActive,
          lastLogin: null,
        });

        toast.success('Utilisateur créé avec succès');
        navigate('/users');
      }
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditMode ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="utilisateur@exemple.com"
                        className="pl-10"
                        disabled={isEditMode || loading}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditMode ? 'Nouveau mot de passe (laisser vide pour ne pas modifier)' : 'Mot de passe'}
                  </FormLabel>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={isEditMode ? '••••••••' : 'Minimum 6 caractères'}
                        className="pl-10"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="rh">Ressources Humaines</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="comptable">Comptable</SelectItem>
                        <SelectItem value="employee">Employé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entreprise</FormLabel>
                  <Select
                    disabled={loading || (appUser?.role !== 'admin')}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une entreprise" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      disabled={loading}
                      className="h-4 w-4 rounded border-gray-300 text-blue-primary focus:ring-blue-primary"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">Utilisateur actif</FormLabel>
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button type="submit" disabled={loading} className="mr-2">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement en cours...
                  </>
                ) : (
                  isEditMode ? 'Mettre à jour' : 'Créer l\'utilisateur'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/users')} disabled={loading}>
                Annuler
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
