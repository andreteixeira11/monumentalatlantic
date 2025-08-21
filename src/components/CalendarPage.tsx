import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameDay, startOfWeek, endOfWeek, isSameMonth, isToday, differenceInDays } from "date-fns";
import { pt } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, MapPin, Eye, Phone, Mail, CreditCard, Info } from "lucide-react";

interface CalendarReservation {
  id: string;
  guestName: string;
  property: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  email?: string;
  phone?: string;
  totalAmount?: number;
  platform?: string;
  notes?: string;
}

const mockCalendarReservations: CalendarReservation[] = [
  {
    id: "RES-001",
    guestName: "Maria Silva",
    property: "Apartamento Centro Porto",
    checkIn: new Date(2024, 11, 15),
    checkOut: new Date(2024, 11, 18),
    guests: 2,
    status: "confirmed",
    email: "maria.silva@email.com",
    phone: "+351 910 123 456",
    totalAmount: 240,
    platform: "Booking.com",
    notes: "Chegada após as 18h"
  },
  {
    id: "RES-002", 
    guestName: "João Santos",
    property: "Casa Vila Nova de Gaia",
    checkIn: new Date(2024, 11, 20),
    checkOut: new Date(2024, 11, 25),
    guests: 4,
    status: "confirmed",
    email: "joao.santos@email.com",
    phone: "+351 920 234 567",
    totalAmount: 450,
    platform: "Airbnb",
    notes: "Família com crianças"
  },
  {
    id: "RES-003",
    guestName: "Ana Costa",
    property: "Loft Ribeira",
    checkIn: new Date(2024, 11, 10),
    checkOut: new Date(2024, 11, 13),
    guests: 1,
    status: "completed",
    email: "ana.costa@email.com",
    phone: "+351 930 345 678",
    totalAmount: 180,
    platform: "Booking.com",
    notes: "Viagem de negócios"
  },
  {
    id: "RES-004",
    guestName: "Pedro Oliveira",
    property: "Apartamento Centro Porto",
    checkIn: new Date(2025, 0, 5),
    checkOut: new Date(2025, 0, 8),
    guests: 3,
    status: "pending",
    email: "pedro.oliveira@email.com",
    phone: "+351 940 456 789",
    totalAmount: 300,
    platform: "Airbnb",
    notes: "Aguarda confirmação de pagamento"
  },
  {
    id: "RES-005",
    guestName: "Carla Fernandes",
    property: "Casa Vila Nova de Gaia",
    checkIn: new Date(2024, 11, 28),
    checkOut: new Date(2025, 0, 2),
    guests: 6,
    status: "confirmed",
    email: "carla.fernandes@email.com",
    phone: "+351 950 567 890",
    totalAmount: 600,
    platform: "Booking.com",
    notes: "Celebração de Ano Novo"
  }
];

// Cores para diferentes propriedades
const propertyColors: Record<string, string> = {
  "Apartamento Centro Porto": "bg-blue-500/20 text-blue-700 border-blue-500/30",
  "Casa Vila Nova de Gaia": "bg-green-500/20 text-green-700 border-green-500/30",
  "Loft Ribeira": "bg-purple-500/20 text-purple-700 border-purple-500/30",
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-success/20 text-success border-success/30";
    case "pending":
      return "bg-warning/20 text-warning border-warning/30";
    case "cancelled":
      return "bg-destructive/20 text-destructive border-destructive/30";
    case "completed":
      return "bg-muted/50 text-muted-foreground border-muted/30";
    default:
      return "bg-muted/50 text-muted-foreground border-muted/30";
  }
};

