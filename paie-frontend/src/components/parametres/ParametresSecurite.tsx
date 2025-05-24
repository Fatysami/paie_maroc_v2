
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Shield, 
  User, 
  Users, 
  Lock, 
  Key, 
  Info, 
  Plus, 
  Trash2, 
  Edit,
  LogIn,
  FileText,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Type pour les rôles utilisateurs
type UserRole = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
};

// Type pour les permissions
type Permission = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
};

// Type pour les logs d'activité
type ActivityLog = {
  id: string;
  date: string;
  user: string;
  action: string;
  status: "success" | "failed";
  ipAddress: string;
};

const ParametresSecurite = () => {
  // État pour les rôles utilisateurs
  const [userRoles, setUserRoles] = useState<UserRole[]>([
    {
      id: "admin",
      name: "Administrateur RH",
      description: "Accès total à tous les modules",
      permissions: [
        { id: "p1", name: "Modifier les paramètres de paie", description: "Permet de modifier les règles de calcul", enabled: true },
        { id: "p2", name: "Gérer les employés", description: "Ajouter, modifier, supprimer des employés", enabled: true },
        { id: "p3", name: "Accéder aux bulletins de paie", description: "Voir tous les bulletins de paie", enabled: true },
        { id: "p4", name: "Modifier les profils", description: "Modifier tous les profils",enabled: true }
      ]
    },
    {
      id: "compta",
      name: "Comptable",
      description: "Accès aux bulletins de paie et paiements",
      permissions: [
        { id: "p1", name: "Modifier les paramètres de paie", description: "Permet de modifier les règles de calcul", enabled: false },
        { id: "p2", name: "Gérer les employés", description: "Ajouter, modifier, supprimer des employés", enabled: false },
        { id: "p3", name: "Accéder aux bulletins de paie", description: "Voir tous les bulletins de paie", enabled: true },
        { id: "p4", name: "Modifier les profils", description: "Modifier tous les profils", enabled: false }
      ]
    }
  ]);

  // Liste standard de permissions
  const defaultPermissions: Permission[] = [
    { id: "p1", name: "Modifier les paramètres de paie", description: "Permet de modifier les règles de calcul", enabled: false },
    { id: "p2", name: "Gérer les employés", description: "Ajouter, modifier, supprimer des employés", enabled: false },
    { id: "p3", name: "Accéder aux bulletins de paie", description: "Voir tous les bulletins de paie", enabled: false },
    { id: "p4", name: "Modifier les profils", description: "Modifier tous les profils", enabled: false }
  ];

  // État pour la modification d'un rôle
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  
  // État pour un nouveau rôle
  const [newRole, setNewRole] = useState<Partial<UserRole>>({
    name: "",
    description: "",
    permissions: JSON.parse(JSON.stringify(defaultPermissions))
  });

  // État pour les logs d'activité
  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: "1",
      date: "15/03/2024 14:30",
      user: "Admin1",
      action: "Augmentation du salaire d'Ali Hassan",
      status: "success",
      ipAddress: "192.168.1.10"
    },
    {
      id: "2",
      date: "16/03/2024 09:15",
      user: "Comptable2",
      action: "Génération des bulletins de paie",
      status: "success",
      ipAddress: "192.168.1.15"
    },
    {
      id: "3",
      date: "16/03/2024 11:20",
      user: "Employé3",
      action: "Tentative de modification d'un bulletin",
      status: "failed",
      ipAddress: "192.168.1.20"
    }
  ]);

  // Gestionnaires d'événements
  const handlePasswordPolicyChange = () => {
    toast.success("Politique de mot de passe mise à jour");
  };

  const handleMFAToggle = () => {
    toast.success("Configuration MFA mise à jour");
  };

  const handleSessionTimeout = () => {
    toast.success("Délai d'expiration de session mis à jour");
  };

  // Gestionnaire pour ajouter un nouveau rôle
  const handleAddRole = () => {
    if (!newRole.name) {
      toast.error("Veuillez entrer un nom pour le rôle");
      return;
    }

    const roleId = `role-${Date.now()}`;
    const roleToAdd: UserRole = {
      id: roleId,
      name: newRole.name || "",
      description: newRole.description || "",
      permissions: newRole.permissions as Permission[] || []
    };

    setUserRoles([...userRoles, roleToAdd]);
    setNewRole({
      name: "",
      description: "",
      permissions: JSON.parse(JSON.stringify(defaultPermissions))
    });
    
    toast.success(`Rôle ${roleToAdd.name} ajouté avec succès`);
  };

  // Gestionnaire pour gérer les permissions d'un nouveau rôle
  const handleNewRolePermissionChange = (permissionId: string, enabled: boolean) => {
    if (newRole.permissions) {
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.map(p => 
          p.id === permissionId ? { ...p, enabled } : p
        )
      });
    }
  };

  // Gestionnaire pour initialiser l'édition d'un rôle existant
  const handleInitEditRole = (role: UserRole) => {
    // Copie profonde du rôle pour éviter de modifier directement l'état
    setEditingRole(JSON.parse(JSON.stringify(role)));
  };

  // Gestionnaire pour mettre à jour un rôle existant
  const handleUpdateRole = () => {
    if (editingRole) {
      setUserRoles(userRoles.map(role => 
        role.id === editingRole.id ? editingRole : role
      ));
      
      toast.success(`Rôle ${editingRole.name} modifié avec succès`);
      setEditingRole(null);
    }
  };

  // Gestionnaire pour gérer les permissions lors de l'édition
  const handleEditRolePermissionChange = (permissionId: string, enabled: boolean) => {
    if (editingRole) {
      setEditingRole({
        ...editingRole,
        permissions: editingRole.permissions.map(p => 
          p.id === permissionId ? { ...p, enabled } : p
        )
      });
    }
  };

  // Gestionnaire pour supprimer un rôle
  const handleDeleteRole = (roleId: string) => {
    setUserRoles(userRoles.filter(role => role.id !== roleId));
    toast.success("Rôle supprimé avec succès");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de sécurité</CardTitle>
        <CardDescription>
          Gérez les règles de sécurité, les permissions et les politiques de mot de passe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="roles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Rôles et permissions
            </TabsTrigger>
            <TabsTrigger value="auth" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Authentification
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Logs d'activité
            </TabsTrigger>
          </TabsList>

          {/* Onglet Rôles et permissions */}
          <TabsContent value="roles">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Gestion des rôles</h3>
                
                {/* Dialog pour ajouter un nouveau rôle */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un rôle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Ajouter un nouveau rôle</DialogTitle>
                      <DialogDescription>
                        Définissez le nom, la description et les permissions pour ce rôle
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="role-name">Nom du rôle</Label>
                        <Input 
                          id="role-name" 
                          placeholder="Ex: Gestionnaire RH" 
                          value={newRole.name} 
                          onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role-description">Description</Label>
                        <Textarea 
                          id="role-description" 
                          placeholder="Décrivez les responsabilités de ce rôle" 
                          value={newRole.description} 
                          onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="permissions">Permissions</Label>
                        {newRole.permissions && newRole.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center justify-between pt-2">
                            <div className="space-y-0.5">
                              <div className="font-medium">{permission.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {permission.description}
                              </div>
                            </div>
                            <Switch
                              checked={permission.enabled}
                              onCheckedChange={(checked) => handleNewRolePermissionChange(permission.id, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                      </DialogClose>
                      <Button onClick={handleAddRole}>Ajouter</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {userRoles.map((role) => (
                  <Card key={role.id}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{role.name}</CardTitle>
                          <CardDescription>{role.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {/* Dialog pour modifier un rôle */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleInitEditRole(role)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[550px]">
                              {editingRole && (
                                <>
                                  <DialogHeader>
                                    <DialogTitle>Modifier le rôle</DialogTitle>
                                    <DialogDescription>
                                      Modifiez les informations et les permissions de ce rôle
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-role-name">Nom du rôle</Label>
                                      <Input 
                                        id="edit-role-name"
                                        value={editingRole.name} 
                                        onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-role-description">Description</Label>
                                      <Textarea 
                                        id="edit-role-description" 
                                        value={editingRole.description} 
                                        onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                                      />
                                    </div>
                                    <div className="space-y-3">
                                      <Label>Permissions</Label>
                                      {editingRole.permissions.map((permission) => (
                                        <div key={permission.id} className="flex items-center justify-between pt-2">
                                          <div className="space-y-0.5">
                                            <div className="font-medium">{permission.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                              {permission.description}
                                            </div>
                                          </div>
                                          <Switch
                                            checked={permission.enabled}
                                            onCheckedChange={(checked) => handleEditRolePermissionChange(permission.id, checked)}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Annuler</Button>
                                    </DialogClose>
                                    <Button onClick={handleUpdateRole}>Enregistrer</Button>
                                  </DialogFooter>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {role.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">{permission.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {permission.description}
                              </div>
                            </div>
                            <Switch
                              checked={permission.enabled}
                              onCheckedChange={() => {}}
                              aria-label={`Permission ${permission.name}`}
                              disabled
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Onglet Authentification */}
          <TabsContent value="auth">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Politique de mot de passe</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Longueur minimale</Label>
                    <Input type="number" min="8" defaultValue="8" onChange={handlePasswordPolicyChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiration (jours)</Label>
                    <Input type="number" min="1" defaultValue="90" onChange={handlePasswordPolicyChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Exiger des caractères spéciaux</div>
                      <div className="text-sm text-muted-foreground">
                        Au moins un caractère spécial requis
                      </div>
                    </div>
                    <Switch defaultChecked onCheckedChange={handlePasswordPolicyChange} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authentification à deux facteurs</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Activer l'authentification 2FA</div>
                    <div className="text-sm text-muted-foreground">
                      Requiert une vérification supplémentaire lors de la connexion
                    </div>
                  </div>
                  <Switch onCheckedChange={handleMFAToggle} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Session</h3>
                <div className="space-y-2">
                  <Label>Délai d'expiration (minutes)</Label>
                  <Input 
                    type="number" 
                    min="5" 
                    defaultValue="30" 
                    onChange={handleSessionTimeout}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Onglet Logs d'activité */}
          <TabsContent value="logs">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Historique des activités</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Adresse IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        {log.status === "success" ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Réussi
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Échoué
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{log.ipAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ParametresSecurite;
