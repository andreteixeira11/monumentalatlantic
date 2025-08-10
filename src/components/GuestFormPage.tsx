import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
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
  const { toast } = useToast();

  const handleInputChange = (field: keyof GuestFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validação básica
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'documentType', 'documentNumber', 'nationality', 'birthDate'];
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Registo de Hóspede</h1>
          <p className="text-muted-foreground">
            Por favor, preencha os seus dados para completar o registo da reserva {reservationId}
          </p>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Dados Pessoais</span>
            </CardTitle>
            <CardDescription>
              Todos os campos marcados com * são obrigatórios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Primeiro Nome *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Digite o seu primeiro nome"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Último Nome *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Digite o seu último nome"
                    required
                  />
                </div>
              </div>

              {/* Contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
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
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+351 900 000 000"
                    required
                  />
                </div>
              </div>

              {/* Documento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Tipo de Documento *</Label>
                  <Select value={formData.documentType} onValueChange={(value) => handleInputChange('documentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BI">Bilhete de Identidade</SelectItem>
                      <SelectItem value="CC">Cartão de Cidadão</SelectItem>
                      <SelectItem value="Passport">Passaporte</SelectItem>
                      <SelectItem value="DL">Carta de Condução</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentNumber">Número do Documento *</Label>
                  <Input
                    id="documentNumber"
                    value={formData.documentNumber}
                    onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                    placeholder="Número do documento"
                    required
                  />
                </div>
              </div>

              {/* Nacionalidade e Data de Nascimento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nacionalidade *</Label>
                  <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a nacionalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Portuguesa">Portuguesa</SelectItem>
                      <SelectItem value="Espanhola">Espanhola</SelectItem>
                      <SelectItem value="Francesa">Francesa</SelectItem>
                      <SelectItem value="Alemã">Alemã</SelectItem>
                      <SelectItem value="Italiana">Italiana</SelectItem>
                      <SelectItem value="Brasileira">Brasileira</SelectItem>
                      <SelectItem value="Outra">Outra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Morada */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Morada</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Rua, número, andar"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Cidade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="País"
                    />
                  </div>
                </div>
              </div>

              {/* Pedidos Especiais */}
              <div className="space-y-2">
                <Label htmlFor="specialRequests">Pedidos Especiais</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Algum pedido especial ou informação adicional?"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Dados
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Os seus dados são tratados com segurança e confidencialidade.</p>
          <p>Para dúvidas, contacte-nos através do email ou telefone fornecido na reserva.</p>
        </div>
      </div>
    </div>
  );
};