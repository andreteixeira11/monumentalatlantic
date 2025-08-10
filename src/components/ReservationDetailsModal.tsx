import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, MapPin, Euro, Clock, Printer, Phone, Mail, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Reservation {
  id: string;
  guestName: string;
  property: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  nights: number;
  total: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  // Dados adicionais para os detalhes
  guestEmail: string;
  guestPhone: string;
  guestDocument: string;
  accommodationFee: number;
  cleaningFee: number;
  touristTax: number;
  platformFee: number;
  paymentMethod: string;
  bookingPlatform: string;
  specialRequests?: string;
}

interface ReservationDetailsModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationDetailsModal = ({ reservation, isOpen, onClose }: ReservationDetailsModalProps) => {
  if (!reservation) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      case "completed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendente";
      case "cancelled":
        return "Cancelada";
      case "completed":
        return "Concluída";
      default:
        return status;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes da Reserva</span>
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre a reserva {reservation.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and General Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Informações Gerais</span>
                <Badge className={getStatusColor(reservation.status)}>
                  {getStatusText(reservation.status)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Propriedade:</span>
                  </div>
                  <p>{reservation.property}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Plataforma:</span>
                  </div>
                  <p>{reservation.bookingPlatform}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Check-in:</span>
                  </div>
                  <p>{format(reservation.checkIn, "dd 'de' MMMM 'de' yyyy", { locale: pt })}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Check-out:</span>
                  </div>
                  <p>{format(reservation.checkOut, "dd 'de' MMMM 'de' yyyy", { locale: pt })}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Número de Hóspedes:</span>
                  </div>
                  <p>{reservation.guests} hóspede{reservation.guests > 1 ? 's' : ''}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Número de Noites:</span>
                  </div>
                  <p>{reservation.nights} noite{reservation.nights > 1 ? 's' : ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guest Information */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Hóspede</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="font-medium">Nome:</span>
                  <p>{reservation.guestName}</p>
                </div>
                <div className="space-y-2">
                  <span className="font-medium">Documento:</span>
                  <p>{reservation.guestDocument}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                  </div>
                  <p>{reservation.guestEmail}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Telefone:</span>
                  </div>
                  <p>{reservation.guestPhone}</p>
                </div>
              </div>
              {reservation.specialRequests && (
                <div className="mt-4 space-y-2">
                  <span className="font-medium">Pedidos Especiais:</span>
                  <p className="text-muted-foreground">{reservation.specialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Euro className="h-5 w-5" />
                <span>Discriminação de Valores</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Taxa de Alojamento:</span>
                  <span>€{reservation.accommodationFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Limpeza:</span>
                  <span>€{reservation.cleaningFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa Turística:</span>
                  <span>€{reservation.touristTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa da Plataforma:</span>
                  <span>€{reservation.platformFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>€{reservation.total.toFixed(2)}</span>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Método de Pagamento:</span>
                    <span>{reservation.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};