import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { 
  BellRing, 
  Calendar, 
  CreditCard, 
  FileText, 
  Key, 
  Lock, 
  Mail, 
  MessageSquare, 
  RefreshCw, 
  Save, 
  Upload,
  Check,
  X,
  AlertCircle,
  Building,
  Landmark
} from "lucide-react";

const ParametresIntegration = () => {
  // État pour chaque type d'intégration
  const [integrations, setIntegrations] = useState({
    cnss: {
      enabled: false,
      apiKey: "",
      apiSecret: "",
      apiUrl: "https://api.damancom.ma/v2/",
      status: "non-configuré" // 'non-configuré', 'connecté', 'erreur'
    },
    simpl: {
      enabled: false,
      username: "",
      password: "",
      certificatPath: "",
      apiUrl: "https://simpl.tax.gov.ma/api/",
      status: "non-configuré"
    },
    bank: {
      enabled: false,
      selectedBank: "attijariwafa",
      apiKey: "",
      clientId: "",
      clientSecret: "",
      status: "non-configuré"
    },
    cmi: {
      enabled: false,
      merchantId: "",
      apiKey: "",
      status: "non-configuré"
    },
    email: {
      enabled: false,
      provider: "smtp",
      smtpHost: "",
      smtpPort: "",
      username: "",
      password: "",
      fromEmail: "",
      status: "non-configuré"
    }
  });

  const [testingConnection, setTestingConnection] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Gestionnaire pour les changements d'inputs
  const handleChange = (integration, field, value) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration],
        [field]: value
      }
    }));
  };

  // Gestionnaire pour activer/désactiver une intégration
  const handleToggleIntegration = (integration, enabled) => {
    setIntegrations(current => ({
      ...current,
      [integration]: {
        ...current[integration],
        enabled
      }
    }));
  };

  // Fonction de test de connexion
  const testConnection = (integration) => {
    setTestingConnection(true);
    
    // Simuler un appel API (à remplacer par un vrai appel API)
    setTimeout(() => {
      setTestingConnection(false);
      
      // Simuler un succès (à remplacer par une logique réelle)
      const success = Math.random() > 0.3;
      
      if (success) {
        setIntegrations(prev => ({
          ...prev,
          [integration]: {
            ...prev[integration],
            status: "connecté"
          }
        }));
        
        toast({
          title: "Connexion réussie",
          description: `L'intégration avec ${getIntegrationName(integration)} a été établie avec succès.`,
          variant: "default",
        });
      } else {
        setIntegrations(prev => ({
          ...prev,
          [integration]: {
            ...prev[integration],
            status: "erreur"
          }
        }));
        
        toast({
          title: "Erreur de connexion",
          description: `Impossible de se connecter à ${getIntegrationName(integration)}. Vérifiez vos identifiants.`,
          variant: "destructive",
        });
      }
    }, 2000);
  };

  // Fonction de téléversement de fichier (certificat, etc.)
  const handleFileUpload = (integration, field, event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setUploadingFile(true);
    
    // Simuler un téléversement (à remplacer par un vrai téléversement)
    setTimeout(() => {
      setUploadingFile(false);
      
      // Mettre à jour le chemin du fichier 
      setIntegrations(prev => ({
        ...prev,
        [integration]: {
          ...prev[integration],
          [field]: file.name // Dans une implémentation réelle, ce serait l'URL ou le chemin vers le fichier stocké
        }
      }));
      
      toast({
        title: "Fichier téléversé",
        description: `Le fichier ${file.name} a été téléversé avec succès.`,
        variant: "default",
      });
    }, 1500);
  };

  // Fonction pour enregistrer les configurations
  const saveConfiguration = (integration) => {
    // Simuler l'enregistrement (à remplacer par un vrai appel API)
    setTimeout(() => {
      toast({
        title: "Configuration enregistrée",
        description: `Les paramètres pour ${getIntegrationName(integration)} ont été sauvegardés.`,
        variant: "default",
      });
    }, 500);
  };

  // Fonction pour obtenir le nom complet d'une intégration
  const getIntegrationName = (key) => {
    const names = {
      cnss: "DAMANCOM (CNSS)",
      simpl: "SIMPL-IR (DGI)",
      bank: "Banque",
      cmi: "Centre Monétique Interbancaire",
      email: "Service d'Email"
    };
    
    return names[key] || key;
  };

  // Fonction pour afficher le statut avec la bonne couleur
  const getStatusDisplay = (status) => {
    switch (status) {
      case "connecté":
        return <span className="flex items-center text-green-600 font-medium"><Check className="h-4 w-4 mr-1" /> Connecté</span>;
      case "erreur":
        return <span className="flex items-center text-red-600 font-medium"><X className="h-4 w-4 mr-1" /> Erreur</span>;
      default:
        return <span className="flex items-center text-gray-500 font-medium"><AlertCircle className="h-4 w-4 mr-1" /> Non configuré</span>;
    }
  };

  // Rendu du composant
  return (
    <Card>
      <CardHeader>
        <CardTitle>Intégrations externes</CardTitle>
        <CardDescription>
          Configurez les connexions avec les services externes et les APIs officielles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cnss" className="w-full">
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:grid-cols-5 h-auto mb-8">
            <TabsTrigger value="cnss" className="py-2 flex items-center">
              <Building className="h-4 w-4 mr-2" /> CNSS
            </TabsTrigger>
            <TabsTrigger value="simpl" className="py-2 flex items-center">
              <FileText className="h-4 w-4 mr-2" /> SIMPL-IR
            </TabsTrigger>
            <TabsTrigger value="bank" className="py-2 flex items-center">
              <Landmark className="h-4 w-4 mr-2" /> Banque
            </TabsTrigger>
            <TabsTrigger value="cmi" className="py-2 flex items-center">
              <CreditCard className="h-4 w-4 mr-2" /> CMI
            </TabsTrigger>
            <TabsTrigger value="email" className="py-2 flex items-center">
              <Mail className="h-4 w-4 mr-2" /> Email
            </TabsTrigger>
          </TabsList>

          {/* Section DAMANCOM (CNSS) */}
          <TabsContent value="cnss">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-medium">DAMANCOM (CNSS)</h3>
                  <p className="text-sm text-muted-foreground">
                    Intégration avec le service DAMANCOM pour les déclarations CNSS
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="cnss-toggle">Activer</Label>
                  <Switch 
                    id="cnss-toggle"
                    checked={integrations.cnss.enabled}
                    onCheckedChange={(checked) => handleToggleIntegration("cnss", checked)}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Statut de connexion:</span>
                    {getStatusDisplay(integrations.cnss.status)}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cnss-api-key">Clé API</Label>
                      <Input 
                        id="cnss-api-key"
                        type="password" 
                        placeholder="Entrez votre clé API DAMANCOM"
                        value={integrations.cnss.apiKey}
                        onChange={(e) => handleChange("cnss", "apiKey", e.target.value)}
                        disabled={!integrations.cnss.enabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnss-api-secret">Secret API</Label>
                      <Input 
                        id="cnss-api-secret"
                        type="password" 
                        placeholder="Entrez votre secret API"
                        value={integrations.cnss.apiSecret}
                        onChange={(e) => handleChange("cnss", "apiSecret", e.target.value)}
                        disabled={!integrations.cnss.enabled}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnss-api-url">URL API</Label>
                    <Input 
                      id="cnss-api-url"
                      placeholder="URL du service API DAMANCOM"
                      value={integrations.cnss.apiUrl}
                      onChange={(e) => handleChange("cnss", "apiUrl", e.target.value)}
                      disabled={!integrations.cnss.enabled}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline" 
                      onClick={() => testConnection("cnss")}
                      disabled={!integrations.cnss.enabled || testingConnection}
                    >
                      {testingConnection ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                      Tester la connexion
                    </Button>
                    <Button
                      onClick={() => saveConfiguration("cnss")}
                      disabled={!integrations.cnss.enabled}
                    >
                      <Save className="h-4 w-4 mr-2" /> Enregistrer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Section SIMPL-IR (DGI) */}
          <TabsContent value="simpl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-medium">SIMPL-IR (DGI)</h3>
                  <p className="text-sm text-muted-foreground">
                    Intégration avec le service SIMPL-IR pour les déclarations fiscales
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="simpl-toggle">Activer</Label>
                  <Switch 
                    id="simpl-toggle"
                    checked={integrations.simpl.enabled}
                    onCheckedChange={(checked) => handleToggleIntegration("simpl", checked)}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Statut de connexion:</span>
                    {getStatusDisplay(integrations.simpl.status)}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="simpl-username">Nom d'utilisateur</Label>
                      <Input 
                        id="simpl-username"
                        placeholder="Identifiant SIMPL-IR"
                        value={integrations.simpl.username}
                        onChange={(e) => handleChange("simpl", "username", e.target.value)}
                        disabled={!integrations.simpl.enabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="simpl-password">Mot de passe</Label>
                      <Input 
                        id="simpl-password"
                        type="password"
                        placeholder="Mot de passe SIMPL-IR"
                        value={integrations.simpl.password}
                        onChange={(e) => handleChange("simpl", "password", e.target.value)}
                        disabled={!integrations.simpl.enabled}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="simpl-certificate">Certificat Digital (Format .p12)</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="simpl-certificate"
                        type="text"
                        placeholder="Aucun certificat téléversé"
                        value={integrations.simpl.certificatPath}
                        readOnly
                        disabled={!integrations.simpl.enabled}
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('certificat-upload').click()}
                        disabled={!integrations.simpl.enabled || uploadingFile}
                      >
                        {uploadingFile ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </Button>
                      <input 
                        id="certificat-upload" 
                        type="file"
                        className="hidden"
                        accept=".p12"
                        onChange={(e) => handleFileUpload("simpl", "certificatPath", e)}
                        disabled={!integrations.simpl.enabled}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Téléversez votre certificat digital fourni par la DGI</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="simpl-api-url">URL API</Label>
                    <Input 
                      id="simpl-api-url"
                      placeholder="URL du service API SIMPL-IR"
                      value={integrations.simpl.apiUrl}
                      onChange={(e) => handleChange("simpl", "apiUrl", e.target.value)}
                      disabled={!integrations.simpl.enabled}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline" 
                      onClick={() => testConnection("simpl")}
                      disabled={!integrations.simpl.enabled || testingConnection}
                    >
                      {testingConnection ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                      Tester la connexion
                    </Button>
                    <Button
                      onClick={() => saveConfiguration("simpl")}
                      disabled={!integrations.simpl.enabled}
                    >
                      <Save className="h-4 w-4 mr-2" /> Enregistrer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Section Banque */}
          <TabsContent value="bank">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-medium">Intégration Bancaire</h3>
                  <p className="text-sm text-muted-foreground">
                    Configuration de l'intégration avec votre banque pour les virements automatiques
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="bank-toggle">Activer</Label>
                  <Switch 
                    id="bank-toggle"
                    checked={integrations.bank.enabled}
                    onCheckedChange={(checked) => handleToggleIntegration("bank", checked)}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Statut de connexion:</span>
                    {getStatusDisplay(integrations.bank.status)}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank-select">Sélectionnez votre banque</Label>
                    <select 
                      id="bank-select"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={integrations.bank.selectedBank}
                      onChange={(e) => handleChange("bank", "selectedBank", e.target.value)}
                      disabled={!integrations.bank.enabled}
                    >
                      <option value="attijariwafa">Attijariwafa Bank</option>
                      <option value="bcp">Banque Populaire (BCP)</option>
                      <option value="bmce">BMCE Bank</option>
                      <option value="sg">Société Générale</option>
                      <option value="cih">CIH Bank</option>
                      <option value="cdm">Crédit du Maroc</option>
                    </select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bank-client-id">Client ID</Label>
                      <Input 
                        id="bank-client-id"
                        placeholder="Identifiant client API bancaire"
                        value={integrations.bank.clientId}
                        onChange={(e) => handleChange("bank", "clientId", e.target.value)}
                        disabled={!integrations.bank.enabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bank-client-secret">Client Secret</Label>
                      <Input 
                        id="bank-client-secret"
                        type="password"
                        placeholder="Secret client API bancaire"
                        value={integrations.bank.clientSecret}
                        onChange={(e) => handleChange("bank", "clientSecret", e.target.value)}
                        disabled={!integrations.bank.enabled}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank-api-key">Clé API</Label>
                    <Input 
                      id="bank-api-key"
                      type="password"
                      placeholder="Clé API fournie par votre banque"
                      value={integrations.bank.apiKey}
                      onChange={(e) => handleChange("bank", "apiKey", e.target.value)}
                      disabled={!integrations.bank.enabled}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline" 
                      onClick={() => testConnection("bank")}
                      disabled={!integrations.bank.enabled || testingConnection}
                    >
                      {testingConnection ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                      Tester la connexion
                    </Button>
                    <Button
                      onClick={() => saveConfiguration("bank")}
                      disabled={!integrations.bank.enabled}
                    >
                      <Save className="h-4 w-4 mr-2" /> Enregistrer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Section CMI */}
          <TabsContent value="cmi">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-medium">Centre Monétique Interbancaire (CMI)</h3>
                  <p className="text-sm text-muted-foreground">
                    Configuration de l'intégration avec le CMI pour les paiements en ligne
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="cmi-toggle">Activer</Label>
                  <Switch 
                    id="cmi-toggle"
                    checked={integrations.cmi.enabled}
                    onCheckedChange={(checked) => handleToggleIntegration("cmi", checked)}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Statut de connexion:</span>
                    {getStatusDisplay(integrations.cmi.status)}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cmi-merchant-id">Identifiant marchand</Label>
                      <Input 
                        id="cmi-merchant-id"
                        placeholder="Identifiant marchand CMI"
                        value={integrations.cmi.merchantId}
                        onChange={(e) => handleChange("cmi", "merchantId", e.target.value)}
                        disabled={!integrations.cmi.enabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cmi-api-key">Clé API</Label>
                      <Input 
                        id="cmi-api-key"
                        type="password"
                        placeholder="Clé API CMI"
                        value={integrations.cmi.apiKey}
                        onChange={(e) => handleChange("cmi", "apiKey", e.target.value)}
                        disabled={!integrations.cmi.enabled}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline" 
                      onClick={() => testConnection("cmi")}
                      disabled={!integrations.cmi.enabled || testingConnection}
                    >
                      {testingConnection ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                      Tester la connexion
                    </Button>
                    <Button
                      onClick={() => saveConfiguration("cmi")}
                      disabled={!integrations.cmi.enabled}
                    >
                      <Save className="h-4 w-4 mr-2" /> Enregistrer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Section Email */}
          <TabsContent value="email">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-medium">Configuration Emails</h3>
                  <p className="text-sm text-muted-foreground">
                    Configuration du service d'envoi d'emails pour les notifications
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="email-toggle">Activer</Label>
                  <Switch 
                    id="email-toggle"
                    checked={integrations.email.enabled}
                    onCheckedChange={(checked) => handleToggleIntegration("email", checked)}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Statut de connexion:</span>
                    {getStatusDisplay(integrations.email.status)}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-provider">Fournisseur de service email</Label>
                    <select 
                      id="email-provider"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={integrations.email.provider}
                      onChange={(e) => handleChange("email", "provider", e.target.value)}
                      disabled={!integrations.email.enabled}
                    >
                      <option value="smtp">SMTP (serveur personnalisé)</option>
                      <option value="sendgrid">SendGrid</option>
                      <option value="ses">Amazon SES</option>
                    </select>
                  </div>

                  {integrations.email.provider === "smtp" && (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="smtp-host">Hôte SMTP</Label>
                          <Input 
                            id="smtp-host"
                            placeholder="ex: smtp.votredomaine.com"
                            value={integrations.email.smtpHost}
                            onChange={(e) => handleChange("email", "smtpHost", e.target.value)}
                            disabled={!integrations.email.enabled}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtp-port">Port SMTP</Label>
                          <Input 
                            id="smtp-port"
                            placeholder="ex: 587"
                            value={integrations.email.smtpPort}
                            onChange={(e) => handleChange("email", "smtpPort", e.target.value)}
                            disabled={!integrations.email.enabled}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email-username">Nom d'utilisateur</Label>
                      <Input 
                        id="email-username"
                        placeholder="Identifiant du service email"
                        value={integrations.email.username}
                        onChange={(e) => handleChange("email", "username", e.target.value)}
                        disabled={!integrations.email.enabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-password">Mot de passe</Label>
                      <Input 
                        id="email-password"
                        type="password"
                        placeholder="Mot de passe du service email"
                        value={integrations.email.password}
                        onChange={(e) => handleChange("email", "password", e.target.value)}
                        disabled={!integrations.email.enabled}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="from-email">Email d'expéditeur</Label>
                    <Input 
                      id="from-email"
                      type="email"
                      placeholder="noreply@votreentreprise.ma"
                      value={integrations.email.fromEmail}
                      onChange={(e) => handleChange("email", "fromEmail", e.target.value)}
                      disabled={!integrations.email.enabled}
                    />
                    <p className="text-xs text-muted-foreground">Adresse email utilisée comme expéditeur pour toutes les notifications</p>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline" 
                      onClick={() => testConnection("email")}
                      disabled={!integrations.email.enabled || testingConnection}
                    >
                      {testingConnection ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                      Tester la connexion
                    </Button>
                    <Button
                      onClick={() => saveConfiguration("email")}
                      disabled={!integrations.email.enabled}
                    >
                      <Save className="h-4 w-4 mr-2" /> Enregistrer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ParametresIntegration;
