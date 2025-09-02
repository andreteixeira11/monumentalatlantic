import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Building, Euro, Calendar, Send, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TouristTaxEntry {
  id: string;
  guestName: string;
  property: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  taxPerNight: number;
  totalTax: number;
  status: "pending" | "submitted" | "paid";
  submissionDate?: string;
}

const mockTaxEntries: TouristTaxEntry[] = [
  {
    id: "TAX-001",
    guestName: "Maria Silva",
    property: "Apartamento Centro Porto",
    checkInDate: "2024-12-15",
    checkOutDate: "2024-12-18",
    nights: 3,
    guests: 2,
    taxPerNight: 2.0,
    totalTax: 12.0,
    status: "pending"
  },
  {
    id: "TAX-002",
    guestName: "João Santos",
    property: "Casa Vila Nova de Gaia",
    checkInDate: "2024-12-10",
    checkOutDate: "2024-12-15",
    nights: 5,
    guests: 4,
    taxPerNight: 1.5,
    totalTax: 30.0,
    status: "submitted",
    submissionDate: "2024-12-16"
  },
  {
    id: "TAX-003",
    guestName: "Ana Costa",
    property: "Loft Ribeira",
    checkInDate: "2024-12-05",
    checkOutDate: "2024-12-08",
    nights: 3,
    guests: 1,
    taxPerNight: 2.0,
    totalTax: 6.0,
    status: "paid",
    submissionDate: "2024-12-09"
  }
];

export const TouristTaxPage = () => {
  const [taxEntries] = useState<TouristTaxEntry[]>(mockTaxEntries);
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/20 text-warning border-warning/30";
      case "submitted":
        return "bg-primary/20 text-primary border-primary/30";
      case "paid":
        return "bg-success/20 text-success border-success/30";
      default:
        return "bg-muted/50 text-muted-foreground border-muted/30";
    }
  };

  const handleSubmitTax = (entryId: string) => {
    if (!isConfigured) {
      toast({
        title: "Erro",
        description: "Configure primeiro a integração com a câmara municipal em Configurações.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Taxa Submetida",
      description: "A taxa turística foi submetida à câmara municipal com sucesso.",
    });
  };

  const handleGenerateReport = () => {
    // Generate PDF report using jsPDF
    const doc = new (window as any).jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Relatório Taxa Turística', 20, 30);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-PT')}`, 20, 50);
    
    // Prepare table data
    const tableData = taxEntries.map(entry => [
      entry.guestName,
      entry.property,
      new Date(entry.checkInDate).toLocaleDateString('pt-PT'),
      new Date(entry.checkOutDate).toLocaleDateString('pt-PT'),
      entry.nights.toString(),
      entry.guests.toString(),
      `€${entry.totalTax.toFixed(2)}`,
      entry.status === 'pending' ? 'Pendente' : entry.status === 'submitted' ? 'Submetida' : 'Paga'
    ]);
    
    // Add table
    (doc as any).autoTable({
      startY: 70,
      head: [['Hóspede', 'Propriedade', 'Check-in', 'Check-out', 'Noites', 'Pessoas', 'Taxa', 'Estado']],
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
    
    // Calculate totals
    const totalTax = taxEntries.reduce((sum, entry) => sum + entry.totalTax, 0);
    const yPosition = (doc as any).lastAutoTable.finalY || 150;
    
    doc.setFontSize(14);
    doc.text(`Total Taxa Turística: €${totalTax.toFixed(2)}`, 20, yPosition + 20);
    
    // Save the PDF
    doc.save('relatorio-taxa-turistica.pdf');
    
    toast({
      title: "Relatório Gerado",
      description: "O relatório da taxa turística foi gerado e está pronto para download.",
    });
  };

  const pendingEntries = taxEntries.filter(entry => entry.status === "pending");
  const totalPendingTax = pendingEntries.reduce((sum, entry) => sum + entry.totalTax, 0);
  const totalTaxThisMonth = taxEntries
    .filter(entry => entry.checkInDate.startsWith('2024-12'))
    .reduce((sum, entry) => sum + entry.totalTax, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Taxa Turística</h1>
          <p className="text-muted-foreground">Gestão e comunicação com a câmara municipal</p>
        </div>
        <Button onClick={handleGenerateReport}>
          <Download className="h-4 w-4 mr-2" />
          Gerar Relatório
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa Pendente
            </CardTitle>
            <Euro className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalPendingTax.toFixed(2)}</div>
            <p className="text-xs text-warning mt-1">
              {pendingEntries.length} entrada(s) pendente(s)
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa Este Mês
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalTaxThisMonth.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dezembro 2024
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Entradas
            </CardTitle>
            <FileText className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taxEntries.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Todas as entradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tax Entries */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Entradas de Taxa Turística</span>
          </CardTitle>
          <CardDescription>
            Configure primeiro a Taxa Turística nas Configurações para poder submeter as taxas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {taxEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="font-semibold">{entry.guestName}</div>
                    <Badge className={getStatusColor(entry.status)}>
                      {entry.status === "pending" && "Pendente"}
                      {entry.status === "submitted" && "Submetida"}
                      {entry.status === "paid" && "Paga"}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <span className="mr-4">Propriedade: {entry.property}</span>
                    <span className="mr-4">Hóspedes: {entry.guests}</span>
                    <span>Noites: {entry.nights}</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Check-in: {new Date(entry.checkInDate).toLocaleDateString('pt-PT')} | 
                    Check-out: {new Date(entry.checkOutDate).toLocaleDateString('pt-PT')}
                  </div>
                  
                  <div className="text-sm">
                    Taxa: €{entry.taxPerNight}/noite × {entry.nights} noites × {entry.guests} hóspedes = 
                    <span className="font-semibold ml-1">€{entry.totalTax.toFixed(2)}</span>
                  </div>
                  
                  {entry.submissionDate && (
                    <div className="text-xs text-muted-foreground">
                      Submetida em: {new Date(entry.submissionDate).toLocaleDateString('pt-PT')}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {entry.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleSubmitTax(entry.id)}
                      disabled={!isConfigured}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submeter
                    </Button>
                  )}
                  {entry.status === "submitted" && (
                    <Button size="sm" variant="outline" disabled>
                      <FileText className="h-4 w-4 mr-2" />
                      Submetida
                    </Button>
                  )}
                  {entry.status === "paid" && (
                    <Button size="sm" variant="outline" disabled>
                      ✓ Paga
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isConfigured && (
            <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning">
                ⚠️ Configure primeiro a integração com a câmara municipal em Configurações para poder submeter as taxas.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};