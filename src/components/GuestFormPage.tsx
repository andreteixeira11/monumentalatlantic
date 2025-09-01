import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { User, FileText, Globe, Calendar, Send, Upload, Camera, Users, CheckCircle } from "lucide-react";
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
  documentPhoto?: File;
}

interface GuestFormPageProps {
  reservationId?: string;
  reservationGuests?: number;
}

export const GuestFormPage = ({ reservationId = "RES-001", reservationGuests = 2 }: GuestFormPageProps) => {
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  const [guestsData, setGuestsData] = useState<GuestFormData[]>(
    Array.from({ length: reservationGuests }, () => ({
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
    }))
  );
  const [completedGuests, setCompletedGuests] = useState<boolean[]>(new Array(reservationGuests).fill(false));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formConfig, setFormConfig] = useState({
    showNationality: true,
    showBirthDate: true,
    showAddress: true,
    showSpecialRequests: true,
    showDocumentPhoto: true,
    customMessage: "Por favor, preencha os dados de todos os hóspedes para completar o check-in.",
    theme: "modern"
  });
  const { toast } = useToast();

  // Simulate loading form configuration from settings
  useEffect(() => {
    const savedConfig = localStorage.getItem('guestFormConfig');
    if (savedConfig) {
      setFormConfig({ ...formConfig, ...JSON.parse(savedConfig) });
    }
  }, []);

  const currentGuestData = guestsData[currentGuestIndex];

  const handleInputChange = (field: keyof GuestFormData, value: string | File) => {
    const updatedGuestsData = [...guestsData];
    if (field === 'documentPhoto' && value instanceof File) {
      updatedGuestsData[currentGuestIndex] = { ...updatedGuestsData[currentGuestIndex], [field]: value };
    } else if (typeof value === 'string') {
      updatedGuestsData[currentGuestIndex] = { ...updatedGuestsData[currentGuestIndex], [field]: value };
    }
    setGuestsData(updatedGuestsData);
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('documentPhoto', file);
      toast({
        title: "Documento Carregado",
        description: `Documento de ${file.name} carregado com sucesso.`,
      });
    }
  };

  const validateCurrentGuest = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'documentType', 'documentNumber'];
    if (formConfig.showNationality) requiredFields.push('nationality');
    if (formConfig.showBirthDate) requiredFields.push('birthDate');
    
    return requiredFields.every(field => currentGuestData[field as keyof GuestFormData]);
  };

  const handleNextGuest = () => {
    if (!validateCurrentGuest()) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    const updatedCompleted = [...completedGuests];
    updatedCompleted[currentGuestIndex] = true;
    setCompletedGuests(updatedCompleted);

    if (currentGuestIndex < reservationGuests - 1) {
      setCurrentGuestIndex(currentGuestIndex + 1);
    }
  };

  const handlePreviousGuest = () => {
    if (currentGuestIndex > 0) {
      setCurrentGuestIndex(currentGuestIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate all guests
    const allValid = guestsData.every((_, index) => {
      const guestData = guestsData[index];
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'documentType', 'documentNumber'];
      if (formConfig.showNationality) requiredFields.push('nationality');
      if (formConfig.showBirthDate) requiredFields.push('birthDate');
      
      return requiredFields.every(field => guestData[field as keyof GuestFormData]);
    });

    if (!allValid) {
      toast({
        title: "Dados Incompletos",
        description: "Por favor, complete os dados de todos os hóspedes.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Check-in Completo",
        description: "Dados de todos os hóspedes enviados com sucesso!",
      });

      // Reset form
      setGuestsData(Array.from({ length: reservationGuests }, () => ({
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
      })));
      setCompletedGuests(new Array(reservationGuests).fill(false));
      setCurrentGuestIndex(0);
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

  const allGuestsCompleted = completedGuests.every(completed => completed);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <Card className="shadow-soft bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Check-in - Reserva {reservationId}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {formConfig.customMessage}
          </CardDescription>
          
          {/* Guest Progress */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {Array.from({ length: reservationGuests }, (_, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-all ${
                    index === currentGuestIndex
                      ? 'bg-primary text-primary-foreground shadow-medium'
                      : completedGuests[index]
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  onClick={() => setCurrentGuestIndex(index)}
                >
                  {completedGuests[index] ? <CheckCircle className="h-5 w-5" /> : index + 1}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Hóspede {currentGuestIndex + 1} de {reservationGuests}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Current Guest Form */}
      <Card className="shadow-medium bg-gradient-to-br from-card to-card/50 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Dados do Hóspede {currentGuestIndex + 1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Primeiro Nome *</Label>
                <Input
                  id="firstName"
                  value={currentGuestData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Digite o primeiro nome"
                  className="bg-background/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Último Nome *</Label>
                <Input
                  id="lastName"
                  value={currentGuestData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Digite o último nome"
                  className="bg-background/50"
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
                  value={currentGuestData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-background/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={currentGuestData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+351 900 000 000"
                  className="bg-background/50"
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
                <Select value={currentGuestData.documentType} onValueChange={(value) => handleInputChange("documentType", value)}>
                  <SelectTrigger id="documentType" className="bg-background/50">
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
                  value={currentGuestData.documentNumber}
                  onChange={(e) => handleInputChange("documentNumber", e.target.value)}
                  placeholder="Número do documento"
                  className="bg-background/50"
                  required
                />
              </div>
            </div>

            {/* Document Photo Upload */}
            {formConfig.showDocumentPhoto && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Fotografia do Documento (Opcional)
                </Label>
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-background/50"
                    onClick={() => document.getElementById('document-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Carregar Documento
                  </Button>
                  <input
                    id="document-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                  {currentGuestData.documentPhoto && (
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Documento carregado
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Nationality - Conditional */}
            {formConfig.showNationality && (
              <div className="space-y-2">
                <Label htmlFor="nationality" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Nacionalidade *
                </Label>
                <Select value={currentGuestData.nationality} onValueChange={(value) => handleInputChange("nationality", value)}>
                  <SelectTrigger id="nationality" className="bg-background/50">
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
                  value={currentGuestData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  className="bg-background/50"
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
                    value={currentGuestData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Rua, número"
                    className="bg-background/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={currentGuestData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Cidade"
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      value={currentGuestData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      placeholder="País"
                      className="bg-background/50"
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
                  value={currentGuestData.specialRequests}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  placeholder="Algum pedido especial ou informação adicional..."
                  rows={3}
                  className="bg-background/50"
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousGuest}
                disabled={currentGuestIndex === 0}
              >
                Anterior
              </Button>

              <div className="flex space-x-2">
                {currentGuestIndex < reservationGuests - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNextGuest}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Próximo Hóspede
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !allGuestsCompleted}
                    className="bg-success hover:bg-success/90"
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
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Os seus dados são tratados com total confidencialidade e segurança.</p>
      </div>
    </div>
  );
};
