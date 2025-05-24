
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertCircle, Clock } from "lucide-react";

interface Alert {
  employee: string;
  type: string;
  date: string;
  urgent: boolean;
}

interface AlertsTabProps {
  alerts: Alert[];
}

const AlertsTab = ({ alerts }: AlertsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Alertes et notifications</h2>
        <Button variant="outline" className="gap-2">
          <RefreshCw size={16} />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert, index) => (
          <Card key={index} className={`${alert.urgent ? 'border-red-300 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className="shrink-0">
                {alert.urgent ? (
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <AlertCircle size={20} />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <Clock size={20} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{alert.type}</h3>
                  <Badge variant="outline" className={alert.urgent ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}>
                    {alert.urgent ? 'Urgent' : 'Information'}
                  </Badge>
                </div>
                <p className="text-sm mt-1">
                  Employé: <span className="font-medium">{alert.employee}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Date: {alert.date}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0">
                Traiter
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlertsTab;
