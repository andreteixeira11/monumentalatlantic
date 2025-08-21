import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Unlock, Shield, Smartphone, Key, Clock, Users, Settings, Plus, Trash2, Eye, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SmartLock {
  id: string;
  name: string;
  propertyName: string;
  brand: "yale" | "august" | "schlage" | "nuki" | "other";
  status: "online" | "offline" | "low-battery";
  batteryLevel: number;
  lockStatus: "locked" | "unlocked";
  lastActivity: string;
  accessCodes: AccessCode[];
}

interface AccessCode {
  id: string;
  code: string;
  guestName: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
}

const mockSmartLocks: SmartLock[] = [
  {
    id: "1",
    name: "Porta Principal",
    propertyName: "Apartamento Centro Porto",
    brand: "yale",
    status: "online",
    batteryLevel: 85,
    lockStatus: "locked",
    lastActivity: "2024-01-20T14:30:00",
    accessCodes: [
      {
        id: "code1",
        code: "1234",
        guestName: "João Silva",
        validFrom: "2024-01-20",
        validUntil: "2024-01-22",
        isActive: true,
        usageCount: 2,
        maxUsage: 10
      },
      {
        id: "code2",
        code: "5678",
        guestName: "Maria Santos",
        validFrom: "2024-01-22",
        validUntil: "2024-01-25",
        isActive: false,
        usageCount: 0,
        maxUsage: 5
      }
    ]
  },
  {
    id: "2",
    name: "Porta Entrada",
    propertyName: "Casa Vila Nova de Gaia",
    brand: "august",
    status: "low-battery",
    batteryLevel: 15,
    lockStatus: "locked",
    lastActivity: "2024-01-19T22:15:00",
    accessCodes: [
      {
        id: "code3",
        code: "9876",
        guestName: "Pedro Costa",
        validFrom: "2024-01-19",
        validUntil: "2024-01-21",
        isActive: true,
        usageCount: 5,
        maxUsage: 8
      }
    ]
  },
  {
    id: "3",
    name: "Fechadura Digital",
    propertyName: "Loft Ribeira",
    brand: "nuki",
    status: "offline",
    batteryLevel: 0,
    lockStatus: "locked",
    lastActivity: "2024-01-18T16:45:00",
    accessCodes: []
  }
];

