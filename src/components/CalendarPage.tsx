import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const getReservationsForDate = (date: Date) => {
    return mockCalendarReservations.filter(reservation => {
      const checkInDate = reservation.checkIn;
      const checkOutDate = reservation.checkOut;
      
      return date >= checkInDate && date < checkOutDate;
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

  const selectedDateReservations = getReservationsForDate(selectedDate);
  const monthReservations = getReservationsForMonth(currentMonth);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getDayReservationCount = (date: Date) => {
    return getReservationsForDate(date).length;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendário de Reservas</h1>
          <p className="text-muted-foreground">Visualize as suas reservas no calendário</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Calendário</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border shadow-soft p-3 pointer-events-auto"
              modifiers={{
                hasReservations: (date) => getDayReservationCount(date) > 0,
              }}
              modifiersStyles={{
                hasReservations: {
                  backgroundColor: 'hsl(217, 91%, 60%, 0.1)',
                  fontWeight: 'bold',
                  color: 'hsl(217, 91%, 60%)',
                }
              }}
              components={{
                DayContent: ({ date }) => {
                  const reservationCount = getDayReservationCount(date);
                  return (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <span>{date.getDate()}</span>
                      {reservationCount > 0 && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                          {reservationCount}
                        </div>
                      )}
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, "dd 'de' MMMM", { locale: pt })}
            </CardTitle>
            <CardDescription>
              {selectedDateReservations.length} reserva(s) neste dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDateReservations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Não há reservas para este dia</p>
                </div>
              ) : (
                selectedDateReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="p-4 rounded-lg border bg-accent/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{reservation.guestName}</span>
                      <Badge className={getStatusColor(reservation.status)}>
                        {reservation.status === "confirmed" && "Confirmada"}
                        {reservation.status === "pending" && "Pendente"}
                        {reservation.status === "completed" && "Concluída"}
                        {reservation.status === "cancelled" && "Cancelada"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{reservation.property}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{reservation.guests} hóspedes</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(reservation.checkIn, "dd MMM", { locale: pt })} - {format(reservation.checkOut, "dd MMM", { locale: pt })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Month Overview */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Resumo do Mês</CardTitle>
          <CardDescription>
            Todas as reservas para {format(currentMonth, "MMMM yyyy", { locale: pt })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {monthReservations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Não há reservas para este mês</p>
              </div>
            ) : (
              monthReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="font-semibold">{reservation.guestName}</div>
                    <div className="text-sm text-muted-foreground flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{reservation.property}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{reservation.guests} hóspedes</span>
                      </span>
                    </div>
                    <div className="text-sm">
                      {format(reservation.checkIn, "dd MMM", { locale: pt })} - {format(reservation.checkOut, "dd MMM", { locale: pt })}
                    </div>
                  </div>
                  <Badge className={getStatusColor(reservation.status)}>
                    {reservation.status === "confirmed" && "Confirmada"}
                    {reservation.status === "pending" && "Pendente"}
                    {reservation.status === "completed" && "Concluída"}
                    {reservation.status === "cancelled" && "Cancelada"}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};