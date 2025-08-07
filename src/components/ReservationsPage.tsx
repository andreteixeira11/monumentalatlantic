import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Users, MapPin, Euro, Clock } from "lucide-react";
import { useState } from "react";
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
}

const mockReservations: Reservation[] = [
  {
    id: "RES-001",
    guestName: "Maria Silva",
    property: "Apartamento Centro Porto",
    checkIn: new Date(2024, 11, 15),
    checkOut: new Date(2024, 11, 18),
    guests: 2,
    nights: 3,
    total: 450,
    status: "confirmed"
  },
  {
    id: "RES-002", 
    guestName: "João Santos",
    property: "Casa Vila Nova de Gaia",
    checkIn: new Date(2024, 11, 20),
    checkOut: new Date(2024, 11, 25),
    guests: 4,
    nights: 5,
    total: 650,
    status: "confirmed"
  },
  {
    id: "RES-003",
    guestName: "Ana Costa",
    property: "Loft Ribeira",
    checkIn: new Date(2024, 11, 10),
    checkOut: new Date(2024, 11, 13),
    guests: 1,
    nights: 3,
    total: 390,
    status: "completed"
  },
  {
    id: "RES-004",
    guestName: "Pedro Oliveira",
    property: "Apartamento Centro Porto",
    checkIn: new Date(2025, 0, 5),
    checkOut: new Date(2025, 0, 8),
    guests: 3,
    nights: 3,
    total: 480,
    status: "pending"
  },
  {
    id: "RES-005",
    guestName: "Carla Fernandes",
    property: "Casa Vila Nova de Gaia",
    checkIn: new Date(2024, 11, 28),
    checkOut: new Date(2025, 0, 2),
    guests: 6,
    nights: 5,
    total: 750,
    status: "confirmed"
  }
];

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

export const ReservationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredReservations = mockReservations.filter(reservation => {
    const matchesSearch = reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalReservations = filteredReservations.length;
  const totalRevenue = filteredReservations.reduce((sum, res) => sum + res.total, 0);
  const totalGuests = filteredReservations.reduce((sum, res) => sum + res.guests, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reservas</h1>
          <p className="text-muted-foreground">Gerir todas as suas reservas num só local</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reservas
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReservations}</div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Hóspedes
            </CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGuests}</div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <Euro className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalRevenue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por hóspede, propriedade ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "confirmed", "pending", "completed", "cancelled"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status === "all" ? "Todas" : getStatusText(status)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Lista de Reservas</CardTitle>
          <CardDescription>
            {filteredReservations.length} reservas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Hóspede</TableHead>
                  <TableHead>Propriedade</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead className="text-center">Hóspedes</TableHead>
                  <TableHead className="text-center">Noites</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id} className="hover:bg-accent/50">
                    <TableCell className="font-medium">{reservation.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <span>{reservation.guestName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.property}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(reservation.checkIn, "dd MMM yyyy", { locale: pt })}
                    </TableCell>
                    <TableCell>
                      {format(reservation.checkOut, "dd MMM yyyy", { locale: pt })}
                    </TableCell>
                    <TableCell className="text-center">{reservation.guests}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.nights}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      €{reservation.total}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(reservation.status)}>
                        {getStatusText(reservation.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};