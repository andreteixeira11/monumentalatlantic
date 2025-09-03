import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Settings, Key, CreditCard, FileText, Users, Mail, Wifi, Home, Building, Hash, Euro, Plus, Trash2, Eye, Cog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PropertyConfigModal } from "./PropertyConfigModal";

interface ApiConfiguration {
  bookingApi: string;
  airbnbApi: string;
  expediaApi: string;
  touristTaxApi: string;
  paymentGateway: string;
  emailService: string;
  smsService: string;
}

interface GuestFormLayout {
  showPhoto: boolean;
  showNationality: boolean;
  showBirthDate: boolean;
  showAddress: boolean;
  showSpecialRequests: boolean;
  requiredFields: string[];
  customMessage: string;
  theme: string;
}

interface Property {
  id: string;
  name: string;
  type: string;
  maxGuests: number;
  checkInTime: string;
  checkOutTime: string;
  isActive: boolean;
}

interface SibaConfig {
  accessKey: string;
  accommodationName: string;
  establishmentNumber: string;
}

interface TouristTaxConfig {
  municipality: string;
  apiEndpoint: string;
  accessKey: string;
  establishmentCode: string;
  taxRate: number;
}

const PropertyCard = ({ property, index, properties, setProperties }: {
  property: Property;
  index: number;
  properties: Property[];
  setProperties: (properties: Property[]) => void;
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);

  const handleSavePropertyConfig = (propertyId: string, config: any) => {
    // Config is already saved in the modal to localStorage
    console.log(`Config saved for property ${propertyId}`);
  };

  return (
    <>
      <div className="p-4 border rounded-lg bg-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Nome da Propriedade</Label>
            <Input
              value={property.name}
              onChange={(e) => {
                const updated = [...properties];
                updated[index].name = e.target.value;
                setProperties(updated);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Propriedade</Label>
            <Select 
              value={property.type} 
              onValueChange={(value) => {
                const updated = [...properties];
                updated[index].type = value;
                setProperties(updated);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartamento</SelectItem>
                <SelectItem value="house">Casa</SelectItem>
                <SelectItem value="studio">Estúdio</SelectItem>
                <SelectItem value="villa">Moradia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Máximo de Hóspedes</Label>
            <Input
              type="number"
              value={property.maxGuests}
              onChange={(e) => {
                const updated = [...properties];
                updated[index].maxGuests = parseInt(e.target.value);
                setProperties(updated);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Check-in</Label>
            <Input
              type="time"
              value={property.checkInTime}
              onChange={(e) => {
                const updated = [...properties];
                updated[index].checkInTime = e.target.value;
                setProperties(updated);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Check-out</Label>
            <Input
              type="time"
              value={property.checkOutTime}
              onChange={(e) => {
                const updated = [...properties];
                updated[index].checkOutTime = e.target.value;
                setProperties(updated);
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={property.isActive}
                onCheckedChange={(checked) => {
                  const updated = [...properties];
                  updated[index].isActive = checked;
                  setProperties(updated);
                }}
              />
              <Label>Ativa</Label>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfigModal(true)}
              >
                <Cog className="h-4 w-4 mr-1" />
                Config
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setProperties(properties.filter(p => p.id !== property.id));
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Configuration badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {localStorage.getItem(`property-config-${property.id}`) && (
            <>
              <Badge variant="secondary">SIBA</Badge>
              <Badge variant="secondary">Taxa Turística</Badge>
              <Badge variant="secondary">INE</Badge>
              <Badge variant="secondary">Formulário</Badge>
              <Badge variant="secondary">Notificações</Badge>
            </>
          )}
        </div>
      </div>

      <PropertyConfigModal
        property={property}
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onSave={handleSavePropertyConfig}
      />
    </>
  );
};

export const ConfigurationsPage = () => {
  const { toast } = useToast();
  const [apiConfig, setApiConfig] = useState<ApiConfiguration>({
    bookingApi: "",
    airbnbApi: "",
    expediaApi: "",
    touristTaxApi: "",
    paymentGateway: "",
    emailService: "",
    smsService: ""
  });

  const [guestFormLayout, setGuestFormLayout] = useState<GuestFormLayout>({
    showPhoto: true,
    showNationality: true,
    showBirthDate: true,
    showAddress: true,
    showSpecialRequests: true,
    requiredFields: ["firstName", "lastName", "email", "documentNumber"],
    customMessage: "Por favor, preencha os seus dados para completar o check-in.",
    theme: "modern"
  });

  const [properties, setProperties] = useState<Property[]>([
    {
      id: "prop-1",
      name: "Monumental Atlantic",
      type: "apartment",
      maxGuests: 4,
      checkInTime: "15:00",
      checkOutTime: "11:00",
      isActive: true
    }
  ]);

  const [sibaConfig, setSibaConfig] = useState<SibaConfig>({
    accessKey: "",
    accommodationName: "",
    establishmentNumber: ""
  });

  const [touristTaxConfig, setTouristTaxConfig] = useState<TouristTaxConfig>({
    municipality: "",
    apiEndpoint: "",
    accessKey: "",
    establishmentCode: "",
    taxRate: 2.0
  });

  const [showFormPreview, setShowFormPreview] = useState(false);

  const handleSaveConfig = () => {
    // Save guest form configuration to localStorage
    localStorage.setItem('guestFormConfig', JSON.stringify({
      showNationality: guestFormLayout.showNationality,
      showBirthDate: guestFormLayout.showBirthDate,
      showAddress: guestFormLayout.showAddress,
      showSpecialRequests: guestFormLayout.showSpecialRequests,
      customMessage: guestFormLayout.customMessage,
      theme: guestFormLayout.theme
    }));

    toast({
      title: "Configurações Guardadas",
      description: "As suas configurações foram guardadas com sucesso e aplicadas ao formulário de hóspedes."
    });
  };

  const handleTestApi = (apiName: string) => {
    toast({
      title: "Teste de API",
      description: `A testar ligação com ${apiName}...`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>

      <Tabs defaultValue="apis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="apis" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            APIs & Integrações
          </TabsTrigger>
          <TabsTrigger value="property" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Propriedades
          </TabsTrigger>
          <TabsTrigger value="siba-tax" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            SIBA & Taxa
          </TabsTrigger>
          <TabsTrigger value="guest-form" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Formulário Hóspedes
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        {/* APIs & Integrações */}
        <TabsContent value="apis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Plataformas de Reserva
              </CardTitle>
              <CardDescription>
                Configure as suas chaves API para integração com plataformas de reserva
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="booking-api">Booking.com API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="booking-api"
                      type="password"
                      placeholder="Digite a chave API do Booking.com"
                      value={apiConfig.bookingApi}
                      onChange={(e) => setApiConfig(prev => ({ ...prev, bookingApi: e.target.value }))}
                    />
                    <Button variant="outline" onClick={() => handleTestApi("Booking.com")}>
                      Testar
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="airbnb-api">Airbnb API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="airbnb-api"
                      type="password"
                      placeholder="Digite a chave API do Airbnb"
                      value={apiConfig.airbnbApi}
                      onChange={(e) => setApiConfig(prev => ({ ...prev, airbnbApi: e.target.value }))}
                    />
                    <Button variant="outline" onClick={() => handleTestApi("Airbnb")}>
                      Testar
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expedia-api">Expedia API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="expedia-api"
                      type="password"
                      placeholder="Digite a chave API do Expedia"
                      value={apiConfig.expediaApi}
                      onChange={(e) => setApiConfig(prev => ({ ...prev, expediaApi: e.target.value }))}
                    />
                    <Button variant="outline" onClick={() => handleTestApi("Expedia")}>
                      Testar
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tourist-tax-api">Taxa Turística API</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tourist-tax-api"
                      type="password"
                      placeholder="Digite a chave API da Taxa Turística"
                      value={apiConfig.touristTaxApi}
                      onChange={(e) => setApiConfig(prev => ({ ...prev, touristTaxApi: e.target.value }))}
                    />
                    <Button variant="outline" onClick={() => handleTestApi("Taxa Turística")}>
                      Testar
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Serviços de Pagamento & Comunicação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-gateway">Gateway de Pagamento</Label>
                    <Select value={apiConfig.paymentGateway} onValueChange={(value) => setApiConfig(prev => ({ ...prev, paymentGateway: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o gateway" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="multibanco">Multibanco</SelectItem>
                        <SelectItem value="mbway">MB WAY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-service">Serviço de Email</Label>
                    <Select value={apiConfig.emailService} onValueChange={(value) => setApiConfig(prev => ({ ...prev, emailService: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="ses">Amazon SES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestão de Propriedades */}
        <TabsContent value="property" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Minhas Propriedades</CardTitle>
                <CardDescription>
                  Gerir as suas propriedades e configurações específicas
                </CardDescription>
              </div>
              <Button onClick={() => {
                const newProperty: Property = {
                  id: `prop-${Date.now()}`,
                  name: "Nova Propriedade",
                  type: "apartment",
                  maxGuests: 2,
                  checkInTime: "15:00",
                  checkOutTime: "11:00",
                  isActive: true
                };
                setProperties([...properties, newProperty]);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Propriedade
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {properties.map((property, index) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    index={index}
                    properties={properties}
                    setProperties={setProperties}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SIBA & Taxa Turística */}
        <TabsContent value="siba-tax" className="space-y-6">
          {/* SIBA Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Configuração SIBA
              </CardTitle>
              <CardDescription>
                Configure os dados de acesso ao webservice do SIBA para registo de hóspedes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siba-access-key" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Chave de Acesso (SIBA)
                  </Label>
                  <Input
                    id="siba-access-key"
                    type="password"
                    placeholder="Insira a chave de ativação"
                    value={sibaConfig.accessKey}
                    onChange={(e) => setSibaConfig({ ...sibaConfig, accessKey: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Chave de ativação recebida após o registo no SIBA
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siba-accommodation" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Nome Abreviado do Alojamento
                  </Label>
                  <Input
                    id="siba-accommodation"
                    placeholder="Máximo 15 caracteres"
                    maxLength={15}
                    value={sibaConfig.accommodationName}
                    onChange={(e) => setSibaConfig({ ...sibaConfig, accommodationName: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Abreviação do nome do alojamento (máx. 15 caracteres)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siba-establishment" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Número do Estabelecimento
                  </Label>
                  <Input
                    id="siba-establishment"
                    placeholder="Número fornecido pelo SIBA"
                    value={sibaConfig.establishmentNumber}
                    onChange={(e) => setSibaConfig({ ...sibaConfig, establishmentNumber: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Número fornecido pelo SIBA após o registo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tourist Tax Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5" />
                Configuração Taxa Turística
              </CardTitle>
              <CardDescription>
                Configure a integração com o sistema da câmara municipal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax-municipality">Município</Label>
                  <Select
                    value={touristTaxConfig.municipality}
                    onValueChange={(value) => setTouristTaxConfig({ ...touristTaxConfig, municipality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o município" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="porto">Porto (€2.00/noite)</SelectItem>
                      <SelectItem value="gaia">Vila Nova de Gaia (€1.50/noite)</SelectItem>
                      <SelectItem value="matosinhos">Matosinhos (€1.00/noite)</SelectItem>
                      <SelectItem value="maia">Maia (€1.00/noite)</SelectItem>
                      <SelectItem value="gondomar">Gondomar (€0.50/noite)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Taxa por Noite (€)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    step="0.50"
                    value={touristTaxConfig.taxRate}
                    onChange={(e) => setTouristTaxConfig({ ...touristTaxConfig, taxRate: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-endpoint">Endpoint da API</Label>
                  <Input
                    id="tax-endpoint"
                    placeholder="https://api.municipio.pt/taxa-turistica"
                    value={touristTaxConfig.apiEndpoint}
                    onChange={(e) => setTouristTaxConfig({ ...touristTaxConfig, apiEndpoint: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-access-key">Chave de Acesso</Label>
                  <Input
                    id="tax-access-key"
                    type="password"
                    placeholder="Chave fornecida pela câmara municipal"
                    value={touristTaxConfig.accessKey}
                    onChange={(e) => setTouristTaxConfig({ ...touristTaxConfig, accessKey: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tax-establishment-code">Código do Estabelecimento</Label>
                  <Input
                    id="tax-establishment-code"
                    placeholder="Código do seu estabelecimento"
                    value={touristTaxConfig.establishmentCode}
                    onChange={(e) => setTouristTaxConfig({ ...touristTaxConfig, establishmentCode: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuração do Formulário de Hóspedes */}
        <TabsContent value="guest-form" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Layout do Formulário de Hóspedes</CardTitle>
              <CardDescription>
                Personalize o formulário que os hóspedes preenchem durante o check-in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Campos Visíveis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-nationality"
                      checked={guestFormLayout.showNationality}
                      onCheckedChange={(checked) => setGuestFormLayout(prev => ({ ...prev, showNationality: checked }))}
                    />
                    <Label htmlFor="show-nationality">Nacionalidade</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-birthdate"
                      checked={guestFormLayout.showBirthDate}
                      onCheckedChange={(checked) => setGuestFormLayout(prev => ({ ...prev, showBirthDate: checked }))}
                    />
                    <Label htmlFor="show-birthdate">Data de Nascimento</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-address"
                      checked={guestFormLayout.showAddress}
                      onCheckedChange={(checked) => setGuestFormLayout(prev => ({ ...prev, showAddress: checked }))}
                    />
                    <Label htmlFor="show-address">Morada Completa</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-special-requests"
                      checked={guestFormLayout.showSpecialRequests}
                      onCheckedChange={(checked) => setGuestFormLayout(prev => ({ ...prev, showSpecialRequests: checked }))}
                    />
                    <Label htmlFor="show-special-requests">Pedidos Especiais</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tema do Formulário</h3>
                <Select value={guestFormLayout.theme} onValueChange={(value) => setGuestFormLayout(prev => ({ ...prev, theme: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Moderno</SelectItem>
                    <SelectItem value="classic">Clássico</SelectItem>
                    <SelectItem value="minimal">Minimalista</SelectItem>
                    <SelectItem value="elegant">Elegante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-message">Mensagem Personalizada</Label>
                <Textarea
                  id="custom-message"
                  placeholder="Digite uma mensagem personalizada para os hóspedes"
                  value={guestFormLayout.customMessage}
                  onChange={(e) => setGuestFormLayout(prev => ({ ...prev, customMessage: e.target.value }))}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Pré-visualização do Formulário</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowFormPreview(!showFormPreview)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showFormPreview ? "Ocultar" : "Visualizar"} Formulário
                  </Button>
                </div>
                
                {showFormPreview && (
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="max-w-md mx-auto">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold">Check-in - Reserva RES-001</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {guestFormLayout.customMessage}
                        </p>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 border rounded">Primeiro Nome *</div>
                          <div className="p-2 border rounded">Último Nome *</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 border rounded">Email *</div>
                          <div className="p-2 border rounded">Telefone *</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 border rounded">Tipo Documento *</div>
                          <div className="p-2 border rounded">Número Documento *</div>
                        </div>
                        
                        {guestFormLayout.showNationality && (
                          <div className="p-2 border rounded">Nacionalidade *</div>
                        )}
                        
                        {guestFormLayout.showBirthDate && (
                          <div className="p-2 border rounded">Data de Nascimento *</div>
                        )}
                        
                        {guestFormLayout.showAddress && (
                          <>
                            <div className="p-2 border rounded">Morada</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-2 border rounded">Cidade</div>
                              <div className="p-2 border rounded">País</div>
                            </div>
                          </>
                        )}
                        
                        {guestFormLayout.showSpecialRequests && (
                          <div className="p-2 border rounded h-16">Pedidos Especiais</div>
                        )}
                        
                        <div className="p-2 border rounded bg-primary text-primary-foreground text-center font-medium">
                          Completar Check-in
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Configure quando e como receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Novas Reservas</Label>
                    <p className="text-sm text-muted-foreground">Receber notificação de novas reservas</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Check-ins Hoje</Label>
                    <p className="text-sm text-muted-foreground">Lembrete diário dos check-ins</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pagamentos Recebidos</Label>
                    <p className="text-sm text-muted-foreground">Notificação de pagamentos recebidos</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mensagens de Hóspedes</Label>
                    <p className="text-sm text-muted-foreground">Notificação de novas mensagens</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveConfig} className="px-8">
          Guardar Configurações
        </Button>
      </div>
    </div>
  );
};