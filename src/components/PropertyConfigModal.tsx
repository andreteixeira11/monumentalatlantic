import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building, Key, Euro, FileText, Users, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  name: string;
  type: string;
  maxGuests: number;
  checkInTime: string;
  checkOutTime: string;
  isActive: boolean;
}

interface PropertyConfig {
  // SIBA Configuration
  siba: {
    accessKey: string;
    accommodationName: string;
    establishmentNumber: string;
  };
  
  // Tourist Tax Configuration
  touristTax: {
    municipality: string;
    apiEndpoint: string;
    accessKey: string;
    establishmentCode: string;
    taxRate: number;
    isEnabled: boolean;
  };
  
  // INE Configuration
  ine: {
    establishmentCode: string;
    reportEmail: string;
    isEnabled: boolean;
  };
  
  // Guest Form Configuration
  guestForm: {
    showPhoto: boolean;
    showNationality: boolean;
    showBirthDate: boolean;
    showAddress: boolean;
    showSpecialRequests: boolean;
    requiredFields: string[];
    customMessage: string;
    theme: string;
  };
  
  // Notification Configuration
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    checkInReminder: boolean;
    checkOutReminder: boolean;
    reviewRequest: boolean;
    paymentConfirmation: boolean;
  };
}

interface PropertyConfigModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (propertyId: string, config: PropertyConfig) => void;
}

const defaultConfig: PropertyConfig = {
  siba: {
    accessKey: "",
    accommodationName: "",
    establishmentNumber: ""
  },
  touristTax: {
    municipality: "",
    apiEndpoint: "",
    accessKey: "",
    establishmentCode: "",
    taxRate: 2.0,
    isEnabled: false
  },
  ine: {
    establishmentCode: "",
    reportEmail: "",
    isEnabled: false
  },
  guestForm: {
    showPhoto: true,
    showNationality: true,
    showBirthDate: true,
    showAddress: true,
    showSpecialRequests: true,
    requiredFields: ["firstName", "lastName", "email", "documentNumber"],
    customMessage: "Por favor, preencha os seus dados para completar o check-in.",
    theme: "modern"
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    checkInReminder: true,
    checkOutReminder: true,
    reviewRequest: true,
    paymentConfirmation: true
  }
};

