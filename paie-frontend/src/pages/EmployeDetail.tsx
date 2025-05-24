import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  User, 
  FileText, 
  DollarSign, 
  Calendar, 
  Clock, 
  Settings,
  PencilRuler,
  BarChart4,
  History,
  Send,
  ArrowLeftCircle,
  Check,
  X,
  MoreVertical,
  Pencil,
  Trash2,
  UserCheck,
  Award,
  GraduationCap,
  BookText,
  Briefcase
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption
} from "@/components/ui/table";
import {
  Alert,
  AlertTitle,
  AlertDescription
} from "@/components/ui/alert";

import Navbar from "@/components/DashboardNavbar";
import { Employe, ContractType, EmployeStatus, ModePaiement } from "./GestionEmployes";
import DetailPrimesAvantages from "@/components/employes/DetailPrimesAvantages";
import DetailDocuments from "@/components/employes/DetailDocuments";
import { Adresse } from "@/components/employes/EmployeAdresseForm";
import InformationsTab from "@/components/employes/tabs/InformationsTab";
import { EvaluationsTab } from "@/components/employes/evaluations/EvaluationsTab";
import { PerformanceSummary } from "@/components/employes/evaluations/PerformanceSummary";
import { PerformanceGraph } from "@/components/employes/evaluations/PerformanceGraph";
import { Evaluation } from "@/components/employes/evaluations/types";
import HistoriqueTab from "@/components/employes/historique/HistoriqueTab";
import HistoriqueDetailleTab from "@/components/employes/historique/HistoriqueDetailleTab";
import PaieTab from "@/components/employes/tabs/PaieTab";
import AdminChargesSalarialesTab from "@/components/employes/paie/AdminChargesSalarialesTab";
import CongesCalendrierShared, { CongeEmploye } from "@/components/shared/conges/CongesCalendrierShared";
import { generateMockConges } from "@/utils/conges/mockData";

const mockEmployes: Record<string, Employe> = {
  "1": {
    id: "1",
    nom: "Alami",
    prenom: "Mohammed",
    matricule: "EMP001",
    cin: "BE123456",
    email: "m.alami@example.com",
    telephone: "0612345678",
    adresse: {
      rue: "123 Rue de Casablanca",
      ville: "Casablanca",
      pays: "Maroc",
      codePostal: "20000"
    },
    dateEmbauche: "2021-05-15",
    poste: "Développeur Full-Stack",
    departement: "IT",
    typeContrat: "CDI",
    salaire: 12000,
    salaireBase: 12000,
    status: "Actif",
    situationFamiliale: "Marié(e), 2 enfants",
    competences: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    certifications: ["AWS Certified Developer", "MERN Stack"],
    diplomes: ["Master en Informatique"],
    evaluationScore: 85,
    risqueTurnover: "faible",
    manager: "Karim Tazi",
    primes: [
      { id: "1", nom: "Prime d'ancienneté", montant: 500, type: "fixe", frequence: "mensuelle" },
      { id: "2", nom: "13ème mois", montant: 12000, type: "fixe", frequence: "annuelle" }
    ],
    avantages: [
      { id: "1", nom: "Mutuelle", type: "autre", valeur: 300, description: "Mutuelle familiale" }
    ],
    documents: {
      contratSigne: true,
      cin: true,
      rib: true
    },
    numeroCnss: "1234567",
    affiliationCnssAmo: true,
    affiliationCimr: true,
    tauxCimr: 6,
    modePaiement: "Virement bancaire",
    rib: "123456789012345678901234",
    banque: "Attijariwafa Bank",
    evaluations: []
  },
  "2": {
    id: "2",
    nom: "Benani",
    prenom: "Salma",
    matricule: "EMP002",
    cin: "BE789012",
    email: "s.benani@example.com",
    telephone: "0623456789",
    adresse: {
      rue: "456 Avenue Mohammed V",
      ville: "Rabat",
      pays: "Maroc",
      codePostal: "10000"
    },
    dateEmbauche: "2022-02-10",
    poste: "Responsable RH",
    departement: "Ressources Humaines",
    typeContrat: "CDI",
    salaire: 15000,
    salaireBase: 15000,
    status: "Actif",
    situationFamiliale: "Célibataire",
    competences: ["Recrutement", "Gestion RH", "SIRH", "Formation"],
    certifications: ["Certification RH", "Leadership"],
    diplomes: ["Master en GRH"],
    evaluationScore: 90,
    risqueTurnover: "faible",
    manager: "Leila Benjelloun",
    primes: [
      { id: "1", nom: "Prime de responsabilité", montant: 2000, type: "fixe", frequence: "mensuelle" }
    ],
    avantages: [],
    documents: {
      contratSigne: true,
      cin: true,
      rib: true
    },
    numeroCnss: "7654321",
    affiliationCnssAmo: true,
    modePaiement: "Virement bancaire",
    banque: "BMCE Bank",
    evaluations: []
  }
};