export const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedReservation, setSelectedReservation] = useState<CalendarReservation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReservationClick = (reservation: CalendarReservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const getReservationsForDay = (day: Date) => {
    return mockCalendarReservations.filter(reservation => {
      return (day >= reservation.checkIn && day < reservation.checkOut) ||
             isSameDay(day, reservation.checkIn) ||
             isSameDay(day, reservation.checkOut);
    });
  };

  const getReservationsForMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    return mockCalendarReservations.filter(reservation => {
      return (reservation.checkIn >= monthStart && reservation.checkIn <= monthEnd) ||
             (reservation.checkOut >= monthStart && reservation.checkOut <= monthEnd) ||
             (reservation.checkIn <= monthStart && reservation.checkOut >= monthEnd);
    });
  };

  const monthReservations = getReservationsForMonth(currentMonth);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Generate calendar days including previous/next month days for complete weeks
  const getCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { locale: pt });
    const calendarEnd = endOfWeek(monthEnd, { locale: pt });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendário de Reservas</h1>
          <p className="text-muted-foreground">Visualize as suas reservas em calendário</p>
        </div>
      </div>

      {/* Month Navigation */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {format(currentMonth, "MMMM yyyy", { locale: pt })}
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            {monthReservations.length} reservas este mês
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Calendar View */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Calendário do Mês</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Week Days Header */}
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground bg-muted/30 rounded">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {calendarDays.map((day, index) => {
              const dayReservations = getReservationsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isCurrentDay = isToday(day);
              
              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border border-border/50 rounded-lg ${
                    isCurrentMonth ? 'bg-card' : 'bg-muted/20'
                  } ${isCurrentDay ? 'ring-2 ring-primary' : ''}`}
                >
                  {/* Day Number */}
                  <div className={`text-sm font-medium mb-2 ${
                    isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                  } ${isCurrentDay ? 'text-primary font-bold' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Reservations for this day */}
                  <div className="space-y-1">
                    {dayReservations.slice(0, 3).map((reservation) => {
                      const isCheckIn = isSameDay(day, reservation.checkIn);
                      const isCheckOut = isSameDay(day, reservation.checkOut);
                      
                      return (
                        <div
                          key={reservation.id}
                          className={`text-xs p-1 rounded text-center truncate cursor-pointer hover:opacity-75 transition-opacity
                            ${propertyColors[reservation.property] || getStatusColor(reservation.status)} 
                            ${isCheckIn ? 'border-l-4 border-l-foreground' : ''} 
                            ${isCheckOut ? 'border-r-4 border-r-foreground' : ''}`}
                          title={`${reservation.guestName} - ${reservation.property} (${reservation.guests} hóspedes) - Clique para detalhes`}
                          onClick={() => handleReservationClick(reservation)}
                        >
                          {isCheckIn && '→ '}
                          {reservation.guestName}
                          {isCheckOut && ' ←'}
                        </div>
                      );
                    })}
                    
                    {/* Show "+X more" if there are more reservations */}
                    {dayReservations.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayReservations.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {monthReservations.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Não há reservas para este mês</p>
            </div>
          )}
        </CardContent>
      </Card>

        {/* Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Estados das Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-success/20 border border-success/30"></div>
                <span className="text-sm">Confirmada</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-warning/20 border border-warning/30"></div>
                <span className="text-sm">Pendente</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-muted/50 border border-muted/30"></div>
                <span className="text-sm">Concluída</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive/30"></div>
                <span className="text-sm">Cancelada</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">→ Check-in</span>
                <span className="text-sm">← Check-out</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Propriedades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(propertyColors).map(([property, colorClass]) => (
                <div key={property} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded ${colorClass}`}></div>
                  <span className="text-sm">{property}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservation Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Detalhes da Reserva</span>
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre a reserva selecionada
            </DialogDescription>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="space-y-6">
              {/* Header Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">{selectedReservation.guestName}</h3>
                      <p className="text-muted-foreground">{selectedReservation.id}</p>
                    </div>
                    <Badge className={getStatusColor(selectedReservation.status)}>
                      {selectedReservation.status === "confirmed" && "Confirmada"}
                      {selectedReservation.status === "pending" && "Pendente"}
                      {selectedReservation.status === "cancelled" && "Cancelada"}
                      {selectedReservation.status === "completed" && "Concluída"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Property & Dates */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Propriedade</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {selectedReservation.property}
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Datas</span>
                      </div>
                      <div className="ml-6 text-sm space-y-1">
                        <p><span className="text-muted-foreground">Check-in:</span> {format(selectedReservation.checkIn, "dd/MM/yyyy", { locale: pt })}</p>
                        <p><span className="text-muted-foreground">Check-out:</span> {format(selectedReservation.checkOut, "dd/MM/yyyy", { locale: pt })}</p>
                        <p><span className="text-muted-foreground">Duração:</span> {differenceInDays(selectedReservation.checkOut, selectedReservation.checkIn)} noites</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact & Booking Info */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Hóspedes</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {selectedReservation.guests} {selectedReservation.guests === 1 ? 'pessoa' : 'pessoas'}
                      </p>

                      {selectedReservation.email && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Email</span>
                          </div>
                          <p className="text-sm text-muted-foreground ml-6 break-all">
                            {selectedReservation.email}
                          </p>
                        </>
                      )}

                      {selectedReservation.phone && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Telefone</span>
                          </div>
                          <p className="text-sm text-muted-foreground ml-6">
                            {selectedReservation.phone}
                          </p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Info */}
                {selectedReservation.totalAmount && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Informação Financeira</span>
                        </div>
                        <div className="ml-6 text-sm space-y-1">
                          <p><span className="text-muted-foreground">Valor Total:</span> €{selectedReservation.totalAmount}</p>
                          {selectedReservation.platform && (
                            <p><span className="text-muted-foreground">Plataforma:</span> {selectedReservation.platform}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Notes */}
                {selectedReservation.notes && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Observações</span>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">
                          {selectedReservation.notes}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  // Add edit functionality here
                  setIsModalOpen(false);
                }}>
                  Editar Reserva
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};