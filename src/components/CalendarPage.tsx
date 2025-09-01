import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameDay, startOfWeek, endOfWeek, isSameMonth, isToday, differenceInDays, addMonths, subMonths } from "date-fns";
import { pt } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, MapPin, Eye, Phone, Mail, CreditCard, Info, Plus, Edit, Filter, X } from "lucide-react";

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
    platform: "booking",
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
    platform: "airbnb",
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
    platform: "booking",
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
    platform: "airbnb",
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
    platform: "vrbo",
    notes: "Celebração de Ano Novo"
  }
];

// Cores para diferentes propriedades
const propertyColors: Record<string, string> = {
  "Apartamento Centro Porto": "bg-blue-500 text-white",
  "Casa Vila Nova de Gaia": "bg-green-500 text-white",
  "Loft Ribeira": "bg-purple-500 text-white",
};

// Platform logos/colors
const platformStyles: Record<string, { bg: string; logo: string }> = {
  "booking": { bg: "bg-blue-600", logo: "B" },
  "airbnb": { bg: "bg-red-500", logo: "A" },
  "vrbo": { bg: "bg-yellow-600", logo: "V" },
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

const properties = ["Todas", "Apartamento Centro Porto", "Casa Vila Nova de Gaia", "Loft Ribeira"];

export const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedReservation, setSelectedReservation] = useState<CalendarReservation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState("Todas");
  const [viewMode, setViewMode] = useState<"month" | "multi-month">("month");
  
  const [newReservation, setNewReservation] = useState({
    guestName: "",
    property: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    platform: "booking",
    email: "",
    phone: "",
    totalAmount: 0,
    notes: ""
  });

  const handleReservationClick = (reservation: CalendarReservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const filteredReservations = selectedProperty === "Todas" 
    ? mockCalendarReservations 
    : mockCalendarReservations.filter(res => res.property === selectedProperty);

  const getReservationsForDay = (day: Date) => {
    return filteredReservations.filter(reservation => {
      return (day >= reservation.checkIn && day < reservation.checkOut) ||
             isSameDay(day, reservation.checkIn) ||
             isSameDay(day, reservation.checkOut);
    });
  };

  const getReservationsForMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    return filteredReservations.filter(reservation => {
      return (reservation.checkIn >= monthStart && reservation.checkIn <= monthEnd) ||
             (reservation.checkOut >= monthStart && reservation.checkOut <= monthEnd) ||
             (reservation.checkIn <= monthStart && reservation.checkOut >= monthEnd);
    });
  };

  const monthReservations = getReservationsForMonth(currentMonth);

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToMonth = (monthIndex: number) => {
    const newDate = new Date(currentMonth.getFullYear(), monthIndex, 1);
    setCurrentMonth(newDate);
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

  const handleCreateReservation = () => {
    // Here you would typically send the data to your backend
    console.log("Creating reservation:", newReservation);
    setIsNewReservationOpen(false);
    setNewReservation({
      guestName: "",
      property: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
      platform: "booking",
      email: "",
      phone: "",
      totalAmount: 0,
      notes: ""
    });
  };

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent">
            Multi-Calendar
          </h1>
          <p className="text-muted-foreground">Gestão completa de reservas em todas as plataformas</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {properties.map(property => (
                <SelectItem key={property} value={property}>
                  {property}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={() => setIsNewReservationOpen(true)} className="shadow-soft">
            <Plus className="h-4 w-4 mr-2" />
            Nova Reserva
          </Button>
        </div>
      </div>

      {/* Enhanced Month Navigation */}
      <Card className="shadow-medium bg-gradient-to-r from-card to-card/50 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Month Selector */}
              <Select 
                value={currentMonth.getMonth().toString()} 
                onValueChange={(value) => goToMonth(parseInt(value))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {format(new Date(2024, i, 1), "MMMM", { locale: pt })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <CardTitle className="text-xl">
                {format(currentMonth, "yyyy", { locale: pt })}
              </CardTitle>
            </div>
            
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {monthReservations.length} reservas
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Calendar View */}
      <Card className="shadow-strong bg-gradient-to-br from-card to-card/90 border-primary/10">
        <CardContent className="p-6">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Week Days Header */}
            {weekDays.map((day) => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-primary bg-primary/5 rounded-lg">
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
                  className={`min-h-[140px] p-2 border rounded-xl transition-all hover:shadow-medium ${
                    isCurrentMonth ? 'bg-card border-border' : 'bg-muted/30 border-muted'
                  } ${isCurrentDay ? 'ring-2 ring-primary shadow-glow' : ''}`}
                >
                  {/* Day Number */}
                  <div className={`text-sm font-semibold mb-2 flex items-center justify-center w-7 h-7 rounded-full ${
                    isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                  } ${isCurrentDay ? 'bg-primary text-primary-foreground' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Reservations for this day - Enhanced Bars */}
                  <div className="space-y-1">
                    {dayReservations.slice(0, 4).map((reservation) => {
                      const isCheckIn = isSameDay(day, reservation.checkIn);
                      const isCheckOut = isSameDay(day, reservation.checkOut);
                      const isMiddle = day > reservation.checkIn && day < reservation.checkOut;
                      const platformStyle = platformStyles[reservation.platform || "booking"];
                      
                      return (
                        <div
                          key={reservation.id}
                          className={`relative p-1.5 rounded-md cursor-pointer hover:opacity-80 transition-all text-xs font-medium overflow-hidden
                            ${propertyColors[reservation.property] || 'bg-primary text-primary-foreground'}`}
                          title={`${reservation.guestName} - ${reservation.property} (${reservation.guests} hóspedes) - Clique para detalhes`}
                          onClick={() => handleReservationClick(reservation)}
                        >
                          {/* Platform Logo */}
                          <div className={`absolute top-1 right-1 w-4 h-4 ${platformStyle.bg} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                            {platformStyle.logo}
                          </div>
                          
                          {/* Reservation Content */}
                          <div className="flex items-center space-x-1">
                            {isCheckIn && <span className="text-xs">→</span>}
                            <span className="truncate flex-1">
                              {isCheckIn || isCheckOut ? reservation.guestName : '•••'}
                            </span>
                            {isCheckOut && <span className="text-xs">←</span>}
                          </div>
                          
                          {/* Connecting Line for multi-day reservations */}
                          {isMiddle && (
                            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-current opacity-50"></div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Show "+X more" if there are more reservations */}
                    {dayReservations.length > 4 && (
                      <div className="text-xs text-muted-foreground text-center py-1 bg-muted/50 rounded">
                        +{dayReservations.length - 4} mais
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

      {/* Enhanced Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-soft bg-gradient-to-br from-card to-card/50">
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
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Propriedades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(propertyColors).map(([property, colorClass]) => (
                <div key={property} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded ${colorClass.replace('text-white', 'text-transparent')}`}></div>
                  <span className="text-sm">{property}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-lg">Plataformas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(platformStyles).map(([platform, style]) => (
                <div key={platform} className="flex items-center space-x-2">
                  <div className={`w-6 h-6 ${style.bg} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                    {style.logo}
                  </div>
                  <span className="text-sm capitalize">{platform}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Reservation Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Detalhes da Reserva</span>
            </DialogTitle>
            <DialogDescription>
              Informações completas e ações disponíveis
            </DialogDescription>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="space-y-6">
              {/* Enhanced Header Card */}
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{selectedReservation.guestName}</h3>
                      <p className="text-muted-foreground">{selectedReservation.id}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(selectedReservation.status)}>
                          {selectedReservation.status === "confirmed" && "Confirmada"}
                          {selectedReservation.status === "pending" && "Pendente"}
                          {selectedReservation.status === "cancelled" && "Cancelada"}
                          {selectedReservation.status === "completed" && "Concluída"}
                        </Badge>
                        {selectedReservation.platform && (
                          <Badge className={`${platformStyles[selectedReservation.platform].bg} text-white`}>
                            {selectedReservation.platform.charAt(0).toUpperCase() + selectedReservation.platform.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Alterar Preços
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Property & Dates */}
                <Card className="shadow-soft">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">Propriedade</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {selectedReservation.property}
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
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
                <Card className="shadow-soft">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium">Hóspedes</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        {selectedReservation.guests} {selectedReservation.guests === 1 ? 'pessoa' : 'pessoas'}
                      </p>

                      {selectedReservation.email && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-primary" />
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
                            <Phone className="h-4 w-4 text-primary" />
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
                  <Card className="shadow-soft">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-primary" />
                          <span className="font-medium">Financeiro</span>
                        </div>
                        <div className="ml-6 text-sm space-y-1">
                          <p><span className="text-muted-foreground">Valor Total:</span> €{selectedReservation.totalAmount}</p>
                          <p><span className="text-muted-foreground">Status Pagamento:</span> 
                            <Badge variant="secondary" className="ml-2 bg-success/10 text-success">Pago</Badge>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Notes */}
                {selectedReservation.notes && (
                  <Card className="shadow-soft">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Info className="h-4 w-4 text-primary" />
                          <span className="font-medium">Notas</span>
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
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline">Bloquear Disponibilidade</Button>
                <Button variant="outline">Realocar Hóspede</Button>
                <Button>Enviar Mensagem</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Reservation Modal */}
      <Dialog open={isNewReservationOpen} onOpenChange={setIsNewReservationOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Nova Reserva</DialogTitle>
            <DialogDescription>
              Adicione uma nova reserva ao sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Hóspede</Label>
                <Input
                  value={newReservation.guestName}
                  onChange={(e) => setNewReservation({...newReservation, guestName: e.target.value})}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label>Propriedade</Label>
                <Select 
                  value={newReservation.property} 
                  onValueChange={(value) => setNewReservation({...newReservation, property: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar propriedade" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.slice(1).map(property => (
                      <SelectItem key={property} value={property}>
                        {property}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Check-in</Label>
                <Input
                  type="date"
                  value={newReservation.checkIn}
                  onChange={(e) => setNewReservation({...newReservation, checkIn: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Check-out</Label>
                <Input
                  type="date"
                  value={newReservation.checkOut}
                  onChange={(e) => setNewReservation({...newReservation, checkOut: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Número de Hóspedes</Label>
                <Input
                  type="number"
                  min="1"
                  value={newReservation.guests}
                  onChange={(e) => setNewReservation({...newReservation, guests: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Plataforma</Label>
                <Select 
                  value={newReservation.platform} 
                  onValueChange={(value) => setNewReservation({...newReservation, platform: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">Booking.com</SelectItem>
                    <SelectItem value="airbnb">Airbnb</SelectItem>
                    <SelectItem value="vrbo">VRBO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newReservation.email}
                  onChange={(e) => setNewReservation({...newReservation, email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={newReservation.phone}
                  onChange={(e) => setNewReservation({...newReservation, phone: e.target.value})}
                  placeholder="+351 900 000 000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Valor Total (€)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newReservation.totalAmount}
                onChange={(e) => setNewReservation({...newReservation, totalAmount: parseFloat(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea
                value={newReservation.notes}
                onChange={(e) => setNewReservation({...newReservation, notes: e.target.value})}
                placeholder="Informações adicionais..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsNewReservationOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateReservation}>
                Criar Reserva
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};