import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, Plus, Download, Eye, FileText, Euro, Calendar, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Invoice {
  id: string;
  number: string;
  propertyName: string;
  clientName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  type: "accommodation" | "services" | "other";
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    number: "FAT-2024-001",
    propertyName: "Apartamento Centro Porto",
    clientName: "João Silva",
    amount: 450.00,
    date: "2024-01-15",
    dueDate: "2024-01-30",
    status: "paid",
    type: "accommodation"
  },
  {
    id: "2", 
    number: "FAT-2024-002",
    propertyName: "Casa Vila Nova de Gaia",
    clientName: "Maria Santos",
    amount: 320.00,
    date: "2024-01-20",
    dueDate: "2024-02-05",
    status: "pending",
    type: "accommodation"
  },
  {
    id: "3",
    number: "FAT-2024-003",
    propertyName: "Loft Ribeira",
    clientName: "Pedro Costa",
    amount: 180.00,
    date: "2024-01-25",
    dueDate: "2024-01-30",
    status: "overdue",
    type: "services"
  }
];

export const BillingPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || invoice.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success text-success-foreground">Paga</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Pendente</Badge>;
      case "overdue":
        return <Badge variant="destructive">Em Atraso</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getTotalByStatus = (status: string) => {
    return invoices.filter(inv => inv.status === status).reduce((sum, inv) => sum + inv.amount, 0);
  };

  const handleCreateInvoice = () => {
    toast({
      title: "Fatura Criada",
      description: "Nova fatura foi criada com sucesso.",
    });
    setShowCreateModal(false);
  };

  const handleDownloadSAFT = () => {
    toast({
      title: "SAF-T Gerado",
      description: "Ficheiro SAF-T foi gerado para submissão no e-fatura.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Faturação</h1>
          <p className="text-muted-foreground mt-1">
            Gerir faturas, resumos financeiros e ficheiros SAF-T
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Fatura
          </Button>
          <Button variant="outline" onClick={handleDownloadSAFT}>
            <Download className="h-4 w-4 mr-2" />
            Gerar SAF-T
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Resumo</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="create">Criar Fatura</TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Faturado</p>
                    <p className="text-2xl font-bold">€{invoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}</p>
                  </div>
                  <Euro className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Faturas Pagas</p>
                    <p className="text-2xl font-bold text-success">€{getTotalByStatus("paid").toFixed(2)}</p>
                  </div>
                  <Badge className="bg-success text-success-foreground">
                    {invoices.filter(inv => inv.status === "paid").length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendentes</p>
                    <p className="text-2xl font-bold text-warning">€{getTotalByStatus("pending").toFixed(2)}</p>
                  </div>
                  <Badge variant="secondary" className="bg-warning text-warning-foreground">
                    {invoices.filter(inv => inv.status === "pending").length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Em Atraso</p>
                    <p className="text-2xl font-bold text-destructive">€{getTotalByStatus("overdue").toFixed(2)}</p>
                  </div>
                  <Badge variant="destructive">
                    {invoices.filter(inv => inv.status === "overdue").length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Faturas Recentes</CardTitle>
              <CardDescription>Últimas faturas emitidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Receipt className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{invoice.number}</p>
                        <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold">€{invoice.amount.toFixed(2)}</span>
                      {getStatusBadge(invoice.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices List */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pesquisar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Número da fatura ou cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os estados</SelectItem>
                      <SelectItem value="paid">Paga</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="overdue">Em Atraso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Faturas ({filteredInvoices.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg space-y-3 lg:space-y-0">
                    <div className="flex items-start space-x-3">
                      <Receipt className="h-8 w-8 text-primary mt-1" />
                      <div>
                        <h3 className="font-medium">{invoice.number}</h3>
                        <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                        <p className="text-sm text-muted-foreground">{invoice.propertyName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(invoice.status)}
                          <span className="text-xs text-muted-foreground">
                            Emitida: {new Date(invoice.date).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:items-end space-y-2">
                      <span className="text-lg font-bold">€{invoice.amount.toFixed(2)}</span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Invoice */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Fatura</CardTitle>
              <CardDescription>Preencha os dados para emitir uma nova fatura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Propriedade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar propriedade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prop1">Apartamento Centro Porto</SelectItem>
                      <SelectItem value="prop2">Casa Vila Nova de Gaia</SelectItem>
                      <SelectItem value="prop3">Loft Ribeira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Input placeholder="Nome do cliente" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Fatura</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accommodation">Alojamento</SelectItem>
                      <SelectItem value="services">Serviços</SelectItem>
                      <SelectItem value="other">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor (€)</Label>
                  <Input type="number" placeholder="0.00" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label>Data de Vencimento</Label>
                  <Input type="date" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea placeholder="Descrição dos serviços ou produtos..." rows={3} />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline">Guardar Rascunho</Button>
                <Button onClick={handleCreateInvoice}>Emitir Fatura</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};