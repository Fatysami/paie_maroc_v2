
import React, { useState } from "react";
import EmployeLayout from "@/components/employe/EmployeLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportFilters from "@/components/employe/reporting/ReportFilters";
import MasseSalarialeTab from "@/components/employe/reporting/MasseSalarialeTab";
import EffectifsTab from "@/components/employe/reporting/EffectifsTab";
import AbsencesTab from "@/components/employe/reporting/AbsencesTab";
import PrimesTab from "@/components/employe/reporting/PrimesTab";
import { subMonths } from "date-fns";

const AnalytiqueRH = () => {
  const [activeTab, setActiveTab] = useState("masse-salariale");
  const [filters, setFilters] = useState({
    departement: "tous",
    statut: "tous",
    typeContrat: "tous",
    sexe: "tous"
  });
  
  const [period, setPeriod] = useState({
    debut: subMonths(new Date(), 12),
    fin: new Date()
  });

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handlePeriodChange = (newPeriod: { debut: Date; fin: Date }) => {
    setPeriod(newPeriod);
  };

  return (
    <EmployeLayout title="Reporting & Analytique RH">
      <div className="space-y-6">
        <div className="mb-6">
          <ReportFilters 
            filters={filters}
            period={period}
            onFilterChange={handleFilterChange}
            onPeriodChange={handlePeriodChange}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="masse-salariale">Masse Salariale</TabsTrigger>
            <TabsTrigger value="effectifs">Effectifs</TabsTrigger>
            <TabsTrigger value="absences">Absences & Congés</TabsTrigger>
            <TabsTrigger value="primes">Primes & Avantages</TabsTrigger>
          </TabsList>

          <TabsContent value="masse-salariale" className="mt-6">
            <MasseSalarialeTab period={period} filters={filters} />
          </TabsContent>

          <TabsContent value="effectifs" className="mt-6">
            <EffectifsTab period={period} filters={filters} />
          </TabsContent>

          <TabsContent value="absences" className="mt-6">
            <AbsencesTab period={period} filters={filters} />
          </TabsContent>

          <TabsContent value="primes" className="mt-6">
            <PrimesTab period={period} filters={filters} />
          </TabsContent>
        </Tabs>
      </div>
    </EmployeLayout>
  );
};

export default AnalytiqueRH;
