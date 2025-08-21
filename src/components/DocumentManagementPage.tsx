import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Trash2, Eye, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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

  const handleDownload = (doc: Document) => {
    toast({
      title: "Download iniciado",
      description: `A transferir ${doc.name}...`,
    });
  };

  const handleDelete = (docId: string) => {
    setDocuments(docs => docs.filter(doc => doc.id !== docId));
    toast({
      title: "Documento eliminado",
      description: "O documento foi removido com sucesso.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-success text-success-foreground">Ativo</Badge>;
      case "expired":
        return <Badge variant="destructive">Expirado</Badge>;
      case "expiring-soon":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">A Expirar</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "RNAL": "bg-blue-100 text-blue-800",
      "Seguro": "bg-green-100 text-green-800",
      "Fiscal": "bg-purple-100 text-purple-800",
      "Faturas": "bg-orange-100 text-orange-800",
      "Licenças": "bg-indigo-100 text-indigo-800",
      "Contratos": "bg-pink-100 text-pink-800",
      "Outros": "bg-gray-100 text-gray-800"
    };
    return colors[category] || colors["Outros"];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Gestão Documental</h1>
          <p className="text-muted-foreground mt-1">
            Organize e gerir todos os documentos do seu alojamento local
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            multiple
          />
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            className="w-full sm:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            Carregar Documento
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Documentos</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Documentos Ativos</p>
                <p className="text-2xl font-bold text-success">
                  {documents.filter(d => d.status === "active").length}
                </p>
              </div>
              <Badge variant="default" className="bg-success text-success-foreground text-xs">
                Ativo
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">A Expirar</p>
                <p className="text-2xl font-bold text-warning">
                  {documents.filter(d => d.status === "expiring-soon").length}
                </p>
              </div>
              <Badge variant="secondary" className="bg-warning text-warning-foreground text-xs">
                Alerta
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expirados</p>
                <p className="text-2xl font-bold text-destructive">
                  {documents.filter(d => d.status === "expired").length}
                </p>
              </div>
              <Badge variant="destructive" className="text-xs">
                Expirado
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome do documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {documentCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os estados</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="expiring-soon">A Expirar</SelectItem>
                  <SelectItem value="expired">Expirado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documentos ({filteredDocuments.length})</CardTitle>
          <CardDescription>
            Lista de todos os documentos organizados por categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum documento encontrado com os filtros aplicados.
                </p>
              </div>
            ) : (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors space-y-3 lg:space-y-0"
                >
                  <div className="flex items-start space-x-3">
                    <FileText className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium truncate">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">{doc.propertyName}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getCategoryColor(doc.category)}`}
                          >
                            {doc.category}
                          </Badge>
                          {getStatusBadge(doc.status)}
                          <span className="text-xs text-muted-foreground">{doc.size}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Carregado: {new Date(doc.uploadDate).toLocaleDateString('pt-PT')}</span>
                          {doc.expiryDate && (
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Expira: {new Date(doc.expiryDate).toLocaleDateString('pt-PT')}
                            </span>
                          )}
                        </div>
                      </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 lg:ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      className="flex-1 lg:flex-initial"
                    >
                      <Eye className="h-4 w-4 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Visualizar</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      className="flex-1 lg:flex-initial"
                    >
                      <Download className="h-4 w-4 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                      className="text-destructive hover:text-destructive flex-1 lg:flex-initial"
                    >
                      <Trash2 className="h-4 w-4 mr-1 lg:mr-2" />
                      <span className="hidden sm:inline">Eliminar</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};