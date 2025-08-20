import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Send, CheckCircle, XCircle, Link, Copy, Users, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GuestRegistry {
  id: string;
  guestName: string;
  documentNumber: string;
  documentType: string;
  nationality: string;
  checkInDate: string;
  checkOutDate: string;
  property: string;
  status: "pending" | "sent" | "confirmed" | "error" | "link-sent";
  guestFormLink?: string;
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
  },
  {
    id: "REG-004",
    guestName: "Pedro Oliveira",
    documentNumber: "",
    documentType: "",
    nationality: "",
    checkInDate: "2025-01-05",
    checkOutDate: "2025-01-08",
    property: "Apartamento Centro Porto",
    status: "link-sent",
    guestFormLink: "https://portal.example.com/guest-form/token123"
  }
];

export const GuestRegistryPage = () => {
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
      case "link-sent":
        return "bg-primary/20 text-primary border-primary/30";
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
      case "link-sent":
        return <Link className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleSendToSiba = (registryId: string) => {
    if (!isConfigured) {
      toast({
        title: "Erro",
        description: "Configure primeiro o SIBA nas Configurações.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Enviado para SIBA",
      description: "O registo foi enviado para o SIBA com sucesso.",
    });
  };

  const handleGenerateGuestLink = (registryId: string) => {
    const guestFormLink = `https://portal.example.com/guest-form/${registryId}`;
    
    toast({
      title: "Link Gerado",
      description: "Link de preenchimento gerado com sucesso. Envie este link ao hóspede.",
    });
    
    // Simular envio de email
    setTimeout(() => {
      toast({
        title: "Email Enviado",
        description: "O link foi enviado por email ao hóspede.",
      });
    }, 1500);
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copiado",
      description: "O link foi copiado para a área de transferência.",
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

      {/* Registry Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Hóspedes
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registries.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registos de hóspedes
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enviados para SIBA
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registries.filter(entry => entry.status === "sent").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registos enviados
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registries.filter(entry => entry.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Aguardam envio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Guest Form Link Generation */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Link className="h-5 w-5" />
            <span>Link para Hóspedes</span>
          </CardTitle>
          <CardDescription>
            Gere links para os hóspedes preencherem os seus dados antes do check-in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">Como funciona:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Gere um link único para cada reserva</li>
                <li>O link é enviado automaticamente por email ao hóspede</li>
                <li>O hóspede preenche os dados online antes do check-in</li>
                <li>Os dados aparecem aqui para confirmar e enviar ao SIBA</li>
              </ol>
            </div>
            <Button onClick={() => handleGenerateGuestLink("NEW-REG")} className="w-full">
              <Link className="h-4 w-4 mr-2" />
              Gerar Novo Link para Hóspede
            </Button>
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
                          {registry.status === "link-sent" && "Link Enviado"}
                        </span>
                      </div>
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {registry.status === "link-sent" ? (
                      <span className="text-primary">Aguardando preenchimento do formulário pelo hóspede</span>
                    ) : (
                      <>
                        <span className="mr-4">Doc: {registry.documentType} {registry.documentNumber}</span>
                        <span className="mr-4">Nacionalidade: {registry.nationality}</span>
                      </>
                    )}
                    <span>Propriedade: {registry.property}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Check-in: {registry.checkInDate} | Check-out: {registry.checkOutDate}
                  </div>
                  {registry.guestFormLink && (
                    <div className="mt-2 flex items-center space-x-2">
                      <Input 
                        value={registry.guestFormLink} 
                        readOnly 
                        className="text-xs h-8"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCopyLink(registry.guestFormLink!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {registry.status === "link-sent" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateGuestLink(registry.id)}
                    >
                      <Link className="h-4 w-4 mr-2" />
                      Reenviar Link
                    </Button>
                  ) : registry.status === "pending" || registry.status === "error" ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerateGuestLink(registry.id)}
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Enviar Link
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSendToSiba(registry.id)}
                        disabled={!isConfigured}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Enviar
                      </Button>
                    </>
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
                ⚠️ Configure primeiro os dados de acesso ao SIBA em Configurações para poder enviar os registos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};