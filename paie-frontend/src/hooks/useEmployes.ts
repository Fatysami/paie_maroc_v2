
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "@/utils/clientServices";
import { toast } from "sonner";
import { Employe } from "@/pages/GestionEmployes"; // Import the Employe type from GestionEmployes

// Helper function to convert between Employee and Employe types
const mapEmployeeToEmploye = (employee: any): Employe => {
  return {
    id: employee.id,
    nom: employee.lastName || "",
    prenom: employee.firstName || "",
    matricule: employee.id,
    cin: "DEFAULT",
    email: employee.email || "",
    telephone: "",
    adresse: {
      rue: "",
      ville: "",
      pays: "",
      codePostal: ""
    },
    dateEmbauche: employee.hireDate || new Date().toISOString(),
    poste: employee.position || "",
    departement: employee.department || "",
    typeContrat: "CDI",
    salaire: employee.salary || 0,
    salaireBase: employee.salary || 0,
    status: employee.status === "active" ? "Actif" : 
            employee.status === "inactive" ? "Inactif" : "Période d'essai"
  };
};

const mapEmployeToEmployee = (employe: Employe): any => {
  return {
    id: employe.id,
    firstName: employe.prenom,
    lastName: employe.nom,
    email: employe.email,
    position: employe.poste,
    department: employe.departement,
    hireDate: employe.dateEmbauche,
    salary: employe.salaire,
    status: employe.status === "Actif" ? "active" :
            employe.status === "Inactif" ? "inactive" : "onLeave",
    companyId: "1" // Default company ID
  };
};

/**
 * Hook pour gérer les opérations liées aux employés
 * Utilise React Query pour la gestion de l'état et du cache
 */
export const useEmployes = () => {
  const queryClient = useQueryClient();

  // Récupérer tous les employés
  const {
    data: employeesData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employes"],
    queryFn: async () => {
      const employees = await employeeService.getAllEmployees();
      // Convert Employee[] to Employe[]
      return employees.map(mapEmployeeToEmploye);
    },
    meta: {
      onError: (err: any) => {
        toast.error(`Erreur lors du chargement des employés: ${err.message}`);
      },
    },
  });

  // Ajouter un employé
  const addEmployeMutation = useMutation({
    mutationFn: (newEmploye: Omit<Employe, "id">) => {
      // Convert Employe to Employee
      const employee = mapEmployeToEmployee({
        id: "temp-id", // This will be replaced by the service
        ...newEmploye
      });
      // Remove id as it's an Omit<Employee, "id">
      delete employee.id;
      
      return employeeService.addEmployee(employee);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["employes"] });
      toast.success("Employé ajouté avec succès");
    },
    onError: (err: any) => {
      toast.error(`Erreur lors de l'ajout de l'employé: ${err.message}`);
    },
  });

  // Mettre à jour un employé
  const updateEmployeMutation = useMutation({
    mutationFn: ({ id, employe }: { id: string; employe: Partial<Employe> }) => {
      // Convert partial Employe to partial Employee
      const partialEmployee = mapEmployeToEmployee({
        id,
        ...employe,
        nom: employe.nom || "",
        prenom: employe.prenom || "",
        matricule: employe.matricule || "",
        cin: employe.cin || "",
        email: employe.email || "",
        telephone: employe.telephone || "",
        adresse: employe.adresse || { rue: "", ville: "", pays: "", codePostal: "" },
        dateEmbauche: employe.dateEmbauche || "",
        poste: employe.poste || "",
        departement: employe.departement || "",
        typeContrat: employe.typeContrat || "CDI",
        salaire: employe.salaire || 0,
        salaireBase: employe.salaireBase || 0,
        status: employe.status || "Actif"
      } as Employe);
      
      return employeeService.updateEmployee(id, partialEmployee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employes"] });
      toast.success("Employé mis à jour avec succès");
    },
    onError: (err: any) => {
      toast.error(`Erreur lors de la mise à jour de l'employé: ${err.message}`);
    },
  });

  // Supprimer un employé
  const deleteEmployeMutation = useMutation({
    mutationFn: (id: string) => employeeService.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employes"] });
      toast.success("Employé supprimé avec succès");
    },
    onError: (err: any) => {
      toast.error(`Erreur lors de la suppression de l'employé: ${err.message}`);
    },
  });

  return {
    employes: employeesData,
    isLoading,
    error,
    addEmploye: addEmployeMutation.mutate,
    updateEmploye: updateEmployeMutation.mutate,
    deleteEmploye: deleteEmployeMutation.mutate,
    isAdding: addEmployeMutation.isPending,
    isUpdating: updateEmployeMutation.isPending,
    isDeleting: deleteEmployeMutation.isPending,
  };
};
