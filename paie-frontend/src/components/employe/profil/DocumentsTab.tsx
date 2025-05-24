
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText, Upload } from "lucide-react";

const DocumentsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes documents</CardTitle>
        <CardDescription>
          Documents personnels et administratifs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Documents d'identité</CardTitle>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" /> Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-blue-primary" />
                      <div>
                        <p className="font-medium">CIN</p>
                        <p className="text-xs text-muted-foreground">Mis à jour le 15/03/2023</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-blue-primary" />
                      <div>
                        <p className="font-medium">Passeport</p>
                        <p className="text-xs text-muted-foreground">Mis à jour le 20/01/2022</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Documents bancaires</CardTitle>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" /> Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-blue-primary" />
                      <div>
                        <p className="font-medium">RIB</p>
                        <p className="text-xs text-muted-foreground">Mis à jour le 05/01/2023</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Documents professionnels</CardTitle>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" /> Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-blue-primary" />
                    <div>
                      <p className="font-medium">Contrat de travail</p>
                      <p className="text-xs text-muted-foreground">Mis à jour le 01/01/2023</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-blue-primary" />
                    <div>
                      <p className="font-medium">CV</p>
                      <p className="text-xs text-muted-foreground">Mis à jour le 15/12/2022</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-blue-primary" />
                    <div>
                      <p className="font-medium">Fiche de poste</p>
                      <p className="text-xs text-muted-foreground">Mis à jour le 01/01/2023</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
