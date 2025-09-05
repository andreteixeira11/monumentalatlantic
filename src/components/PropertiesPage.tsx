import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Home, MapPin, Users, Bed, Bath, Square, Edit, Trash2, Settings, Wifi, Car, TvIcon, AirVent, CheckCircle, Clock, Link, Building, Receipt, Bell, FileText, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Property {
  id: string;
  name: string;
  address: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  area: number;
  status: "ativo" | "inativo" | "manutencao";
  amenities: string[];
  description: string;
  images: string[];
  isOnboarded: boolean;
  platforms: {
    airbnb: { connected: boolean; accountId?: string; };
    booking: { connected: boolean; accountId?: string; };
    vrbo: { connected: boolean; accountId?: string; };
  };
  touristTax: {
    enabled: boolean;
    rate?: number;
    exemptions?: string[];
  };
  smartLock: {
    connected: boolean;
    deviceId?: string;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
  };
}

const mockProperties: Property[] = [
  {
    id: "PROP-001",
    name: "Apartamento Centro Histórico",
    address: "Rua de Santa Catarina, 123, Porto",
    propertyType: "apartamento",
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    area: 85,
    status: "ativo",
    amenities: ["wifi", "tv", "kitchen", "heating"],
    description: "Apartamento moderno no coração do Porto, próximo de todas as atrações turísticas.",
    images: [],
    isOnboarded: true,
    platforms: {
      airbnb: { connected: true, accountId: "AH123456" },
      booking: { connected: true, accountId: "BK789012" },
      vrbo: { connected: false }
    },
    touristTax: {
      enabled: true,
      rate: 2.50,
      exemptions: ["children"]
    },
    smartLock: {
      connected: true,
      deviceId: "SL001"
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: true
    }
  },
  {
    id: "PROP-002",
    name: "Casa de Campo Douro",
    address: "Quinta do Vale, Peso da Régua",
    propertyType: "casa",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    area: 120,
    status: "ativo",
    amenities: ["wifi", "pool", "garden", "parking"],
    description: "Casa de campo com vista deslumbrante sobre o Rio Douro.",
    images: [],
    isOnboarded: false,
    platforms: {
      airbnb: { connected: false },
      booking: { connected: false },
      vrbo: { connected: false }
    },
    touristTax: {
      enabled: false
    },
    smartLock: {
      connected: false
    },
    notifications: {
      emailEnabled: false,
      smsEnabled: false
    }
  }
];

