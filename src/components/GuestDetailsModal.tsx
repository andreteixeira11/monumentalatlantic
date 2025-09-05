import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Calendar, Phone, Mail, FileText, Building } from "lucide-react";

interface GuestRegistry {
  id: string;
  guestName: string;
  documentNumber: string;
  documentType: string;
  nationality: string;
  checkInDate: string;
  checkOutDate: string;
  property: string;
  status: "pending" | "sent" | "confirmed" | "error" | "link-sent";
  guestFormLink?: string;
}

interface GuestDetailsModalProps {
  registry: GuestRegistry | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GuestDetailsModal = ({ registry, isOpen, onClose }: GuestDetailsModalProps) => {
  if (!registry) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success/20 text-success border-success/30";
      case "sent":
        return "bg-warning/20 text-warning border-warning/30";
      case "error":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "pending":
        return "bg-muted/50 text-muted-foreground border-muted/30";
      case "link-sent":
        return "bg-primary/20 text-primary border-primary/30";
      default:
        return "bg-muted/50 text-muted-foreground border-muted/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "sent":
        return "Enviado";
      case "error":
        return "Erro";
      case "pending":
        return "Pendente";
      case "link-sent":
        return "Link Enviado";
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Detalhes do Hóspede</span>
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas do registo de {registry.guestName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guest Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações Pessoais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome</p>
                <p className="text-lg font-semibold">{registry.guestName}</p>
              </div>
              
              {registry.documentNumber && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documento</p>
                  <p>{registry.documentType} {registry.documentNumber}</p>
                </div>
              )}
              
              {registry.nationality && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nacionalidade</p>
                  <p>{registry.nationality}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado do Registo</p>
                <Badge className={getStatusColor(registry.status)}>
                  {getStatusText(registry.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Reservation Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Detalhes da Estadia</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Propriedade</p>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p>{registry.property}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Check-in</p>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p>{new Date(registry.checkInDate).toLocaleDateString('pt-PT')}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Check-out</p>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p>{new Date(registry.checkOutDate).toLocaleDateString('pt-PT')}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID do Registo</p>
                <p className="font-mono text-sm">{registry.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        {registry.status === "link-sent" && registry.guestFormLink && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Link de Preenchimento</span>
              </CardTitle>
              <CardDescription>
                Link enviado ao hóspede para preenchimento dos dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-muted/50 rounded-lg border">
                <p className="text-sm font-mono break-all">{registry.guestFormLink}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                O hóspede deve aceder a este link para completar o registo.
              </p>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};