export const SmartLockPage = () => {
  const [smartLocks, setSmartLocks] = useState<SmartLock[]>(mockSmartLocks);
  const [selectedLock, setSelectedLock] = useState<SmartLock | null>(null);
  const [showAddCode, setShowAddCode] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-success text-success-foreground">Online</Badge>;
      case "offline":
        return <Badge variant="destructive">Offline</Badge>;
      case "low-battery":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Bateria Fraca</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getBrandIcon = (brand: string) => {
    return <Lock className="h-5 w-5" />; // Simplified, could use brand-specific icons
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-success";
    if (level > 20) return "text-warning";
    return "text-destructive";
  };

  const handleToggleLock = (lockId: string) => {
    setSmartLocks(locks => 
      locks.map(lock => 
        lock.id === lockId 
          ? { 
              ...lock, 
              lockStatus: lock.lockStatus === "locked" ? "unlocked" : "locked",
              lastActivity: new Date().toISOString()
            }
          : lock
      )
    );

    const lock = smartLocks.find(l => l.id === lockId);
    const newStatus = lock?.lockStatus === "locked" ? "desbloqueada" : "bloqueada";
    
    toast({
      title: "Fechadura Controlada",
      description: `Fechadura ${newStatus} com sucesso.`,
    });
  };

  const handleGenerateAccessCode = () => {
    if (!selectedLock) return;
    
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    toast({
      title: "Código Gerado",
      description: `Novo código de acesso: ${newCode}`,
    });
    
    setShowAddCode(false);
  };

  const handleDeleteAccessCode = (lockId: string, codeId: string) => {
    setSmartLocks(locks =>
      locks.map(lock =>
        lock.id === lockId
          ? {
              ...lock,
              accessCodes: lock.accessCodes.filter(code => code.id !== codeId)
            }
          : lock
      )
    );

    toast({
      title: "Código Removido",
      description: "Código de acesso removido com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Smart Hub Lock</h1>
          <p className="text-muted-foreground mt-1">
            Gerir fechaduras inteligentes e códigos de acesso automatizados
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Fechadura
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="locks">Fechaduras</TabsTrigger>
          <TabsTrigger value="access-codes">Códigos</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Fechaduras</p>
                    <p className="text-2xl font-bold">{smartLocks.length}</p>
                  </div>
                  <Lock className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Online</p>
                    <p className="text-2xl font-bold text-success">
                      {smartLocks.filter(l => l.status === "online").length}
                    </p>
                  </div>
                  <Badge className="bg-success text-success-foreground">
                    {Math.round((smartLocks.filter(l => l.status === "online").length / smartLocks.length) * 100)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Códigos Ativos</p>
                    <p className="text-2xl font-bold text-primary">
                      {smartLocks.reduce((sum, lock) => sum + lock.accessCodes.filter(c => c.isActive).length, 0)}
                    </p>
                  </div>
                  <Key className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Alertas</p>
                    <p className="text-2xl font-bold text-warning">
                      {smartLocks.filter(l => l.status === "low-battery" || l.status === "offline").length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estado das Fechaduras</CardTitle>
                <CardDescription>Visão geral de todas as fechaduras conectadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {smartLocks.map((lock) => (
                    <div key={lock.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {getBrandIcon(lock.brand)}
                        </div>
                        <div>
                          <h3 className="font-medium">{lock.name}</h3>
                          <p className="text-sm text-muted-foreground">{lock.propertyName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusBadge(lock.status)}
                            <span className={`text-xs ${getBatteryColor(lock.batteryLevel)}`}>
                              🔋 {lock.batteryLevel}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            {lock.lockStatus === "locked" ? (
                              <Lock className="h-4 w-4 text-destructive" />
                            ) : (
                              <Unlock className="h-4 w-4 text-success" />
                            )}
                            <span className="text-sm font-medium">
                              {lock.lockStatus === "locked" ? "Fechada" : "Aberta"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(lock.lastActivity).toLocaleString('pt-PT')}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleLock(lock.id)}
                          disabled={lock.status === "offline"}
                        >
                          {lock.lockStatus === "locked" ? "Abrir" : "Fechar"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Últimas atividades das fechaduras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: "14:30", action: "Código usado", user: "João Silva", lock: "Porta Principal" },
                    { time: "12:15", action: "Fechadura aberta", user: "Sistema", lock: "Porta Entrada" },
                    { time: "10:45", action: "Código criado", user: "Admin", lock: "Fechadura Digital" },
                    { time: "09:30", action: "Bateria baixa", user: "Sistema", lock: "Porta Entrada" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 border-l-2 border-primary/20 pl-4">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user} • {activity.lock} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Locks Management */}
        <TabsContent value="locks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {smartLocks.map((lock) => (
              <Card key={lock.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {getBrandIcon(lock.brand)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{lock.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{lock.propertyName}</p>
                      </div>
                    </div>
                    {getStatusBadge(lock.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estado:</span>
                    <div className="flex items-center space-x-1">
                      {lock.lockStatus === "locked" ? (
                        <Lock className="h-4 w-4 text-destructive" />
                      ) : (
                        <Unlock className="h-4 w-4 text-success" />
                      )}
                      <span className="text-sm font-medium">
                        {lock.lockStatus === "locked" ? "Fechada" : "Aberta"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bateria:</span>
                    <span className={`text-sm font-medium ${getBatteryColor(lock.batteryLevel)}`}>
                      {lock.batteryLevel}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Códigos Ativos:</span>
                    <span className="text-sm font-medium">
                      {lock.accessCodes.filter(c => c.isActive).length}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleToggleLock(lock.id)}
                        disabled={lock.status === "offline"}
                      >
                        {lock.lockStatus === "locked" ? "Abrir" : "Fechar"}
                      </Button>
                      <Button
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedLock(lock)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Access Codes */}
        <TabsContent value="access-codes" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Códigos de Acesso</CardTitle>
                <CardDescription>Gerir códigos temporários para hóspedes</CardDescription>
              </div>
              <Button onClick={() => setShowAddCode(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Código
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smartLocks.flatMap(lock =>
                  lock.accessCodes.map(code => (
                    <div key={code.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg space-y-3 lg:space-y-0">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Key className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Código: {code.code}</h3>
                          <p className="text-sm text-muted-foreground">{code.guestName}</p>
                          <p className="text-sm text-muted-foreground">{lock.name} - {lock.propertyName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={code.isActive ? "default" : "secondary"}>
                              {code.isActive ? "Ativo" : "Inativo"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Usado {code.usageCount}/{code.maxUsage || "∞"} vezes
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="text-right text-sm">
                          <p>Válido de: {new Date(code.validFrom).toLocaleDateString('pt-PT')}</p>
                          <p>Até: {new Date(code.validUntil).toLocaleDateString('pt-PT')}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAccessCode(lock.id, code.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remover
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configurar integração e automação das fechaduras</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Geração Automática de Códigos</h3>
                    <p className="text-sm text-muted-foreground">
                      Criar códigos automaticamente para novas reservas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notificações de Atividade</h3>
                    <p className="text-sm text-muted-foreground">
                      Receber alertas sobre atividade das fechaduras
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto-Lock após Check-out</h3>
                    <p className="text-sm text-muted-foreground">
                      Fechar automaticamente após horário de check-out
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-4">Configuração de API</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Marca da Fechadura</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar marca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yale">Yale</SelectItem>
                        <SelectItem value="august">August</SelectItem>
                        <SelectItem value="schlage">Schlage</SelectItem>
                        <SelectItem value="nuki">Nuki</SelectItem>
                        <SelectItem value="other">Outras</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Chave API</Label>
                    <Input type="password" placeholder="Inserir chave API" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};