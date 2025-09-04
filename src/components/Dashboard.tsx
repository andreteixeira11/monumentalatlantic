import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area } from "recharts";
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

const propertyPlatformData = [
  { name: "Airbnb", value: 45, color: "hsl(217, 91%, 60%)" },
  { name: "Booking.com", value: 30, color: "hsl(142, 76%, 36%)" },
  { name: "VRBO", value: 15, color: "hsl(48, 96%, 53%)" },
  { name: "Direto", value: 10, color: "hsl(262, 83%, 58%)" },
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

  const menuGroups = [
    {
      label: "Principal",
      items: [
        { id: "dashboard" as const, title: "Dashboard", icon: Home, gradient: true },
        { id: "reservations" as const, title: "Reservas", icon: BookOpen },
        { id: "calendar" as const, title: "Timeline", icon: CalendarDays },
        { id: "guests" as const, title: "Registo Hóspedes", icon: UserCheck },
      ]
    },
    {
      label: "Gestão",
      items: [
        { id: "documents" as const, title: "Gestão Documental", icon: FileText },
        { id: "billing" as const, title: "Faturação", icon: CreditCard },
        { id: "staff" as const, title: "Gestão de Staff", icon: UsersIcon },
        { id: "templates" as const, title: "Templates", icon: FileTextIcon },
        { id: "smart-lock" as const, title: "Smart Hub Lock", icon: Lock },
      ]
    },
    {
      label: "Comunicação",
      items: [
        { id: "messages" as const, title: "Mensagens", icon: MessageCircle },
        { id: "reviews" as const, title: "Reviews", icon: StarIcon },
      ]
    },
    {
      label: "Sistema",
      items: [
        { id: "tourist-tax" as const, title: "Taxa Turística", icon: Building },
        { id: "configurations" as const, title: "Configurações", icon: Settings },
      ]
    }
  ];

  const financeItems = [
    { id: "finances-report" as const, title: "Relatório", icon: PieChartIcon },
    { id: "finances-expenses" as const, title: "Despesas", icon: Receipt },
  ];

  return (
    <Sidebar 
      className={`${isCollapsed ? "w-14" : "w-64"} transition-all duration-300 bg-background/95 border-r border-border/60 backdrop-blur-sm`} 
      collapsible="icon"
    >
      <SidebarContent className="p-0">
        {/* Logo Section */}
        <div className="p-4 border-b border-border/40">
          <div className="flex items-center space-x-2">
            <img 
              src={logoImage} 
              alt="Logo" 
              className="h-8 w-8 object-contain flex-shrink-0 rounded-lg"
            />
            {!isCollapsed && (
              <div>
                <span className="text-sm font-bold text-foreground">Portal</span>
                <p className="text-xs text-muted-foreground">AL</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 py-2">
          {menuGroups.map((group, groupIndex) => (
            <SidebarGroup key={group.label} className="px-2 mb-4">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide px-2 pb-1">
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        onClick={() => setCurrentPage(item.id)}
                        className={`
                          group relative h-9 rounded-lg transition-all duration-200
                          ${currentPage === item.id 
                            ? "bg-primary text-primary-foreground font-medium" 
                            : "hover:bg-accent text-foreground/80 hover:text-foreground"
                          }
                          ${!isCollapsed ? "justify-start pl-3 pr-3" : "justify-center"}
                        `}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && (
                          <span className="ml-2 text-sm truncate">{item.title}</span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
          
          {/* Finanças collapsible group */}
          <SidebarGroup className="px-2 mb-4">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide px-2 pb-1">
                Finanças
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <Collapsible open={financesOpen} onOpenChange={setFinancesOpen}>
                    <CollapsibleTrigger className="w-full">
                      <SidebarMenuButton 
                        className={`
                          group relative h-9 rounded-lg transition-all duration-200 w-full
                          ${currentPage.startsWith("finances") 
                            ? "bg-primary text-primary-foreground font-medium" 
                            : "hover:bg-accent text-foreground/80 hover:text-foreground"
                          }
                          ${!isCollapsed ? "justify-start pl-3 pr-3" : "justify-center"}
                        `}
                      >
                        <Banknote className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="ml-2 text-sm">Finanças</span>
                            <ChevronRight className={`h-3 w-3 ml-auto transition-transform duration-200 ${financesOpen ? 'rotate-90' : ''}`} />
                          </>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {!isCollapsed && (
                      <CollapsibleContent className="animate-accordion-down">
                        <div className="ml-6 mt-1 space-y-1">
                          {financeItems.map((item) => (
                            <SidebarMenuButton
                              key={item.id}
                              onClick={() => setCurrentPage(item.id)}
                              className={`
                                group relative h-8 rounded-md transition-all duration-200 text-sm w-full
                                ${currentPage === item.id 
                                  ? "bg-primary/20 text-primary font-medium" 
                                  : "hover:bg-accent/60 text-foreground/70 hover:text-foreground"
                                }
                                justify-start pl-2 pr-2
                              `}
                            >
                              <item.icon className="h-3 w-3 flex-shrink-0" />
                              <span className="ml-2 truncate">{item.title}</span>
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
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const DashboardContent = () => {
  return (
    <div>
      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="relative overflow-hidden bg-gradient-to-br from-success/10 via-background to-success/5 border-success/20 shadow-strong hover:shadow-glow transition-all duration-300 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-success/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Receita Total
            </CardTitle>
            <div className="p-2 rounded-lg bg-success/10 backdrop-blur-sm">
              <Euro className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
              €12,486
            </div>
            <p className="text-xs text-success flex items-center mt-2 font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20 shadow-strong hover:shadow-glow transition-all duration-300 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Taxa Ocupação
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              88%
            </div>
            <p className="text-xs text-primary flex items-center mt-2 font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.2% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-warning/10 via-background to-warning/5 border-warning/20 shadow-strong hover:shadow-glow transition-all duration-300 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-warning/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Hóspedes Totais
            </CardTitle>
            <div className="p-2 rounded-lg bg-warning/10 backdrop-blur-sm">
              <Users className="h-5 w-5 text-warning" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-warning to-warning/80 bg-clip-text text-transparent">
              246
            </div>
            <p className="text-xs text-warning flex items-center mt-2 font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.1% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-accent/10 via-background to-accent/5 border-accent/20 shadow-strong hover:shadow-glow transition-all duration-300 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Avaliação Média
            </CardTitle>
            <div className="p-2 rounded-lg bg-accent/10 backdrop-blur-sm">
              <Star className="h-5 w-5 text-accent fill-current" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
              4.8
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Baseado em 127 avaliações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modern Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="relative overflow-hidden bg-gradient-to-br from-background to-primary/5 shadow-strong hover:shadow-glow transition-all duration-300 border-primary/20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary"></div>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Receita Mensal</CardTitle>
                <CardDescription className="text-sm">
                  Evolução da receita nos últimos 6 meses
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
                    <stop offset="100%" stopColor="hsl(217, 91%, 40%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  formatter={(value) => [`€${value}`, 'Receita']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="url(#revenueGradient)" 
                  radius={[8, 8, 0, 0]}
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={1}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-background to-success/5 shadow-strong hover:shadow-glow transition-all duration-300 border-success/20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success to-success/80"></div>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Taxa de Ocupação</CardTitle>
                <CardDescription className="text-sm">
                  Percentagem de ocupação por mês
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyData}>
                <defs>
                  <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Ocupação']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="occupancy" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 6, stroke: 'hsl(var(--background))' }}
                  activeDot={{ r: 8, fill: 'hsl(var(--success))', stroke: 'hsl(var(--background))', strokeWidth: 3 }}
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
            <CardTitle>Distribuição por Plataforma</CardTitle>
            <CardDescription>
              Percentagem de reservas por plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={propertyPlatformData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {propertyPlatformData.map((entry, index) => (
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