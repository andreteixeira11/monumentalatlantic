import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { User, FileText, Globe, Calendar, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GuestFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  nationality: string;
  birthDate: string;
  address: string;
  city: string;
  country: string;
  specialRequests: string;
}

interface GuestFormPageProps {
  reservationId?: string;
}

export const GuestFormPage = ({ reservationId = "RES-001" }: GuestFormPageProps) => {
  const [formData, setFormData] = useState<GuestFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    documentType: "",
    documentNumber: "",
    nationality: "",
    birthDate: "",
    address: "",
    city: "",
    country: "",
    specialRequests: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formConfig, setFormConfig] = useState({
    showNationality: true,
    showBirthDate: true,
    showAddress: true,
    showSpecialRequests: true,
    customMessage: "Por favor, preencha os seus dados para completar o check-in.",
    theme: "modern"
  });
  const { toast } = useToast();

  // Simulate loading form configuration from settings
  useEffect(() => {
    // In a real app, this would come from the configurations API
    const savedConfig = localStorage.getItem('guestFormConfig');
    if (savedConfig) {
      setFormConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleInputChange = (field: keyof GuestFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validação básica
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'documentType', 'documentNumber'];
    if (formConfig.showNationality) requiredFields.push('nationality');
    if (formConfig.showBirthDate) requiredFields.push('birthDate');
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof GuestFormData]);

    if (missingFields.length > 0) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Dados Enviados com Sucesso",
        description: "Os seus dados foram enviados e serão processados em breve.",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        documentType: "",
        documentNumber: "",
        nationality: "",
        birthDate: "",
        address: "",
        city: "",
        country: "",
        specialRequests: ""
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getThemeClasses = () => {
    switch (formConfig.theme) {
      case 'elegant':
        return 'bg-gradient-to-br from-background to-muted/20 border-primary/30 shadow-primary/10';
      case 'minimal':
        return 'border-muted shadow-sm';
      case 'classic':
        return 'border-border shadow-md bg-card';
      default: // modern
        return 'border-primary/20 shadow-soft bg-gradient-to-br from-card to-card/50';
    }
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 ${formConfig.theme === 'elegant' ? 'bg-gradient-to-br from-background to-muted/20' : ''}`}>
      <Card className={`shadow-lg ${getThemeClasses()}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Check-in - Reserva {reservationId}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {formConfig.customMessage}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Primeiro Nome *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Digite o seu primeiro nome"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Último Nome *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Digite o seu último nome"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+351 900 000 000"
                  required
                />
              </div>
            </div>

            {/* Document Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="documentType" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Tipo de Documento *
                </Label>
                <Select value={formData.documentType} onValueChange={(value) => handleInputChange("documentType", value)}>
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Selecione o tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cc">Cartão de Cidadão</SelectItem>
                    <SelectItem value="bi">Bilhete de Identidade</SelectItem>
                    <SelectItem value="passport">Passaporte</SelectItem>
                    <SelectItem value="driving-license">Carta de Condução</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentNumber">Número do Documento *</Label>
                <Input
                  id="documentNumber"
                  value={formData.documentNumber}
                  onChange={(e) => handleInputChange("documentNumber", e.target.value)}
                  placeholder="Número do documento"
                  required
                />
              </div>
            </div>

            {/* Nationality - Conditional */}
            {formConfig.showNationality && (
              <div className="space-y-2">
                <Label htmlFor="nationality" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Nacionalidade *
                </Label>
                <Select value={formData.nationality} onValueChange={(value) => handleInputChange("nationality", value)}>
                  <SelectTrigger id="nationality">
                    <SelectValue placeholder="Selecione a sua nacionalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portuguesa">Portuguesa</SelectItem>
                    <SelectItem value="spanish">Espanhola</SelectItem>
                    <SelectItem value="french">Francesa</SelectItem>
                    <SelectItem value="german">Alemã</SelectItem>
                    <SelectItem value="british">Britânica</SelectItem>
                    <SelectItem value="italian">Italiana</SelectItem>
                    <SelectItem value="dutch">Holandesa</SelectItem>
                    <SelectItem value="brazilian">Brasileira</SelectItem>
                    <SelectItem value="other">Outra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Birth Date - Conditional */}
            {formConfig.showBirthDate && (
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data de Nascimento *
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  required
                />
              </div>
            )}

            {/* Address - Conditional */}
            {formConfig.showAddress && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="address">Morada</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Rua, número"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Cidade"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      placeholder="País"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Special Requests - Conditional */}
            {formConfig.showSpecialRequests && (
              <div className="space-y-2">
                <Label htmlFor="specialRequests">Pedidos Especiais (Opcional)</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  placeholder="Algum pedido especial ou informação adicional..."
                  rows={3}
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Completar Check-in
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Os seus dados são tratados com total confidencialidade e segurança.</p>
      </div>
    </div>
  );
};