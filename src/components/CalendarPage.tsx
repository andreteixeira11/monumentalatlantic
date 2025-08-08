import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, differenceInDays } from "date-fns";
import { pt } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, MapPin } from "lucide-react";

interface CalendarReservation {
  id: string;
  guestName: string;
  property: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
}

const mockCalendarReservations: CalendarReservation[] = [
  {
    id: "RES-001",
    guestName: "Maria Silva",
    property: "Apartamento Centro Porto",
    checkIn: new Date(2024, 11, 15),
    checkOut: new Date(2024, 11, 18),
    guests: 2,
    status: "confirmed"
  },
  {
    id: "RES-002", 
    guestName: "João Santos",
    property: "Casa Vila Nova de Gaia",
    checkIn: new Date(2024, 11, 20),
    checkOut: new Date(2024, 11, 25),
    guests: 4,
    status: "confirmed"
  },
  {
    id: "RES-003",
    guestName: "Ana Costa",
    property: "Loft Ribeira",
    checkIn: new Date(2024, 11, 10),
    checkOut: new Date(2024, 11, 13),
    guests: 1,
    status: "completed"
  },
  {
    id: "RES-004",
    guestName: "Pedro Oliveira",
    property: "Apartamento Centro Porto",
    checkIn: new Date(2025, 0, 5),
    checkOut: new Date(2025, 0, 8),
    guests: 3,
    status: "pending"
  },
  {
    id: "RES-005",
    guestName: "Carla Fernandes",
    property: "Casa Vila Nova de Gaia",
    checkIn: new Date(2024, 11, 28),
    checkOut: new Date(2025, 0, 2),
    guests: 6,
    status: "confirmed"
  }
];

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

  // Generate timeline days for the month
  const getTimelineDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  };

  const timelineDays = getTimelineDays();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Timeline de Reservas</h1>
          <p className="text-muted-foreground">Visualize as suas reservas em timeline</p>
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

      {/* Timeline View */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Timeline do Mês</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {/* Timeline Header */}
            <div className="flex min-w-max mb-4">
              {timelineDays.map((day, index) => (
                <div key={index} className="flex-shrink-0 w-12 text-center">
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    {format(day, "EEE", { locale: pt })}
                  </div>
                  <div className="text-sm font-semibold">
                    {format(day, "dd")}
                  </div>
                </div>
              ))}
            </div>

            {/* Reservations Timeline */}
            <div className="space-y-3">
              {monthReservations.map((reservation) => {
                const startDay = Math.max(0, differenceInDays(reservation.checkIn, startOfMonth(currentMonth)));
                const duration = differenceInDays(reservation.checkOut, reservation.checkIn);
                const width = Math.min(duration * 48, (timelineDays.length - startDay) * 48);
                
                return (
                  <div key={reservation.id} className="relative flex items-center min-w-max">
                    {/* Property Name */}
                    <div className="w-48 pr-4 text-sm font-medium truncate">
                      {reservation.property}
                    </div>
                    
                    {/* Timeline Bar */}
                    <div className="flex-1 relative h-8 flex items-center">
                      <div 
                        className={`absolute h-6 rounded-md flex items-center px-2 text-xs font-medium shadow-sm ${getStatusColor(reservation.status)} border`}
                        style={{
                          left: `${startDay * 48}px`,
                          width: `${width}px`,
                          minWidth: '100px'
                        }}
                      >
                        <span className="truncate">
                          {reservation.guestName} ({reservation.guests} hóspedes)
                        </span>
                      </div>
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
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Legenda</CardTitle>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};