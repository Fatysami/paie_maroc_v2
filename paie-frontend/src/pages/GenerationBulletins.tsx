
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBulletins, EmailOptions } from "@/hooks/useBulletins";
import BulletinsHeader from "@/components/bulletins/BulletinsHeader";
import BulletinsInfoBanner from "@/components/bulletins/BulletinsInfoBanner";
import PeriodSelector from "@/components/bulletins/PeriodSelector";
import BulletinsListTab from "@/components/bulletins/tabs/BulletinsListTab";
import EtatsDeclarationsTab from "@/components/bulletins/tabs/EtatsDeclarationsTab";
import RapportsPersonnalisesTab from "@/components/bulletins/tabs/RapportsPersonnalisesTab";
import VerificationDialog from "@/components/bulletins/dialogs/VerificationDialog";
import EmailDialog from "@/components/bulletins/dialogs/EmailDialog";

const GenerationBulletins = () => {
  const [activeTab, setActiveTab] = useState("bulletins");
  const [periodeSelectionne, setPeriodeSelectionne] = useState("2023-04");
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const {
    bulletins,
    etatsPaie,
    rapportsPersonnalises,
    getPeriodeLabels,
    genererTousBulletins,
    envoyerBulletins
  } = useBulletins();

  const { moisNom, annee } = getPeriodeLabels(periodeSelectionne);

  const genererTousBulletinsPeriode = () => {
    setVerificationDialogOpen(true);
  };

  const confirmerGenerationTous = () => {
    setVerificationDialogOpen(false);
    genererTousBulletins();
  };

  const handleEnvoiBulletins = () => {
    setEmailDialogOpen(true);
  };

  const confirmerEnvoiEmail = (options: EmailOptions) => {
    setEmailDialogOpen(false);
    envoyerBulletins(options);
  };

  return (
    <div className="container mx-auto p-6">
      <BulletinsHeader periodeSelectionne={periodeSelectionne} />

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Documents de paie</CardTitle>
            <PeriodSelector 
              periodeSelectionne={periodeSelectionne} 
              setPeriodeSelectionne={setPeriodeSelectionne} 
            />
          </div>
          <CardDescription>
            Générez, téléchargez et envoyez les bulletins de paie et documents liés à la paie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BulletinsInfoBanner moisNom={moisNom} annee={annee} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="bulletins">Bulletins de paie</TabsTrigger>
              <TabsTrigger value="etats">États et déclarations</TabsTrigger>
              <TabsTrigger value="rapports">Rapports personnalisés</TabsTrigger>
            </TabsList>

            <TabsContent value="bulletins" className="space-y-4">
              <BulletinsListTab 
                bulletins={bulletins} 
                periodeSelectionne={periodeSelectionne}
                onGenererTous={genererTousBulletinsPeriode}
                onEnvoiBulletins={handleEnvoiBulletins}
              />
            </TabsContent>

            <TabsContent value="etats" className="space-y-4">
              <EtatsDeclarationsTab etatsPaie={etatsPaie} />
            </TabsContent>

            <TabsContent value="rapports" className="space-y-4">
              <RapportsPersonnalisesTab rapports={rapportsPersonnalises} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <VerificationDialog 
        open={verificationDialogOpen}
        onOpenChange={setVerificationDialogOpen}
        onConfirm={confirmerGenerationTous}
        moisNom={moisNom}
        annee={annee}
      />

      <EmailDialog 
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onConfirm={confirmerEnvoiEmail}
      />
    </div>
  );
};

export default GenerationBulletins;
