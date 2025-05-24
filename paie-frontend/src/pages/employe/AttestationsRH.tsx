
import React from "react";
import EmployeLayout from "@/components/employe/EmployeLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, FileCheck, Download, Eye, Clock, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const AttestationsRH = () => {
  // Données fictives des attestations
  const attestations = [
    { id: 1, type: "Attestation de travail", date: "01/06/2023", statut: "disponible", telecharge: true },
    { id: 2, type: "Attestation de salaire", date: "15/05/2023", statut: "disponible", telecharge: true },
    { id: 3, type: "Attestation de congé", date: "10/06/2023", statut: "en traitement", telecharge: false },
    { id: 4, type: "Certificat de travail", date: "20/04/2023", statut: "disponible", telecharge: false }
  ];

  return (
    <EmployeLayout title="Attestations RH">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="col-span-1 md:col-span-4">
            <CardHeader>
              <CardTitle>Documents administratifs</CardTitle>
              <CardDescription>
                Vous pouvez générer différents types d'attestations et certificats dont vous avez besoin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="bg-transparent cursor-pointer hover:bg-accent transition-colors">
                      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <FileText className="h-10 w-10 mb-4 text-blue-primary" />
                        <h3 className="font-medium">Attestation de travail</h3>
                        <p className="text-sm text-muted-foreground mt-1">Document prouvant votre emploi</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Demande d'attestation de travail</DialogTitle>
                      <DialogDescription>
                        Ce document officiel confirme que vous êtes employé dans notre entreprise.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="motif">Motif de la demande (optionnel)</Label>
                        <Select>
                          <SelectTrigger id="motif">
                            <SelectValue placeholder="Sélectionnez un motif" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="demarche_admin">Démarche administrative</SelectItem>
                            <SelectItem value="banque">Demande de prêt bancaire</SelectItem>
                            <SelectItem value="logement">Dossier logement</SelectItem>
                            <SelectItem value="autre">Autre (préciser)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="commentaire">Précisions supplémentaires</Label>
                        <Textarea
                          id="commentaire"
                          placeholder="Détails supplémentaires pour le traitement de votre demande (optionnel)"
                          className="resize-none"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit">Soumettre ma demande</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="bg-transparent cursor-pointer hover:bg-accent transition-colors">
                      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <FileDown className="h-10 w-10 mb-4 text-blue-primary" />
                        <h3 className="font-medium">Attestation de salaire</h3>
                        <p className="text-sm text-muted-foreground mt-1">Document attestant de vos revenus</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Demande d'attestation de salaire</DialogTitle>
                      <DialogDescription>
                        Ce document officiel confirme votre rémunération actuelle.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="motif">Motif de la demande (optionnel)</Label>
                        <Select>
                          <SelectTrigger id="motif">
                            <SelectValue placeholder="Sélectionnez un motif" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pret">Demande de prêt</SelectItem>
                            <SelectItem value="location">Location immobilière</SelectItem>
                            <SelectItem value="autre">Autre (préciser)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="periode">Période concernée</Label>
                        <Select defaultValue="3_months">
                          <SelectTrigger id="periode">
                            <SelectValue placeholder="Sélectionnez une période" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="current">Mois en cours</SelectItem>
                            <SelectItem value="3_months">3 derniers mois</SelectItem>
                            <SelectItem value="6_months">6 derniers mois</SelectItem>
                            <SelectItem value="12_months">12 derniers mois</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="commentaire">Commentaire</Label>
                        <Textarea
                          id="commentaire"
                          placeholder="Informations complémentaires (optionnel)"
                          className="resize-none"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit">Soumettre ma demande</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="bg-transparent cursor-pointer hover:bg-accent transition-colors">
                      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <FileCheck className="h-10 w-10 mb-4 text-blue-primary" />
                        <h3 className="font-medium">Attestation de congé</h3>
                        <p className="text-sm text-muted-foreground mt-1">Document pour congés pris</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Demande d'attestation de congé</DialogTitle>
                      <DialogDescription>
                        Ce document confirme vos périodes de congés.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="conge">Congé concerné</Label>
                        <Select>
                          <SelectTrigger id="conge">
                            <SelectValue placeholder="Sélectionnez un congé" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conge_1">Congé du 20/06/2023 au 24/06/2023</SelectItem>
                            <SelectItem value="conge_2">Congé du 10/04/2023 au 12/04/2023</SelectItem>
                            <SelectItem value="conge_3">Congé du 15/02/2023 au 15/02/2023</SelectItem>
                            <SelectItem value="another">Autre période (préciser)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="commentaire">Commentaire</Label>
                        <Textarea
                          id="commentaire"
                          placeholder="Précisions supplémentaires (optionnel)"
                          className="resize-none"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit">Soumettre ma demande</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="bg-transparent cursor-pointer hover:bg-accent transition-colors">
                      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <FileText className="h-10 w-10 mb-4 text-blue-primary" />
                        <h3 className="font-medium">Autre document</h3>
                        <p className="text-sm text-muted-foreground mt-1">Documents personnalisés</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Demande de document personnalisé</DialogTitle>
                      <DialogDescription>
                        Précisez le type de document dont vous avez besoin.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="type_doc">Type de document</Label>
                        <Select>
                          <SelectTrigger id="type_doc">
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="domiciliation">Attestation de domiciliation</SelectItem>
                            <SelectItem value="stage">Attestation de stage</SelectItem>
                            <SelectItem value="anciennete">Certificat d'ancienneté</SelectItem>
                            <SelectItem value="autre">Autre (préciser)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="details">Détails de la demande</Label>
                        <Textarea
                          id="details"
                          placeholder="Veuillez préciser les détails de votre demande"
                          className="resize-none"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit">Soumettre ma demande</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold mt-8">Mes attestations</h2>
        
        <Tabs defaultValue="tous" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tous">Tous</TabsTrigger>
            <TabsTrigger value="disponibles">Disponibles</TabsTrigger>
            <TabsTrigger value="en_traitement">En traitement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tous" className="mt-4">
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">Type de document</th>
                      <th className="py-3 px-4 text-left font-medium">Date de demande</th>
                      <th className="py-3 px-4 text-left font-medium">Statut</th>
                      <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attestations.map((doc) => (
                      <tr key={doc.id} className="border-t hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-blue-primary" />
                            <span>{doc.type}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div>{doc.date}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <Badge 
                            className={cn(
                              doc.statut === "disponible" 
                                ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400"
                            )}
                          >
                            <div className="flex items-center">
                              {doc.statut === "disponible" ? (
                                <Check className="h-3 w-3 mr-1" />
                              ) : (
                                <Clock className="h-3 w-3 mr-1" />
                              )}
                              {doc.statut === "disponible" ? "Disponible" : "En traitement"}
                            </div>
                          </Badge>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {doc.statut === "disponible" ? (
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" /> Voir
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" /> Télécharger
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">En attente de validation</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="disponibles" className="mt-4">
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">Type de document</th>
                      <th className="py-3 px-4 text-left font-medium">Date de demande</th>
                      <th className="py-3 px-4 text-left font-medium">Statut</th>
                      <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attestations
                      .filter(doc => doc.statut === "disponible")
                      .map((doc) => (
                        <tr key={doc.id} className="border-t hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-blue-primary" />
                              <span>{doc.type}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div>{doc.date}</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                              <div className="flex items-center">
                                <Check className="h-3 w-3 mr-1" />
                                Disponible
                              </div>
                            </Badge>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" /> Voir
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" /> Télécharger
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="en_traitement" className="mt-4">
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">Type de document</th>
                      <th className="py-3 px-4 text-left font-medium">Date de demande</th>
                      <th className="py-3 px-4 text-left font-medium">Statut</th>
                      <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attestations
                      .filter(doc => doc.statut === "en traitement")
                      .map((doc) => (
                        <tr key={doc.id} className="border-t hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-blue-primary" />
                              <span>{doc.type}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div>{doc.date}</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                En traitement
                              </div>
                            </Badge>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="text-sm text-muted-foreground">En attente de validation</span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </EmployeLayout>
  );
};

export default AttestationsRH;
