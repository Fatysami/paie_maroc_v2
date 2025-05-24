
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/user';
import { userService } from '@/utils/clientServices';
import { useAuth } from '@/context/AuthContext';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, User as UserIcon, UserCheck, UserX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface UsersListProps {
  companyId?: string;
}

const UsersList: React.FC<UsersListProps> = ({ companyId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { appUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let fetchedUsers: User[];
        // Si companyId est fourni, on récupère les utilisateurs de cette entreprise
        // Sinon on utilise l'ID de l'entreprise de l'utilisateur connecté
        const targetCompanyId = companyId || appUser?.companyId;
        
        if (targetCompanyId) {
          fetchedUsers = await userService.getUsersByCompany(targetCompanyId);
          setUsers(fetchedUsers);
        }
      } catch (error: any) {
        toast.error(`Erreur lors du chargement des utilisateurs: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (appUser) {
      fetchUsers();
    }
  }, [companyId, appUser]);

  const handleEditUser = (userId: string) => {
    navigate(`/users/edit/${userId}`);
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      const isActive = !user.isActive;
      await userService.updateUser(user.id, { isActive });
      
      // Mettre à jour la liste localement
      setUsers(users.map(u => u.id === user.id ? { ...u, isActive } : u));
      
      toast.success(`L'utilisateur ${user.email} a été ${isActive ? 'activé' : 'désactivé'}`);
    } catch (error: any) {
      toast.error(`Erreur lors de la modification du statut: ${error.message}`);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'rh':
        return 'bg-blue-100 text-blue-800';
      case 'manager':
        return 'bg-green-100 text-green-800';
      case 'comptable':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Utilisateurs</h2>
        <Button onClick={() => navigate('/users/new')}>
          <UserIcon className="mr-2 h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor="search" className="sr-only">Rechercher</Label>
        <Input
          id="search"
          placeholder="Rechercher par email ou rôle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-primary"></div>
        </div>
      ) : (
        <Table className="border rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernière connexion</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? 'Actif' : 'Désactivé'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Jamais'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditUser(user.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={user.isActive ? "destructive" : "outline"} 
                        size="icon" 
                        onClick={() => handleToggleUserStatus(user)}
                      >
                        {user.isActive ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UsersList;
