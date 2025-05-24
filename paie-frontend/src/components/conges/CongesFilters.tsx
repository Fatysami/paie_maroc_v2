
import React from "react";
import { Search, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CongesFilters = () => {
  return (
    <div className="flex gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher..."
          className="w-[200px] pl-8"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-1.5">
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-4" align="end">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select defaultValue="all">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Validé</SelectItem>
                  <SelectItem value="rejected">Refusé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de congé</Label>
              <Select defaultValue="all">
                <SelectTrigger id="type">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="paid">Congé payé</SelectItem>
                  <SelectItem value="sick">Maladie</SelectItem>
                  <SelectItem value="special">Exceptionnel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Période</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" placeholder="Date début" />
                <Input type="date" placeholder="Date fin" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="pending" />
                  <label
                    htmlFor="pending"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    En attente uniquement
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="current" />
                  <label
                    htmlFor="current"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Année en cours
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm">
                Réinitialiser
              </Button>
              <Button size="sm">Appliquer</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CongesFilters;
