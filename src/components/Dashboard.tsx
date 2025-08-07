import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Calendar, Euro, Star, TrendingUp, Users, Home, LogOut, CalendarDays, BookOpen } from "lucide-react";
import { ReservationsPage } from "./ReservationsPage";
import { CalendarPage } from "./CalendarPage";

interface DashboardProps {
  onLogout: () => void;
}

const revenueData = [
  { month: "Jan", revenue: 2400 },
  { month: "Fev", revenue: 1398 },
  { month: "Mar", revenue: 3200 },
  { month: "Abr", revenue: 3908 },
  { month: "Mai", revenue: 4800 },
  { month: "Jun", revenue: 3800 },
];

const occupancyData = [
  { month: "Jan", occupancy: 65 },
  { month: "Fev", occupancy: 59 },
  { month: "Mar", occupancy: 80 },
  { month: "Abr", occupancy: 81 },
  { month: "Mai", occupancy: 95 },
  { month: "Jun", occupancy: 88 },
];

const propertyTypeData = [
  { name: "T1", value: 35, color: "hsl(217, 91%, 60%)" },
  { name: "T2", value: 45, color: "hsl(217, 91%, 70%)" },
  { name: "T3", value: 20, color: "hsl(230, 91%, 65%)" },
];

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "reservations" | "calendar">("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "reservations":
        return <ReservationsPage />;
      case "calendar":
        return <CalendarPage />;
      default:
        return <DashboardContent />;
    }
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-soft">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Home className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Portal Alojamento</h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Button 
              variant={currentPage === "dashboard" ? "secondary" : "outline"}
              size="sm" 
              onClick={() => setCurrentPage("dashboard")}
              className={currentPage === "dashboard" ? "bg-white/90 text-primary" : "bg-white/10 text-white border-white/30 hover:bg-white/20"}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant={currentPage === "reservations" ? "secondary" : "outline"}
              size="sm" 
              onClick={() => setCurrentPage("reservations")}
              className={currentPage === "reservations" ? "bg-white/90 text-primary" : "bg-white/10 text-white border-white/30 hover:bg-white/20"}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Reservas
            </Button>
            <Button 
              variant={currentPage === "calendar" ? "secondary" : "outline"}
              size="sm" 
              onClick={() => setCurrentPage("calendar")}
              className={currentPage === "calendar" ? "bg-white/90 text-primary" : "bg-white/10 text-white border-white/30 hover:bg-white/20"}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendário
            </Button>
          </nav>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              João Silva
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="bg-white/10 text-white border-white/30 hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden container mx-auto px-6 pb-4">
          <div className="flex space-x-2">
            <Button 
              variant={currentPage === "dashboard" ? "secondary" : "outline"}
              size="sm" 
              onClick={() => setCurrentPage("dashboard")}
              className={currentPage === "dashboard" ? "bg-white/90 text-primary" : "bg-white/10 text-white border-white/30"}
            >
              <Home className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <Button 
              variant={currentPage === "reservations" ? "secondary" : "outline"}
              size="sm" 
              onClick={() => setCurrentPage("reservations")}
              className={currentPage === "reservations" ? "bg-white/90 text-primary" : "bg-white/10 text-white border-white/30"}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Reservas
            </Button>
            <Button 
              variant={currentPage === "calendar" ? "secondary" : "outline"}
              size="sm" 
              onClick={() => setCurrentPage("calendar")}
              className={currentPage === "calendar" ? "bg-white/90 text-primary" : "bg-white/10 text-white border-white/30"}
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              Calendário
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {renderPage()}
      </div>
    </div>
  );
};

const DashboardContent = () => {
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <Euro className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€12,486</div>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa Ocupação
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88%</div>
            <p className="text-xs text-primary flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.2% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hóspedes Totais
            </CardTitle>
            <Users className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">246</div>
            <p className="text-xs text-warning flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.1% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avaliação Média
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground mt-1">
              Baseado em 127 avaliações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
            <CardDescription>
              Evolução da receita nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`€${value}`, 'Receita']}
                  labelStyle={{ color: 'hsl(225, 25%, 15%)' }}
                />
                <Bar dataKey="revenue" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Taxa de Ocupação</CardTitle>
            <CardDescription>
              Percentagem de ocupação por mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Ocupação']}
                  labelStyle={{ color: 'hsl(225, 25%, 15%)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="occupancy" 
                  stroke="hsl(217, 91%, 60%)" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(217, 91%, 60%)', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Property Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
            <CardDescription>
              Percentagem de propriedades por tipologia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle>Propriedades em Destaque</CardTitle>
            <CardDescription>
              As suas propriedades com melhor desempenho
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Apartamento Centro Porto", revenue: "€1,200", occupancy: "95%", rating: 4.9 },
                { name: "Casa Vila Nova de Gaia", revenue: "€980", occupancy: "88%", rating: 4.8 },
                { name: "Loft Ribeira", revenue: "€1,050", occupancy: "92%", rating: 4.7 },
              ].map((property, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                  <div>
                    <h4 className="font-semibold">{property.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Receita: {property.revenue} | Ocupação: {property.occupancy}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{property.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};