
import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SkillsSectionProps {
  isEditing: boolean;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ isEditing }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="competences" className="mb-2 block">Compétences</Label>
        <div className="flex flex-wrap gap-2">
          {["React", "TypeScript", "JavaScript", "HTML/CSS", "Tailwind CSS"].map((skill) => (
            <Badge key={skill} variant="secondary" className="py-1">
              {skill}
            </Badge>
          ))}
          {isEditing && (
            <Button variant="outline" size="sm" className="h-8 rounded-full">
              + Ajouter
            </Button>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="certifications" className="mb-2 block">Certifications</Label>
        <div className="space-y-2">
          {["Meta Frontend Developer", "AWS Cloud Practitioner"].map((cert) => (
            <div key={cert} className="flex items-center justify-between p-2 border rounded-md">
              <span>{cert}</span>
              {isEditing && (
                <Button variant="ghost" size="sm" className="h-8 text-red-500">
                  Supprimer
                </Button>
              )}
            </div>
          ))}
          {isEditing && (
            <Button variant="outline" className="w-full mt-2">
              + Ajouter une certification
            </Button>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="education" className="mb-2 block">Formation</Label>
        <div className="space-y-2">
          <div className="p-3 border rounded-md">
            <p className="font-medium">Master en Développement Web</p>
            <p className="text-sm text-muted-foreground">Université de Casablanca, 2020</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="font-medium">Licence en Informatique</p>
            <p className="text-sm text-muted-foreground">Université Mohamed V, 2018</p>
          </div>
          {isEditing && (
            <Button variant="outline" className="w-full mt-2">
              + Ajouter une formation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