const mockCongesData = generateMockConges();

const EmployeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { openTab, nouveauEmploye } = location.state || {};
  
  const [employe, setEmploye] = useState<Employe | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(openTab || "info");
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmploye, setEditedEmploye] = useState<Employe | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [showHistorique, setShowHistorique] = useState(false);
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [contractForm, setContractForm] = useState<{
    salaireBase: number;
    typeContrat: ContractType;
    poste: string;
    departement: string;
    dateEmbauche: string;
    dureeContrat: number;
    uniteContrat: string;
  }>({
    salaireBase: 0,
    typeContrat: "CDI",
    poste: "",
    departement: "",
    dateEmbauche: "",
    dureeContrat: 0,
    uniteContrat: "mois"
  });

  useEffect(() => {
    setTimeout(() => {
      if (id && mockEmployes[id]) {
        setEmploye(mockEmployes[id]);
        setEditedEmploye(mockEmployes[id]);
        setContractForm({
          salaireBase: mockEmployes[id].salaireBase || 0,
          typeContrat: mockEmployes[id].typeContrat || "CDI",
          poste: mockEmployes[id].poste || '',
          departement: mockEmployes[id].departement || '',
          dateEmbauche: mockEmployes[id].dateEmbauche || '',
          dureeContrat: typeof mockEmployes[id].dureeContrat === 'string' ? 
            parseInt(mockEmployes[id].dureeContrat) : (mockEmployes[id].dureeContrat || 0),
          uniteContrat: 'mois'
        });
      } else {
        toast.error("Employé non trouvé");
        navigate("/employes");
      }
      setLoading(false);
    }, 500);
  }, [id, navigate]);

  const handleUpdateEmploye = (updatedEmploye: Employe) => {
    import("@/components/employes/historique/utils").then(({ comparerEtEnregistrer, CHAMPS_MAPPING }) => {
      if (employe) {
        comparerEtEnregistrer(
          employe,
          updatedEmploye,
          updatedEmploye.id,
          "admin@rh.com",
          CHAMPS_MAPPING
        );
      }

      setEmploye(updatedEmploye);
      setEditedEmploye(updatedEmploye);
      mockEmployes[updatedEmploye.id] = updatedEmploye;
      toast.success("Informations mises à jour");
    });
  };

  const handleInputChange = (field: string, value: any) => {
    if (!editedEmploye) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      
      const parentObj = editedEmploye[parent as keyof Employe];
      
      if (parentObj && typeof parentObj === 'object' && !Array.isArray(parentObj)) {
        setEditedEmploye({
          ...editedEmploye,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        });
      }
    } else {
      setEditedEmploye({
        ...editedEmploye,
        [field]: value
      });
    }
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    if (!editedEmploye || !Array.isArray(editedEmploye[field as keyof Employe])) return;
    
    const newArray = [...(editedEmploye[field as keyof Employe] as string[])];
    newArray[index] = value;
    
    setEditedEmploye({
      ...editedEmploye,
      [field]: newArray
    });
  };

  const handleAddArrayItem = (field: string, value: string = "") => {
    if (!editedEmploye) return;
    
    const currentArray = editedEmploye[field as keyof Employe] as string[] || [];
    
    setEditedEmploye({
      ...editedEmploye,
      [field]: [...currentArray, value]
    });
  };

  const handleRemoveArrayItem = (field: string, index: number) => {
    if (!editedEmploye || !Array.isArray(editedEmploye[field as keyof Employe])) return;
    
    const newArray = [...(editedEmploye[field as keyof Employe] as string[])];
    newArray.splice(index, 1);
    
    setEditedEmploye({
      ...editedEmploye,
      [field]: newArray
    });
  };

  const handleSaveSection = () => {
    if (!editedEmploye) return;
    handleUpdateEmploye(editedEmploye);
    setEditingSection(null);
  };

  const handleCancelEdit = () => {
    if (!employe) return;
    setEditedEmploye(employe);
    setEditingSection(null);
  };

  const handleEditSection = (section: string) => {
    setEditingSection(section);
  };

  const handleActionClick = (action: string) => {
    if (action === 'export') {
      toast.success("Export des données de l'employé en cours...");
      setTimeout(() => {
        toast.success("Données exportées avec succès");
      }, 1500);
    } else if (action === 'archive') {
      setDialogAction("archive");
      setIsConfirmDialogOpen(true);
    } else if (action === 'delete') {
      setDialogAction("delete");
      setIsConfirmDialogOpen(true);
    } else if (action === 'promote') {
      toast.success("Formulaire de promotion ouvert");
    }
  };

  const handleConfirmAction = () => {
    if (dialogAction === "delete") {
      toast.success("L'employé a été supprimé avec succès");
      navigate("/employes");
    } else if (dialogAction === "archive") {
      toast.success("L'employé a été archivé avec succès");
      if (employe) {
        handleUpdateEmploye({
          ...employe,
          status: "Inactif"
        });
      }
    }
    setIsConfirmDialogOpen(false);
  };

  const handleContractFormChange = (field: string, value: any) => {
    setContractForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveContractInfo = () => {
    if (!employe) return;
    
    const employeBackup = {...employe};
    
    try {
      const updatedContract = {
        ...employe,
        salaireBase: parseFloat(contractForm.salaireBase.toString()),
        typeContrat: contractForm.typeContrat,
        poste: contractForm.poste,
        departement: contractForm.departement,
        dateEmbauche: contractForm.dateEmbauche,
        dureeContrat: contractForm.dureeContrat,
      };
      
      setEmploye(updatedContract);
      setEditedEmploye(updatedContract);
      setIsContractDialogOpen(false);
      
      import("@/components/employes/historique/utils").then(({ comparerEtEnregistrer, CHAMPS_MAPPING }) => {
        comparerEtEnregistrer(
          employeBackup,
          updatedContract,
          updatedContract.id,
          "admin@rh.com",
          CHAMPS_MAPPING
        );
        toast.success("Informations contractuelles mises à jour avec succès");
      });
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la mise à jour des informations contractuelles");
    }
  };

  const handleEditContract = () => {
    if (!employe) return;
    
    setContractForm({
      salaireBase: employe.salaireBase || 0,
      typeContrat: employe.typeContrat,
      poste: employe.poste || '',
      departement: employe.departement || '',
      dateEmbauche: employe.dateEmbauche || '',
      dureeContrat: typeof employe.dureeContrat === 'string' ? 
        parseInt(employe.dureeContrat) : (employe.dureeContrat || 0),
      uniteContrat: 'mois'
    });
    setIsContractDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Actif":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Actif</Badge>;
      case "Inactif":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Inactif</Badge>;
      case "Période d'essai":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Période d'essai</Badge>;
      case "Démissionné":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Démissionné</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getContractBadge = (type: string) => {
    switch (type) {
      case "CDI":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">CDI</Badge>;
      case "CDD":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">CDD</Badge>;
      case "Intérim":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Intérim</Badge>;
      case "Freelance":
        return <Badge variant="outline" className="bg-teal-100 text-teal-800">Freelance</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 2 }).format(amount);
  };

  const renderEditableSection = (section: string, title: string, icon: React.ReactNode, children: React.ReactNode) => {
    const isEditingThisSection = editingSection === section;
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              {icon}
              {title}
            </CardTitle>
            {!isEditingThisSection ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleEditSection(section)}
                className="h-8 px-2"
              >
                <Pencil className="h-4 w-4 mr-1" />
                Modifier
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCancelEdit}
                  className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Annuler
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSaveSection}
                  className="h-8 px-2 text-green-500 hover:text-green-600 hover:bg-green-50"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Enregistrer
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {children}
        </CardContent>
      </Card>
    );
  };

  const renderContractSection = () => {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
              Informations contractuelles
            </CardTitle>
            <DialogTrigger asChild onClick={() => setIsContractDialogOpen(true)}>
              <Button variant="outline" size="sm" className="h-8 px-2">
                <Pencil className="h-4 w-4 mr-1" />
                Modifier le contrat
              </Button>
            </DialogTrigger>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Salaire de base</p>
            <p className="font-medium">{employe?.salaireBase && formatCurrency(employe.salaireBase)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Type de contrat</p>
            <div className="flex items-center gap-2">
              <p className="font-medium">{employe?.typeContrat}</p>
              {getContractBadge(employe?.typeContrat || "")}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Poste</p>
            <p className="font-medium">{employe?.poste}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Département</p>
            <p className="font-medium">{employe?.departement}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date d'embauche</p>
            <p className="font-medium">{employe?.dateEmbauche && formatDate(employe.dateEmbauche)}</p>
          </div>
          {employe?.dureeContrat && (
            <div>
              <p className="text-sm text-muted-foreground">Durée du contrat</p>
              <p className="font-medium">{employe.dureeContrat}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const updateActiveTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === "historique") {
      setShowHistorique(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={{ name: "Mohammed Alami", avatar: "/placeholder.svg", role: "Administrateur RH" }} onLogout={() => navigate("/connexion")} />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse space-y-4">
              <div className="h-12 w-48 bg-gray-200 rounded"></div>
              <div className="h-8 w-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!employe) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={{ name: "Mohammed Alami", avatar: "/placeholder.svg", role: "Administrateur RH" }} onLogout={() => navigate("/connexion")} />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex flex-col items-center justify-center h-64">
            <h1 className="text-2xl font-bold mb-4">Employé non trouvé</h1>
            <Button onClick={() => navigate("/employes")}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={{ name: "Mohammed Alami", avatar: "/placeholder.svg", role: "Administrateur RH" }} onLogout={() => navigate("/connexion")} />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/employes")}
              className="flex items-center space-x-2"
            >
              <ArrowLeftCircle className="h-4 w-4" />
              <span>Retour à la liste</span>
            </Button>
            
            {nouveauEmploye && (
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                Nouvel employé
              </Badge>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 border-2 border-gray-200">
              {employe?.avatar ? (
                <AvatarImage src={employe.avatar} alt={`${employe.prenom} ${employe.nom}`} />
              ) : (
                <AvatarFallback className="text-2xl">{employe?.prenom?.[0]}{employe?.nom?.[0]}</AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{employe?.prenom} {employe?.nom}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="secondary">{employe?.poste}</Badge>
                    <Badge variant="outline">{employe?.departement}</Badge>
                    {getStatusBadge(employe?.status || "")}
                    {getContractBadge(employe?.typeContrat || "")}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer un message
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Actions employé</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleActionClick('export')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Exporter les données
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleActionClick('promote')}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Promouvoir
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleActionClick('archive')} className="text-amber-600">
                        <BarChart4 className="h-4 w-4 mr-2" />
                        Archiver
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleActionClick('delete')} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-blue-50">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Matricule</p>
                    <p className="font-medium">{employe?.matricule}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-green-50">
                    <Calendar className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date d'embauche</p>
                    <p className="font-medium">{employe?.dateEmbauche && formatDate(employe.dateEmbauche)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-amber-50">
                    <DollarSign className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Salaire de base</p>
                    <p className="font-medium">{employe?.salaireBase && formatCurrency(employe.salaireBase)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={updateActiveTab} className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 lg:w-auto">
              <TabsTrigger value="info">Informations</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="paie">Paie</TabsTrigger>
              <TabsTrigger value="compensation">Primes & Avantages</TabsTrigger>
              <TabsTrigger value="conges">Congés & Absences</TabsTrigger>
              <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
              <TabsTrigger value="historique">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderEditableSection(
                  'personal',
                  'Informations personnelles',
                  <User className="h-5 w-5 mr-2 text-blue-500" />,
                  editingSection === 'personal' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Nom</label>
                          <Input 
                            value={editedEmploye?.nom || ''} 
                            onChange={(e) => handleInputChange('nom', e.target.value)} 
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Prénom</label>
                          <Input 
                            value={editedEmploye?.prenom || ''} 
                            onChange={(e) => handleInputChange('prenom', e.target.value)} 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">CIN</label>
                          <Input 
                            value={editedEmploye?.cin || ''} 
                            onChange={(e) => handleInputChange('cin', e.target.value)} 
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Situation familiale</label>
                          <Input 
                            value={editedEmploye?.situationFamiliale || ''} 
                            onChange={(e) => handleInputChange('situationFamiliale', e.target.value)} 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                        <Input 
                          type="email" 
                          value={editedEmploye?.email || ''} 
                          onChange={(e) => handleInputChange('email', e.target.value)} 
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Téléphone</label>
                        <Input 
                          value={editedEmploye?.telephone || ''} 
                          onChange={(e) => handleInputChange('telephone', e.target.value)} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground mb-1 block">Adresse</label>
                        <Input 
                          placeholder="Rue" 
                          value={editedEmploye?.adresse?.rue || ''} 
                          onChange={(e) => handleInputChange('adresse.rue', e.target.value)} 
                          className="mb-2"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input 
                            placeholder="Ville" 
                            value={editedEmploye?.adresse?.ville || ''} 
                            onChange={(e) => handleInputChange('adresse.ville', e.target.value)} 
                          />
                          <Input 
                            placeholder="Code postal" 
                            value={editedEmploye?.adresse?.codePostal || ''} 
                            onChange={(e) => handleInputChange('adresse.codePostal', e.target.value)} 
                          />
                        </div>
                        <Input 
                          placeholder="Pays" 
                          value={editedEmploye?.adresse?.pays || ''} 
                          onChange={(e) => handleInputChange('adresse.pays', e.target.value)} 
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Nom complet</p>
                          <p className="font-medium">{employe?.prenom} {employe?.nom}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">CIN</p>
                          <p className="font-medium">{employe?.cin}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{employe?.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium">{employe?.telephone}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Adresse</p>
                        <p className="font-medium">
                          {employe?.adresse.rue}, {employe?.adresse.ville}, {employe?.adresse.pays}, {employe?.adresse.codePostal}
                        </p>
                      </div>
                      
                      {employe?.situationFamiliale && (
                        <div>
                          <p className="text-sm text-muted-foreground">Situation familiale</p>
                          <p className="font-medium">{employe.situationFamiliale}</p>
                        </div>
                      )}
                    </>
                  )
                )}

                {renderEditableSection(
                  'professional',
                  'Informations professionnelles',
                  <PencilRuler className="h-5 w-5 mr-2 text-purple-500" />,
                  editingSection === 'professional' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Poste</label>
                          <Input 
                            value={editedEmploye?.poste || ''} 
                            onChange={(e) => handleInputChange('poste', e.target.value)} 
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Département</label>
                          <Input 
                            value={editedEmploye?.departement || ''} 
                            onChange={(e) => handleInputChange('departement', e.target.value)} 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Type de contrat</label>
                          <Select 
                            value={editedEmploye?.typeContrat} 
                            onValueChange={(value) => handleInputChange('typeContrat', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CDI">CDI</SelectItem>
                              <SelectItem value="CDD">CDD</SelectItem>
                              <SelectItem value="Intérim">Intérim</SelectItem>
                              <SelectItem value="Freelance">Freelance</SelectItem>
                              <SelectItem value="Stage">Stage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Statut</label>
                          <Select 
                            value={editedEmploye?.status} 
                            onValueChange={(value) => handleInputChange('status', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Actif">Actif</SelectItem>
                              <SelectItem value="Inactif">Inactif</SelectItem>
                              <SelectItem value="Période d'essai">Période d'essai</SelectItem>
                              <SelectItem value="Démissionné">Démissionné</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Date d'embauche</label>
                          <Input 
                            type="date" 
                            value={editedEmploye?.dateEmbauche || ''} 
                            onChange={(e) => handleInputChange('dateEmbauche', e.target.value)} 
                          />
                        </div>
                        {editedEmploye?.typeContrat === 'CDD' && (
                          <div>
                            <label className="text-sm text-muted-foreground mb-1 block">Date de fin de contrat</label>
                            <Input 
                              type="date" 
                              value={editedEmploye?.dateFinContrat || ''} 
                              onChange={(e) => handleInputChange('dateFinContrat', e.target.value)} 
                            />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Manager</label>
                        <Input 
                          value={editedEmploye?.manager || ''} 
                          onChange={(e) => handleInputChange('manager', e.target.value)} 
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Poste</p>
                          <p className="font-medium">{employe?.poste}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Département</p>
                          <p className="font-medium">{employe?.departement}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Type de contrat</p>
                          <p className="font-medium">{employe?.typeContrat}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Statut</p>
                          <p className="font-medium">{employe?.status}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Date d'embauche</p>
                          <p className="font-medium">{employe?.dateEmbauche && formatDate(employe.dateEmbauche)}</p>
                        </div>
                        {employe?.dateFinContrat && (
                          <div>
                            <p className="text-sm text-muted-foreground">Date de fin de contrat</p>
                            <p className="font-medium">{formatDate(employe.dateFinContrat)}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Manager</p>
                        <p className="font-medium">{employe?.manager}</p>
                      </div>
                    </>
                  )
                )}

                {/* Nouvelle section: Compétences */}
                {renderEditableSection(
                  'competences',
                  'Compétences',
                  <Award className="h-5 w-5 mr-2 text-amber-500" />,
                  editingSection === 'competences' ? (
                    <div className="space-y-4">
                      <label className="text-sm text-muted-foreground mb-1 block">Compétences</label>
                      <div className="space-y-2">
                        {editedEmploye?.competences && editedEmploye.competences.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input 
                              value={skill} 
                              onChange={(e) => handleArrayChange('competences', index, e.target.value)} 
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => handleRemoveArrayItem('competences', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleAddArrayItem('competences')}
                        >
                          + Ajouter une compétence
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Compétences</p>
                      <div className="flex flex-wrap gap-2">
                        {(employe?.competences || []).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="py-1">{skill}</Badge>
                        ))}
                        {!employe?.competences?.length && (
                          <p className="text-sm text-muted-foreground">Aucune compétence renseignée</p>
                        )}
                      </div>
                    </div>
                  )
                )}

                {/* Nouvelle section: Certifications */}
                {renderEditableSection(
                  'certifications',
                  'Certifications',
                  <BookText className="h-5 w-5 mr-2 text-green-500" />,
                  editingSection === 'certifications' ? (
                    <div className="space-y-4">
                      <label className="text-sm text-muted-foreground mb-1 block">Certifications</label>
                      <div className="space-y-2">
                        {editedEmploye?.certifications && editedEmploye.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input 
                              value={cert} 
                              onChange={(e) => handleArrayChange('certifications', index, e.target.value)} 
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => handleRemoveArrayItem('certifications', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleAddArrayItem('certifications')}
                        >
                          + Ajouter une certification
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Certifications</p>
                      <div className="space-y-2">
                        {(employe?.certifications || []).map((cert, index) => (
                          <div key={index} className="p-2 border rounded-md">
                            <p className="font-medium">{cert}</p>
                          </div>
                        ))}
                        {!employe?.certifications?.length && (
                          <p className="text-sm text-muted-foreground">Aucune certification renseignée</p>
                        )}
                      </div>
                    </div>
                  )
                )}

                {/* Nouvelle section: Formation */}
                {renderEditableSection(
                  'formation',
                  'Formation',
                  <GraduationCap className="h-5 w-5 mr-2 text-blue-500" />,
                  editingSection === 'formation' ? (
                    <div className="space-y-4">
                      <label className="text-sm text-muted-foreground mb-1 block">Diplômes et formations</label>
                      <div className="space-y-2">
                        {editedEmploye?.diplomes && editedEmploye.diplomes.map((diplome, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input 
                              value={diplome} 
                              onChange={(e) => handleArrayChange('diplomes', index, e.target.value)} 
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => handleRemoveArrayItem('diplomes', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleAddArrayItem('diplomes')}
                        >
                          + Ajouter un diplôme
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Diplômes et formations</p>
                      <div className="space-y-2">
                        {(employe?.diplomes || []).map((diplome, index) => (
                          <div key={index} className="p-3 border rounded-md">
                            <p className="font-medium">{diplome}</p>
                          </div>
                        ))}
                        {!employe?.diplomes?.length && (
                          <p className="text-sm text-muted-foreground">Aucun diplôme renseigné</p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="documents">
              <DetailDocuments 
                employe={employe} 
                onUpdate={handleUpdateEmploye}
              />
            </TabsContent>
            
            <TabsContent value="paie">
              {employe && (
                <div className="space-y-8">
                  <PaieTab employe={employe} onUpdate={handleUpdateEmploye} />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="compensation">
              <DetailPrimesAvantages 
                employe={employe} 
                onUpdate={handleUpdateEmploye}
              />
            </TabsContent>
            
            <TabsContent value="conges">
              {employe && (
                <Tabs defaultValue="calendrier" className="w-full mt-4">
                  <TabsList className="mb-4">
                    <TabsTrigger value="calendrier">Calendrier des congés</TabsTrigger>
                    <TabsTrigger value="historique">Historique des absences</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="calendrier">
                    <CongesCalendrierShared 
                      congesData={mockCongesData as CongeEmploye[]}
                      isAdmin={true}
                      employeNom={`${employe.prenom} ${employe.nom}`}
                      onAction={(action, congeId) => {
                        toast.success(`Action ${action} sur la demande ${congeId}`);
                      }}
                    />
                  </TabsContent>
                  
                  <TabsContent value="historique">
                    <Card className="shadow-md">
                      <CardHeader>
                        <CardTitle className="text-lg">Historique des absences</CardTitle>
                        <CardDescription>
                          Toutes les demandes de congés et absences passées
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {mockCongesData.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Période</TableHead>
                                <TableHead>Jours</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {mockCongesData.map((conge) => (
                                <TableRow key={conge.id} className="hover:bg-gray-50">
                                  <TableCell className="font-medium">{conge.type}</TableCell>
                                  <TableCell>
                                    {format(conge.dateDebut, "dd/MM/yyyy")} - {format(conge.dateFin, "dd/MM/yyyy")}
                                  </TableCell>
                                  <TableCell>{conge.nombreJours}</TableCell>
                                  <TableCell>
                                    {conge.statut === "validé" && (
                                      <Badge className="bg-green-100 text-green-800 font-medium border-0">Validé</Badge>
                                    )}
                                    {conge.statut === "en attente" && (
                                      <Badge className="bg-yellow-100 text-yellow-800 font-medium border-0">En attente</Badge>
                                    )}
                                    {conge.statut === "refusé" && (
                                      <Badge className="bg-red-100 text-red-800 font-medium border-0">Refusé</Badge>
                                    )}
                                    {conge.statut === "annulé" && (
                                      <Badge className="bg-gray-100 text-gray-800 font-medium border-0">Annulé</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => toast.success(`Détails de la demande ${conge.id}`)}>
                                          Voir détails
                                        </DropdownMenuItem>
                                        {conge.statut === "en attente" && (
                                          <>
                                            <DropdownMenuItem onClick={() => toast.success(`Validation de la demande ${conge.id}`)}>
                                              Valider
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toast.success(`Refus de la demande ${conge.id}`)}>
                                              Refuser
                                            </DropdownMenuItem>
                                          </>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Alert>
                            <AlertDescription>
                              Aucun historique de congés pour cet employé.
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </TabsContent>
            
            <TabsContent value="evaluations">
              <EvaluationsTab 
                employe={employe} 
                onUpdate={handleUpdateEmploye}
              />
            </TabsContent>
            
            <TabsContent value="historique">
              <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden">
                <HistoriqueDetailleTab
                  isGlobal={false}
                  employe={{
                    id: employe.id,
                    nom: employe.nom,
                    prenom: employe.prenom,
                    matricule: employe.matricule
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier les informations contractuelles</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations contractuelles de l'employé. Ces changements seront tracés dans l'historique.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="salaireBase" className="text-right text-sm font-medium col-span-1">
                Salaire de base
              </label>
              <div className="col-span-3">
                <Input
                  id="salaireBase"
                  type="number"
                  value={contractForm.salaireBase}
                  onChange={(e) => handleContractFormChange('salaireBase', e.target.value)}
                  min="0"
                  className="col-span-3"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Utilisé pour le calcul de la paie
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="typeContrat" className="text-right text-sm font-medium col-span-1">
                Type de contrat
              </label>
              <Select 
                value={contractForm.typeContrat} 
                onValueChange={(value) => handleContractFormChange('typeContrat', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Intérim">Intérim</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Stage">Stage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="poste" className="text-right text-sm font-medium col-span-1">
                Poste
              </label>
              <Input
                id="poste"
                value={contractForm.poste}
                onChange={(e) => handleContractFormChange('poste', e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="departement" className="text-right text-sm font-medium col-span-1">
                Département
              </label>
              <Input
                id="departement"
                value={contractForm.departement}
                onChange={(e) => handleContractFormChange('departement', e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="dateEmbauche" className="text-right text-sm font-medium col-span-1">
                Date d'embauche
              </label>
              <Input
                id="dateEmbauche"
                type="date"
                value={contractForm.dateEmbauche}
                onChange={(e) => handleContractFormChange('dateEmbauche', e.target.value)}
                className="col-span-3"
              />
            </div>

            {(contractForm.typeContrat === 'CDD' || contractForm.typeContrat === 'Stage' || contractForm.typeContrat === 'Intérim') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="dureeContrat" className="text-right text-sm font-medium col-span-1">
                  Durée du contrat
                </label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="dureeContrat"
                    type="number"
                    min="1"
                    value={contractForm.dureeContrat}
                    onChange={(e) => handleContractFormChange('dureeContrat', e.target.value)}
                    className="flex-1"
                  />
                  <Select 
                    value={contractForm.uniteContrat} 
                    onValueChange={(value) => handleContractFormChange('uniteContrat', value)}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Unité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jours">Jours</SelectItem>
                      <SelectItem value="mois">Mois</SelectItem>
                      <SelectItem value="années">Années</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContractDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveContractInfo}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "delete" ? "Supprimer l'employé ?" : "Archiver l'employé ?"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "delete" 
                ? "Cette action est irréversible. Toutes les informations associées à cet employé seront définitivement supprimées."
                : "L'employé sera marqué comme inactif et ses accès seront suspendus, mais ses données seront conservées."
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button 
              variant={dialogAction === "delete" ? "destructive" : "default"}
              onClick={handleConfirmAction}
            >
              {dialogAction === "delete" ? "Supprimer" : "Archiver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeDetail;
