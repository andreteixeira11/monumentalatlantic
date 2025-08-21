import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Calendar, Euro, Star, TrendingUp, Users, Home, LogOut, CalendarDays, BookOpen, Menu, UserCheck, Banknote, MessageCircle, StarIcon, Building, User, ChevronRight, Receipt, PieChart as PieChartIcon, Settings, FileText, CreditCard, UsersIcon, FileTextIcon, Lock } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ReservationsPage } from "./ReservationsPage";
import { CalendarPage } from "./CalendarPage";
import { GuestRegistryPage } from "./GuestRegistryPage";
import { FinancesPage } from "./FinancesPage";
import { MessagesPage } from "./MessagesPage";
import { ReviewsPage } from "./ReviewsPage";
import { TouristTaxPage } from "./TouristTaxPage";
import { ExpensesPage } from "./ExpensesPage";
import { ConfigurationsPage } from "./ConfigurationsPage";
import { DocumentManagementPage } from "./DocumentManagementPage";
import { BillingPage } from "./BillingPage";
import { StaffManagementPage } from "./StaffManagementPage";
import { TemplatesPage } from "./TemplatesPage";
import { SmartLockPage } from "./SmartLockPage";
import { ProfileEditModal } from "./ProfileEditModal";
import logoImage from "@/assets/logo.png";

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
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "reservations" | "calendar" | "guests" | "finances-report" | "finances-expenses" | "messages" | "reviews" | "tourist-tax" | "configurations" | "documents" | "billing" | "staff" | "templates" | "smart-lock"
  >("dashboard");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "+351 910 123 456",
    company: "Monumental Atlantic",
    address: "Rua de Santa Catarina, 1234",
    city: "Porto",
    country: "Portugal",
    bio: "Gestor de alojamento local com mais de 5 anos de experiência.",
    avatar: ""
  });

  const renderPage = () => {
    switch (currentPage) {
      case "reservations":
        return <ReservationsPage />;
      case "calendar":
        return <CalendarPage />;
      case "guests":
        return <GuestRegistryPage />;
      case "finances-report":
        return <FinancesPage />;
      case "finances-expenses":
        return <ExpensesPage onBack={() => setCurrentPage("finances-report")} />;
      case "messages":
        return <MessagesPage />;
      case "reviews":
        return <ReviewsPage />;
      case "tourist-tax":
        return <TouristTaxPage />;
      case "configurations":
        return <ConfigurationsPage />;
      case "documents":
        return <DocumentManagementPage />;
      case "billing":
        return <BillingPage />;
      case "staff":
        return <StaffManagementPage />;
      case "templates":
        return <TemplatesPage />;
      case "smart-lock":
        return <SmartLockPage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-gradient-primary shadow-soft">
            <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <SidebarTrigger className="text-white hover:bg-white/20 flex-shrink-0" />
                <h1 className="text-lg lg:text-2xl font-bold text-white truncate">Portal Alojamento</h1>
              </div>
              
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 hidden sm:flex"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">{userProfile.name}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 sm:hidden"
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onLogout}
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4 lg:mr-2" />
                  <span className="hidden lg:inline">Sair</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {renderPage()}
          </main>
        </div>

        <ProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentProfile={userProfile}
          onSave={setUserProfile}
        />
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = ({ currentPage, setCurrentPage }: { 
  currentPage: "dashboard" | "reservations" | "calendar" | "guests" | "finances-report" | "finances-expenses" | "messages" | "reviews" | "tourist-tax" | "configurations" | "documents" | "billing" | "staff" | "templates" | "smart-lock"; 
  setCurrentPage: (page: "dashboard" | "reservations" | "calendar" | "guests" | "finances-report" | "finances-expenses" | "messages" | "reviews" | "tourist-tax" | "configurations" | "documents" | "billing" | "staff" | "templates" | "smart-lock") => void;
}) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [financesOpen, setFinancesOpen] = useState(currentPage.startsWith("finances"));

  const menuItems = [
    { id: "dashboard" as const, title: "Dashboard", icon: Home },
    { id: "reservations" as const, title: "Reservas", icon: BookOpen },
    { id: "calendar" as const, title: "Timeline", icon: CalendarDays },
    { id: "guests" as const, title: "Registo Hóspedes", icon: UserCheck },
    { id: "documents" as const, title: "Gestão Documental", icon: FileText },
    { id: "billing" as const, title: "Faturação", icon: CreditCard },
    { id: "staff" as const, title: "Gestão de Staff", icon: UsersIcon },
    { id: "templates" as const, title: "Templates", icon: FileTextIcon },
    { id: "smart-lock" as const, title: "Smart Hub Lock", icon: Lock },
    { id: "messages" as const, title: "Mensagens", icon: MessageCircle },
    { id: "reviews" as const, title: "Reviews", icon: StarIcon },
    { id: "tourist-tax" as const, title: "Taxa Turística", icon: Building },
    { id: "configurations" as const, title: "Configurações", icon: Settings },
  ];

  const financeItems = [
    { id: "finances-report" as const, title: "Relatório", icon: PieChartIcon },
    { id: "finances-expenses" as const, title: "Despesas", icon: Receipt },
  ];

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="Logo" 
              className="h-8 w-8 object-contain flex-shrink-0"
            />
            {!isCollapsed && (
              <span className="text-lg font-semibold truncate">Monumental</span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full ${
                      currentPage === item.id 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Finanças collapsible group */}
              <SidebarMenuItem>
                <Collapsible open={financesOpen} onOpenChange={setFinancesOpen}>
                  <CollapsibleTrigger className="w-full">
                    <SidebarMenuButton 
                      className={`w-full ${
                        currentPage.startsWith("finances") 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-accent"
                      }`}
                    >
                      <Banknote className="h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span>Finanças</span>
                          <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${financesOpen ? 'rotate-90' : ''}`} />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!isCollapsed && (
                    <CollapsibleContent>
                      <div className="ml-4 mt-1 space-y-1">
                        {financeItems.map((item) => (
                          <SidebarMenuButton
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`w-full text-sm ${
                              currentPage === item.id 
                                ? "bg-primary/20 text-primary" 
                                : "hover:bg-accent"
                            }`}
                          >
                            <item.icon className="h-3 w-3" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        ))}
                      </div>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
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