export const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingProperty, setOnboardingProperty] = useState<Property | null>(null);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    propertyType: '',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    area: 0
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-success/20 text-success border-success/30";
      case "inativo":
        return "bg-muted/50 text-muted-foreground border-muted/30";
      case "manutencao":
        return "bg-warning/20 text-warning border-warning/30";
      default:
        return "bg-muted/50 text-muted-foreground border-muted/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ativo":
        return "Ativo";
      case "inativo":
        return "Inativo";
      case "manutencao":
        return "Manutenção";
      default:
        return "Desconhecido";
    }
  };

  const startOnboarding = (property: Property) => {
    setOnboardingProperty(property);
    setOnboardingStep(1);
    setIsOnboardingOpen(true);
  };

  const handleNextStep = () => {
    if (onboardingStep < 5) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      // Complete onboarding
      if (onboardingProperty) {
        setProperties(prev => prev.map(p => 
          p.id === onboardingProperty.id 
            ? { ...p, isOnboarded: true }
            : p
        ));
      }
      setIsOnboardingOpen(false);
      toast({
        title: "Onboarding Concluído",
        description: "A sua propriedade foi configurada com sucesso!",
      });
    }
  };

  const handlePrevStep = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const handleCreateProperty = async () => {
    if (!newProperty.name || !newProperty.address || !newProperty.propertyType) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro",
        description: "Utilizador não autenticado.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([{
          name: newProperty.name,
          address: newProperty.address,
          property_type: newProperty.propertyType,
          bedrooms: newProperty.bedrooms,
          bathrooms: newProperty.bathrooms,
          max_guests: newProperty.maxGuests,
          area_m2: newProperty.area,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      const createdProperty: Property = {
        id: data.id,
        name: data.name,
        address: data.address,
        propertyType: data.property_type,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        maxGuests: data.max_guests,
        area: data.area_m2,
        status: "ativo",
        amenities: [],
        description: "",
        images: [],
        isOnboarded: false,
        platforms: {
          airbnb: { connected: false },
          booking: { connected: false },
          vrbo: { connected: false }
        },
        touristTax: { enabled: false },
        smartLock: { connected: false },
        notifications: { emailEnabled: false, smsEnabled: false }
      };

      setProperties(prev => [...prev, createdProperty]);
      setIsAddModalOpen(false);
      setNewProperty({
        name: '',
        address: '',
        propertyType: '',
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        area: 0
      });

      toast({
        title: "Propriedade Criada",
        description: "A propriedade foi criada com sucesso!",
      });

      // Start onboarding automatically
      startOnboarding(createdProperty);

    } catch (error) {
      console.error('Error creating property:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a propriedade. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const renderOnboardingContent = () => {
    switch (onboardingStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Building className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Configurar Taxa Turística</h3>
              <p className="text-muted-foreground">Configure as taxas turísticas para a sua propriedade</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="tourist-tax">Ativar Taxa Turística</Label>
                <Switch id="tourist-tax" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tax-rate">Taxa por Noite (€)</Label>
                  <Input id="tax-rate" type="number" placeholder="2.50" step="0.50" />
                </div>
                <div>
                  <Label htmlFor="exemption-age">Idade Isenção</Label>
                  <Input id="exemption-age" type="number" placeholder="12" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="exemption-notes">Observações sobre Isenções</Label>
                <Textarea id="exemption-notes" placeholder="Ex: Crianças menores de 12 anos são isentas..." />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Link className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Conectar Plataformas</h3>
              <p className="text-muted-foreground">Integre com as principais plataformas de reservas</p>
            </div>
            
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 font-bold text-sm">A</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Airbnb</h4>
                      <p className="text-sm text-muted-foreground">Conectar com a sua conta Airbnb</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Conectar</Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">B</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Booking.com</h4>
                      <p className="text-sm text-muted-foreground">Conectar com a sua conta Booking</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Conectar</Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 font-bold text-sm">V</span>
                    </div>
                    <div>
                      <h4 className="font-medium">VRBO/Expedia</h4>
                      <p className="text-sm text-muted-foreground">Conectar com a sua conta VRBO</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Conectar</Button>
                </div>
              </Card>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Receipt className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Configurar SIBA</h3>
              <p className="text-muted-foreground">Sistema Integrado de Gestão de Dados de Visitantes</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="siba-code">Código SIBA</Label>
                <Input id="siba-code" placeholder="Digite o código SIBA da propriedade" />
              </div>
              
              <div>
                <Label htmlFor="siba-region">Região Turística</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="norte">Norte</SelectItem>
                    <SelectItem value="centro">Centro</SelectItem>
                    <SelectItem value="lisboa">Lisboa</SelectItem>
                    <SelectItem value="alentejo">Alentejo</SelectItem>
                    <SelectItem value="algarve">Algarve</SelectItem>
                    <SelectItem value="madeira">Madeira</SelectItem>
                    <SelectItem value="acores">Açores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-report">Relatório Automático</Label>
                <Switch id="auto-report" />
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  O sistema enviará automaticamente os dados dos hóspedes para o SIBA
                  de acordo com as obrigações legais.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Configurar Formulários</h3>
              <p className="text-muted-foreground">Personalize os formulários de check-in e informações</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Formulário de Check-in</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="checkin-time" defaultChecked />
                    <Label htmlFor="checkin-time" className="text-sm">Hora de chegada</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="car-plate" />
                    <Label htmlFor="car-plate" className="text-sm">Matrícula do carro</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="special-requests" defaultChecked />
                    <Label htmlFor="special-requests" className="text-sm">Pedidos especiais</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="emergency-contact" />
                    <Label htmlFor="emergency-contact" className="text-sm">Contacto emergência</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="welcome-message">Mensagem de Boas-vindas</Label>
                <Textarea 
                  id="welcome-message" 
                  rows={3}
                  placeholder="Bem-vindos à nossa propriedade! Esperamos que tenham uma estadia maravilhosa..."
                />
              </div>
              
              <div>
                <Label htmlFor="house-rules">Regras da Casa</Label>
                <Textarea 
                  id="house-rules" 
                  rows={4}
                  placeholder="- Check-in após as 15:00&#10;- Check-out até as 11:00&#10;- Não fumar no interior&#10;- Máximo 4 pessoas"
                />
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Configurar Notificações</h3>
              <p className="text-muted-foreground">Defina como quer ser notificado sobre a sua propriedade</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Notificações por Email</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-bookings">Novas reservas</Label>
                    <Switch id="email-bookings" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-checkin">Check-ins hoje</Label>
                    <Switch id="email-checkin" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-reviews">Novas avaliações</Label>
                    <Switch id="email-reviews" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-messages">Mensagens de hóspedes</Label>
                    <Switch id="email-messages" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Notificações por SMS</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-urgent">Apenas urgentes</Label>
                    <Switch id="sms-urgent" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-checkin">Check-ins hoje</Label>
                    <Switch id="sms-checkin" />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notification-phone">Telemóvel para SMS</Label>
                <Input id="notification-phone" placeholder="+351 910 123 456" />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent">
            Minhas Propriedades
          </h1>
          <p className="text-muted-foreground">Gerir e configurar as suas propriedades</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-soft">
              <Plus className="h-4 w-4 mr-2" />
              Nova Propriedade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Propriedade</DialogTitle>
              <DialogDescription>
                Preencha os dados básicos da propriedade
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2">
                <Label htmlFor="name">Nome da Propriedade</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Apartamento Centro Porto"
                  value={newProperty.name}
                  onChange={(e) => setNewProperty(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Morada Completa</Label>
                <Input 
                  id="address" 
                  placeholder="Rua, número, código postal, cidade"
                  value={newProperty.address}
                  onChange={(e) => setNewProperty(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo de Propriedade</Label>
                <Select value={newProperty.propertyType} onValueChange={(value) => setNewProperty(prev => ({ ...prev, propertyType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="quarto">Quarto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bedrooms">Quartos</Label>
                <Input 
                  id="bedrooms" 
                  type="number" 
                  placeholder="2"
                  value={newProperty.bedrooms}
                  onChange={(e) => setNewProperty(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Casas de Banho</Label>
                <Input 
                  id="bathrooms" 
                  type="number" 
                  placeholder="1"
                  value={newProperty.bathrooms}
                  onChange={(e) => setNewProperty(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div>
                <Label htmlFor="max-guests">Máx. Hóspedes</Label>
                <Input 
                  id="max-guests" 
                  type="number" 
                  placeholder="4"
                  value={newProperty.maxGuests}
                  onChange={(e) => setNewProperty(prev => ({ ...prev, maxGuests: parseInt(e.target.value) || 2 }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProperty}>
                Criar Propriedade
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="shadow-medium hover:shadow-strong transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.address}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(property.status)}>
                  {getStatusText(property.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Property Details */}
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{property.bedrooms}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{property.bathrooms}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{property.maxGuests}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Square className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{property.area}m²</span>
                </div>
              </div>

              {/* Platform Status */}
              <div>
                <p className="text-sm font-medium mb-2">Plataformas Conectadas:</p>
                <div className="flex space-x-2">
                  <Badge variant={property.platforms.airbnb.connected ? "default" : "secondary"} className="text-xs">
                    Airbnb {property.platforms.airbnb.connected && <CheckCircle className="h-3 w-3 ml-1" />}
                  </Badge>
                  <Badge variant={property.platforms.booking.connected ? "default" : "secondary"} className="text-xs">
                    Booking {property.platforms.booking.connected && <CheckCircle className="h-3 w-3 ml-1" />}
                  </Badge>
                  <Badge variant={property.platforms.vrbo.connected ? "default" : "secondary"} className="text-xs">
                    VRBO {property.platforms.vrbo.connected && <CheckCircle className="h-3 w-3 ml-1" />}
                  </Badge>
                </div>
              </div>

              {/* Onboarding Status */}
              {!property.isOnboarded && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium text-warning">Configuração Pendente</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => startOnboarding(property)}
                      className="text-warning border-warning hover:bg-warning/10"
                    >
                      Configurar
                    </Button>
                  </div>
                  <p className="text-xs text-warning/80 mt-1">
                    Complete a configuração para ativar todas as funcionalidades
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Onboarding Dialog */}
      <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Configuração da Propriedade</span>
            </DialogTitle>
            <DialogDescription>
              {onboardingProperty?.name} - Passo {onboardingStep} de 5
            </DialogDescription>
          </DialogHeader>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-6">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(onboardingStep / 5) * 100}%` }}
            />
          </div>

          {renderOnboardingContent()}

          <div className="flex justify-between pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              disabled={onboardingStep === 1}
            >
              Anterior
            </Button>
            <Button onClick={handleNextStep}>
              {onboardingStep === 5 ? 'Concluir' : 'Próximo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};