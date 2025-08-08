import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Settings, Key, Building, Hash, Send, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SibaConfig {
  accessKey: string;
  accommodationName: string;
  establishmentNumber: string;
}

interface GuestRegistry {
  id: string;
  guestName: string;
  documentNumber: string;
  documentType: string;
  nationality: string;
  checkInDate: string;
  checkOutDate: string;
  property: string;
  status: "pending" | "sent" | "confirmed" | "error";
}

const mockGuestRegistries: GuestRegistry[] = [
  {
    id: "REG-001",
    guestName: "Maria Silva",
    documentNumber: "12345678",
    documentType: "BI",
    nationality: "Portuguesa",
    checkInDate: "2024-12-15",
    checkOutDate: "2024-12-18",
    property: "Apartamento Centro Porto",
    status: "confirmed"
  },
  {
    id: "REG-002",
    guestName: "João Santos",
    documentNumber: "87654321",
    documentType: "BI",
    nationality: "Portuguesa",
    checkInDate: "2024-12-20",
    checkOutDate: "2024-12-25",
    property: "Casa Vila Nova de Gaia",
    status: "sent"
  },
  {
    id: "REG-003",
    guestName: "Ana Costa",
    documentNumber: "11223344",
    documentType: "CC",
    nationality: "Portuguesa",
    checkInDate: "2024-12-10",
    checkOutDate: "2024-12-13",
    property: "Loft Ribeira",
    status: "error"
  }
];

export const GuestRegistryPage = () => {
  const [sibaConfig, setSibaConfig] = useState<SibaConfig>({
    accessKey: "",
    accommodationName: "",
    establishmentNumber: ""
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [registries] = useState<GuestRegistry[]>(mockGuestRegistries);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success/20 text-success border-success/30";
      case "sent":
        return "bg-warning/20 text-warning border-warning/30";
      case "error":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "pending":
        return "bg-muted/50 text-muted-foreground border-muted/30";
      default:
        return "bg-muted/50 text-muted-foreground border-muted/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "sent":
        return <Send className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleSaveConfig = () => {
    if (!sibaConfig.accessKey || !sibaConfig.accommodationName || !sibaConfig.establishmentNumber) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos de configuração.",
        variant: "destructive",
      });
      return;
    }

    setIsConfigured(true);
    toast({
      title: "Configuração Guardada",
      description: "A configuração do SIBA foi guardada com sucesso.",
    });
  };

  const handleSendToSiba = (registryId: string) => {
    toast({
      title: "Enviado para SIBA",
      description: "O registo foi enviado para o SIBA com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Registo de Hóspedes</h1>
          <p className="text-muted-foreground">Comunicação com o SIBA para registo de hóspedes</p>
        </div>
      </div>

      {/* SIBA Configuration */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configuração SIBA</span>
          </CardTitle>
          <CardDescription>
            Configure os dados de acesso ao webservice do SIBA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accessKey" className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Chave de Acesso (SIBA)</span>
              </Label>
              <Input
                id="accessKey"
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
              <Label htmlFor="accommodationName" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>Nome Abreviado do Alojamento</span>
              </Label>
              <Input
                id="accommodationName"
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
              <Label htmlFor="establishmentNumber" className="flex items-center space-x-2">
                <Hash className="h-4 w-4" />
                <span>Número do Estabelecimento</span>
              </Label>
              <Input
                id="establishmentNumber"
                placeholder="Número fornecido pelo SIBA"
                value={sibaConfig.establishmentNumber}
                onChange={(e) => setSibaConfig({ ...sibaConfig, establishmentNumber: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Número fornecido pelo SIBA após o registo
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={handleSaveConfig}>
              Guardar Configuração
            </Button>
            {isConfigured && (
              <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                <CheckCircle className="h-4 w-4 mr-2" />
                Configurado
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Guest Registries */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Registos de Hóspedes</CardTitle>
          <CardDescription>
            Lista de registos para comunicar ao SIBA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {registries.map((registry) => (
              <div
                key={registry.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <div className="font-semibold">{registry.guestName}</div>
                    <Badge className={getStatusColor(registry.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(registry.status)}
                        <span>
                          {registry.status === "confirmed" && "Confirmado"}
                          {registry.status === "sent" && "Enviado"}
                          {registry.status === "error" && "Erro"}
                          {registry.status === "pending" && "Pendente"}
                        </span>
                      </div>
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="mr-4">Doc: {registry.documentType} {registry.documentNumber}</span>
                    <span className="mr-4">Nacionalidade: {registry.nationality}</span>
                    <span>Propriedade: {registry.property}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Check-in: {registry.checkInDate} | Check-out: {registry.checkOutDate}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {registry.status === "pending" || registry.status === "error" ? (
                    <Button
                      size="sm"
                      onClick={() => handleSendToSiba(registry.id)}
                      disabled={!isConfigured}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendToSiba(registry.id)}
                      disabled={!isConfigured}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Reenviar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isConfigured && (
            <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning">
                ⚠️ Configure primeiro os dados de acesso ao SIBA para poder enviar os registos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};