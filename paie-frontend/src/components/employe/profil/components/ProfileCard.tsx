
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Camera, Mail, MapPin, Phone, User } from "lucide-react";

const ProfileCard = () => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Photo de profil</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative">
          <Avatar className="h-32 w-32">
            <AvatarImage src="" alt="Photo de profil" />
            <AvatarFallback className="text-3xl">ME</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full bg-background">
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 text-center">
          <h3 className="font-medium text-lg">Mohamed El Alaoui</h3>
          <p className="text-sm text-muted-foreground">Développeur Front-End</p>
        </div>
        <Separator className="my-4" />
        <div className="w-full space-y-3">
          <div className="flex items-start">
            <Mail className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">mohamed.elalaoui@exemple.com</p>
            </div>
          </div>
          <div className="flex items-start">
            <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Téléphone</p>
              <p className="text-sm text-muted-foreground">+212 6 12 34 56 78</p>
            </div>
          </div>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Adresse</p>
              <p className="text-sm text-muted-foreground">123 Rue Mohammed V, Casablanca</p>
            </div>
          </div>
          <div className="flex items-start">
            <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Matricule</p>
              <p className="text-sm text-muted-foreground">EMP-2023-0042</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
