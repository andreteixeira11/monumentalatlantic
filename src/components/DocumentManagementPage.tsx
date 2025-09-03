import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Trash2, Eye, Calendar, Search, Building, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/components/ui/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  propertyName: string;
  uploadDate: string;
  expiryDate?: string;
  size: string;
  status: "active" | "expired" | "expiring-soon";
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "RNAL_Certificado.pdf",
    type: "PDF",
    category: "RNAL",
    propertyName: "Apartamento Centro Porto",
    uploadDate: "2024-01-15",
    expiryDate: "2025-01-15",
    size: "2.3 MB",
    status: "active"
  },
  {
    id: "2",
    name: "Seguro_Responsabilidade_Civil.pdf",
    type: "PDF",
    category: "Seguro",
    propertyName: "Casa Vila Nova de Gaia",
    uploadDate: "2024-02-01",
    expiryDate: "2024-12-31",
    size: "1.8 MB",
    status: "expiring-soon"
  },
  {
    id: "3",
    name: "Modelo21_RFI_2023.pdf",
    type: "PDF",
    category: "Fiscal",
    propertyName: "Loft Ribeira",
    uploadDate: "2024-03-10",
    size: "956 KB",
    status: "active"
  },
  {
    id: "4",
    name: "Certificado_Residencia_Fiscal.pdf",
    type: "PDF",
    category: "Fiscal",
    propertyName: "Apartamento Centro Porto",
    uploadDate: "2023-11-20",
    expiryDate: "2024-11-20",
    size: "1.2 MB",
    status: "expired"
  }
];

const documentCategories = [
  "RNAL",
  "Seguro",
  "Fiscal",
  "Faturas",
  "Licenças",
  "Contratos",
  "Outros"
];

export const DocumentManagementPage = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [expandedProperties, setExpandedProperties] = useState<Record<string, boolean>>({});

  const properties = ["Apartamento Centro Porto", "Casa Vila Nova de Gaia", "Loft Ribeira"];
  
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Group documents by property
  const documentsByProperty = properties.reduce((acc, property) => {
    acc[property] = filteredDocuments.filter(doc => doc.propertyName === property);
    return acc;
  }, {} as Record<string, Document[]>);

  const toggleProperty = (property: string) => {
    setExpandedProperties(prev => ({
      ...prev,
      [property]: !prev[property]
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Simular upload de ficheiro
      toast({
        title: "Ficheiro carregado",
        description: `${files[0].name} foi carregado com sucesso.`,
      });
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Documento Removido",
      description: "Documento removido com sucesso.",
    });
  };

  const getStatusStats = () => {
    return {
      total: documents.length,
      active: documents.filter(d => d.status === "active").length,
      expiring: documents.filter(d => d.status === "expiring-soon").length,
      expired: documents.filter(d => d.status === "expired").length,
    };
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Gestão Documental</h1>
          <p className="text-muted-foreground mt-1">
            Organize e gerir documentos por propriedade
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            multiple
          />
          <Button onClick={() => document.getElementById('file-upload')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Carregar Documentos
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-success">{stats.active}</p>
              </div>
              <Badge className="bg-success text-success-foreground">
                {Math.round((stats.active / stats.total) * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">A Expirar</p>
                <p className="text-2xl font-bold text-warning">{stats.expiring}</p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expirados</p>
                <p className="text-2xl font-bold text-destructive">{stats.expired}</p>
              </div>
              <Badge variant="destructive">{stats.expired}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Procurar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {documentCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  <SelectItem value="all">Todos os Estados</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="expired">Expirado</SelectItem>
                  <SelectItem value="expiring-soon">A Expirar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents by Property - Collapsible Dropdowns */}
      <div className="space-y-4">
        {Object.entries(documentsByProperty).map(([property, docs]) => (
          docs.length > 0 && (
            <Card key={property} className="shadow-soft">
              <Collapsible 
                open={expandedProperties[property]} 
                onOpenChange={() => toggleProperty(property)}
              >
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Building className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-left">{property}</CardTitle>
                          <CardDescription className="text-left">
                            {docs.length} documento(s)
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {docs.filter(d => d.status === 'active').length} Ativos
                        </Badge>
                        {expandedProperties[property] ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="animate-accordion-down">
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {docs.map((doc) => (
                        <DocumentCard key={doc.id} doc={doc} onDelete={handleDeleteDocument} />
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )
        ))}
        
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Nenhum documento encontrado
            </h3>
            <p className="text-sm text-muted-foreground">
              Carregue o primeiro documento para começar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Separate DocumentCard component for reusability
const DocumentCard = ({ doc, onDelete }: { doc: Document; onDelete: (id: string) => void }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/20 text-success border-success/30";
      case "expired":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "expiring-soon":
        return "bg-warning/20 text-warning border-warning/30";
      default:
        return "bg-muted/50 text-muted-foreground border-muted/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "expired":
        return "Expirado";
      case "expiring-soon":
        return "A Expirar";
      default:
        return "Desconhecido";
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 hover-scale">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <Badge className={getStatusColor(doc.status)}>
              {getStatusText(doc.status)}
            </Badge>
          </div>
        </div>
        
        <h3 className="font-medium text-sm mb-1 truncate" title={doc.name}>
          {doc.name}
        </h3>
        
        <div className="space-y-1 text-xs text-muted-foreground mb-3">
          <p>Categoria: {doc.category}</p>
          <p>Propriedade: {doc.propertyName}</p>
          <p>Tamanho: {doc.size}</p>
          <p>Carregado: {new Date(doc.uploadDate).toLocaleDateString('pt-PT')}</p>
          {doc.expiryDate && (
            <p>Expira: {new Date(doc.expiryDate).toLocaleDateString('pt-PT')}</p>
          )}
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" size="sm" className="flex-1 mr-2">
            <Eye className="h-3 w-3 mr-1" />
            Ver
          </Button>
          <Button variant="outline" size="sm" className="flex-1 mr-2">
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(doc.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};