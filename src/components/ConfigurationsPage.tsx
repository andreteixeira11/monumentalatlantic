import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Settings, Key, CreditCard, FileText, Users, Mail, Wifi, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const [propertySettings, setPropertySettings] = useState({
    propertyName: "Monumental Atlantic",
    propertyType: "apartment",
    maxGuests: 4,
    checkInTime: "15:00",
    checkOutTime: "11:00",
    currency: "EUR",
    language: "pt-PT",
    timezone: "Europe/Lisbon"
  });

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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="apis" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            APIs & Integrações
          </TabsTrigger>
          <TabsTrigger value="property" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Propriedade
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

        {/* Configurações da Propriedade */}
        <TabsContent value="property" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Propriedade</CardTitle>
              <CardDescription>
                Configure as informações básicas da sua propriedade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property-name">Nome da Propriedade</Label>
                  <Input
                    id="property-name"
                    value={propertySettings.propertyName}
                    onChange={(e) => setPropertySettings(prev => ({ ...prev, propertyName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property-type">Tipo de Propriedade</Label>
                  <Select value={propertySettings.propertyType} onValueChange={(value) => setPropertySettings(prev => ({ ...prev, propertyType: value }))}>
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
                  <Label htmlFor="max-guests">Número Máximo de Hóspedes</Label>
                  <Input
                    id="max-guests"
                    type="number"
                    value={propertySettings.maxGuests}
                    onChange={(e) => setPropertySettings(prev => ({ ...prev, maxGuests: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select value={propertySettings.currency} onValueChange={(value) => setPropertySettings(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="GBP">Libra (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkin-time">Hora de Check-in</Label>
                  <Input
                    id="checkin-time"
                    type="time"
                    value={propertySettings.checkInTime}
                    onChange={(e) => setPropertySettings(prev => ({ ...prev, checkInTime: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkout-time">Hora de Check-out</Label>
                  <Input
                    id="checkout-time"
                    type="time"
                    value={propertySettings.checkOutTime}
                    onChange={(e) => setPropertySettings(prev => ({ ...prev, checkOutTime: e.target.value }))}
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