export const PropertyConfigModal = ({ property, isOpen, onClose, onSave }: PropertyConfigModalProps) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<PropertyConfig>(defaultConfig);

  useEffect(() => {
    if (property && isOpen) {
      // Load existing config from localStorage or use defaults
      const savedConfig = localStorage.getItem(`property-config-${property.id}`);
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      } else {
        setConfig({
          ...defaultConfig,
          siba: {
            ...defaultConfig.siba,
            accommodationName: property.name
          }
        });
      }
    }
  }, [property, isOpen]);

  const handleSave = () => {
    if (!property) return;

    // Save to localStorage
    localStorage.setItem(`property-config-${property.id}`, JSON.stringify(config));
    
    onSave(property.id, config);
    
    toast({
      title: "Configurações Guardadas",
      description: `Configurações da propriedade ${property.name} foram guardadas com sucesso.`,
    });
    
    onClose();
  };

  const generateINEReport = () => {
    if (!property) return;

    // Mock data for demonstration
    const mockData = [
      { country: "Portugal", nights: 45, guests: 18 },
      { country: "España", nights: 32, guests: 12 },
      { country: "França", nights: 28, guests: 10 },
      { country: "Alemanha", nights: 20, guests: 8 },
      { country: "Reino Unido", nights: 15, guests: 6 }
    ];

    const doc = new (window as any).jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('Relatório INE - Dormidas por País', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Propriedade: ${property.name}`, 20, 50);
    doc.text(`Código do Estabelecimento: ${config.ine.establishmentCode}`, 20, 60);
    doc.text(`Período: ${new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}`, 20, 70);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-PT')}`, 20, 80);
    
    // Table with country data
    const tableData = mockData.map(item => [
      item.country,
      item.guests.toString(),
      item.nights.toString(),
      (item.guests * item.nights).toString()
    ]);
    
    (doc as any).autoTable({
      startY: 100,
      head: [['País', 'Hóspedes', 'Noites', 'Total Dormidas']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
      },
    });
    
    // Totals
    const totalGuests = mockData.reduce((sum, item) => sum + item.guests, 0);
    const totalNights = mockData.reduce((sum, item) => sum + item.nights, 0);
    const totalDormidas = mockData.reduce((sum, item) => sum + (item.guests * item.nights), 0);
    
    const yPosition = (doc as any).lastAutoTable.finalY || 150;
    
    doc.setFontSize(12);
    doc.text(`Total de Hóspedes: ${totalGuests}`, 20, yPosition + 20);
    doc.text(`Total de Noites: ${totalNights}`, 20, yPosition + 30);
    doc.text(`Total de Dormidas: ${totalDormidas}`, 20, yPosition + 40);
    
    // Save PDF
    doc.save(`relatorio-ine-${property.name.replace(/\s+/g, '-')}-${new Date().getMonth() + 1}-${new Date().getFullYear()}.pdf`);
    
    toast({
      title: "Relatório INE Gerado",
      description: "Relatório mensal de dormidas por país foi gerado com sucesso.",
    });
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Configurações - {property.name}
          </DialogTitle>
          <DialogDescription>
            Configure as definições específicas desta propriedade
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="siba" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="siba" className="flex items-center gap-1">
              <Key className="h-3 w-3" />
              SIBA
            </TabsTrigger>
            <TabsTrigger value="tourist-tax" className="flex items-center gap-1">
              <Euro className="h-3 w-3" />
              Taxa Turística
            </TabsTrigger>
            <TabsTrigger value="ine" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              INE
            </TabsTrigger>
            <TabsTrigger value="guest-form" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Formulário
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              Notificações
            </TabsTrigger>
          </TabsList>

          {/* SIBA Tab */}
          <TabsContent value="siba" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuração SIBA</CardTitle>
                <CardDescription>
                  Configurar acesso ao SIBA para esta propriedade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chave de Acesso</Label>
                    <Input
                      type="password"
                      placeholder="Chave de ativação SIBA"
                      value={config.siba.accessKey}
                      onChange={(e) => setConfig({
                        ...config,
                        siba: { ...config.siba, accessKey: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome do Alojamento</Label>
                    <Input
                      placeholder="Nome registado no SIBA"
                      value={config.siba.accommodationName}
                      onChange={(e) => setConfig({
                        ...config,
                        siba: { ...config.siba, accommodationName: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Número do Estabelecimento</Label>
                    <Input
                      placeholder="Número SIBA"
                      value={config.siba.establishmentNumber}
                      onChange={(e) => setConfig({
                        ...config,
                        siba: { ...config.siba, establishmentNumber: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tourist Tax Tab */}
          <TabsContent value="tourist-tax" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Taxa Turística</CardTitle>
                <CardDescription>
                  Configurar taxa turística para esta propriedade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.touristTax.isEnabled}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      touristTax: { ...config.touristTax, isEnabled: checked }
                    })}
                  />
                  <Label>Ativar taxa turística para esta propriedade</Label>
                </div>
                
                {config.touristTax.isEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Município</Label>
                      <Select
                        value={config.touristTax.municipality}
                        onValueChange={(value) => setConfig({
                          ...config,
                          touristTax: { ...config.touristTax, municipality: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar município" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="porto">Porto</SelectItem>
                          <SelectItem value="lisboa">Lisboa</SelectItem>
                          <SelectItem value="braga">Braga</SelectItem>
                          <SelectItem value="coimbra">Coimbra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Taxa por Noite (€)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="2.00"
                        value={config.touristTax.taxRate}
                        onChange={(e) => setConfig({
                          ...config,
                          touristTax: { ...config.touristTax, taxRate: parseFloat(e.target.value) || 0 }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Código do Estabelecimento</Label>
                      <Input
                        placeholder="Código da câmara municipal"
                        value={config.touristTax.establishmentCode}
                        onChange={(e) => setConfig({
                          ...config,
                          touristTax: { ...config.touristTax, establishmentCode: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Chave API</Label>
                      <Input
                        type="password"
                        placeholder="Chave de acesso à API"
                        value={config.touristTax.accessKey}
                        onChange={(e) => setConfig({
                          ...config,
                          touristTax: { ...config.touristTax, accessKey: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* INE Tab */}
          <TabsContent value="ine" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuração INE</CardTitle>
                <CardDescription>
                  Configurar relatórios INE para esta propriedade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.ine.isEnabled}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      ine: { ...config.ine, isEnabled: checked }
                    })}
                  />
                  <Label>Ativar relatórios INE para esta propriedade</Label>
                </div>

                {config.ine.isEnabled && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Código do Estabelecimento (INE)</Label>
                        <Input
                          placeholder="Código registado no INE"
                          value={config.ine.establishmentCode}
                          onChange={(e) => setConfig({
                            ...config,
                            ine: { ...config.ine, establishmentCode: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email para Relatórios</Label>
                        <Input
                          type="email"
                          placeholder="email@exemplo.com"
                          value={config.ine.reportEmail}
                          onChange={(e) => setConfig({
                            ...config,
                            ine: { ...config.ine, reportEmail: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Relatório Mensal de Dormidas</h4>
                        <p className="text-sm text-muted-foreground">
                          Gera relatório com número total de dormidas por país de origem
                        </p>
                      </div>
                      <Button onClick={generateINEReport}>
                        Gerar Relatório
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guest Form Tab */}
          <TabsContent value="guest-form" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Formulário de Hóspedes</CardTitle>
                <CardDescription>
                  Personalizar o formulário para esta propriedade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.guestForm.showPhoto}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        guestForm: { ...config.guestForm, showPhoto: checked }
                      })}
                    />
                    <Label>Permitir upload de foto do documento</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.guestForm.showNationality}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        guestForm: { ...config.guestForm, showNationality: checked }
                      })}
                    />
                    <Label>Mostrar campo nacionalidade</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.guestForm.showBirthDate}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        guestForm: { ...config.guestForm, showBirthDate: checked }
                      })}
                    />
                    <Label>Mostrar campo data de nascimento</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.guestForm.showAddress}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        guestForm: { ...config.guestForm, showAddress: checked }
                      })}
                    />
                    <Label>Mostrar campos de endereço</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mensagem Personalizada</Label>
                  <Textarea
                    placeholder="Mensagem de boas-vindas personalizada..."
                    value={config.guestForm.customMessage}
                    onChange={(e) => setConfig({
                      ...config,
                      guestForm: { ...config.guestForm, customMessage: e.target.value }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tema do Formulário</Label>
                  <Select
                    value={config.guestForm.theme}
                    onValueChange={(value) => setConfig({
                      ...config,
                      guestForm: { ...config.guestForm, theme: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Moderno</SelectItem>
                      <SelectItem value="classic">Clássico</SelectItem>
                      <SelectItem value="minimal">Minimalista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Configurar notificações automáticas para esta propriedade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.notifications.emailEnabled}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        notifications: { ...config.notifications, emailEnabled: checked }
                      })}
                    />
                    <Label>Ativar notificações por email</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.notifications.smsEnabled}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        notifications: { ...config.notifications, smsEnabled: checked }
                      })}
                    />
                    <Label>Ativar notificações por SMS</Label>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.notifications.checkInReminder}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        notifications: { ...config.notifications, checkInReminder: checked }
                      })}
                    />
                    <Label>Lembrete de check-in</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.notifications.checkOutReminder}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        notifications: { ...config.notifications, checkOutReminder: checked }
                      })}
                    />
                    <Label>Lembrete de check-out</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.notifications.reviewRequest}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        notifications: { ...config.notifications, reviewRequest: checked }
                      })}
                    />
                    <Label>Pedido de avaliação</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.notifications.paymentConfirmation}
                      onCheckedChange={(checked) => setConfig({
                        ...config,
                        notifications: { ...config.notifications, paymentConfirmation: checked }
                      })}
                    />
                    <Label>Confirmação de pagamento</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};