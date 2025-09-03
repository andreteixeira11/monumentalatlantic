import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Edit, Eye, Wifi, Home, MapPin, Phone, Mail, Clock, Shield } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Template {
  id: string;
  name: string;
  description: string;
  category: "house-rules" | "info-guide" | "wifi-access" | "emergency" | "welcome";
  content: string;
  lastModified: string;
  isActive: boolean;
}

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Regras da Casa",
    description: "Regras gerais para hóspedes",
    category: "house-rules",
    content: `REGRAS DA CASA

1. CHECK-IN E CHECK-OUT
• Check-in: 15:00 - 22:00
• Check-out: até às 11:00
• Check-in tardio disponível mediante acordo prévio

2. OCUPAÇÃO MÁXIMA
• Máximo de 4 pessoas
• Não são permitidas festas ou eventos
• Visitantes devem sair até às 22:00

3. RUÍDO E VIZINHANÇA
• Silêncio após as 22:00
• Respeite os vizinhos
• Música em volume moderado

4. FUMAR
• Propriedade 100% livre de fumo
• Área de fumadores no exterior

5. ANIMAIS DE ESTIMAÇÃO
• Não são permitidos animais

6. SEGURANÇA
• Feche sempre a porta à chave
• Não partilhe códigos de acesso
• Reporte qualquer problema imediatamente

Obrigado pela sua estadia!`,
    lastModified: "2024-01-15",
    isActive: true
  },
  {
    id: "2",
    name: "Livro de Informações",
    description: "Guia completo da propriedade e área local",
    category: "info-guide",
    content: `BEM-VINDOS AO APARTAMENTO CENTRO PORTO

INFORMAÇÕES DA PROPRIEDADE
• WiFi: PortoGuest / Palavra-passe: Welcome2024
• Ar condicionado: Comando na mesa de cabeceira
• Aquecimento: Central, termostato na sala
• Máquina de lavar: Cápsulas fornecidas

COZINHA
• Todos os utensílios necessários
• Café e chá de cortesia
• Máquina de café Nespresso
• Frigorífico com água e bebidas

RECOMENDAÇÕES LOCAIS

RESTAURANTES (5 min a pé)
• Taberna Real do Fado - Tradicional portuguesa
• Cantina 32 - Moderna portuguesa
• Adega São Nicolau - Francesinhas famosas

TRANSPORTES
• Metro: Estação São Bento (3 min)
• Táxi: +351 225 073 900
• Uber/Bolt disponíveis

ATRAÇÕES PRÓXIMAS
• Livraria Lello - 5 min
• Torre dos Clérigos - 8 min
• Ribeira - 10 min
• Ponte D. Luís I - 15 min

EMERGÊNCIAS
• Emergência: 112
• Polícia: 112
• Bombeiros: 112
• Hospital Santo António: +351 222 077 500

Contacto do anfitrião: +351 910 123 456`,
    lastModified: "2024-01-10",
    isActive: true
  },
  {
    id: "3",
    name: "Quadro de Acessos WiFi",
    description: "Informações de acesso à internet",
    category: "wifi-access",
    content: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                          🌐 ACESSO WiFi
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📶 REDE PRINCIPAL
   Nome da Rede: PortoGuest_5G
   Palavra-passe: Welcome2024!

📶 REDE ALTERNATIVA  
   Nome da Rede: PortoGuest_2.4G
   Palavra-passe: Welcome2024!

ℹ️  INSTRUÇÕES
   1. Procure a rede no seu dispositivo
   2. Introduza a palavra-passe
   3. Aguarde a ligação

📱 QR CODE PARA LIGAÇÃO RÁPIDA
   [Aqui estaria o QR Code]

🔧 PROBLEMAS DE LIGAÇÃO?
   • Reinicie o router (botão vermelho)
   • Aguarde 2 minutos
   • Contacte-nos: +351 910 123 456

🌟 Internet de alta velocidade
    Fibra ótica 500 Mbps

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    lastModified: "2024-01-12",
    isActive: true
  },
  {
    id: "4",
    name: "Mensagem de Boas-Vindas",
    description: "Email automático de boas-vindas",
    category: "welcome",
    content: `Assunto: Bem-vindos ao vosso alojamento no Porto! 🏠

Caro(a) {GUEST_NAME},

É com muito prazer que vos damos as boas-vindas ao nosso apartamento no centro do Porto!

DETALHES DA VOSSA RESERVA:
• Check-in: {CHECKIN_DATE} às {CHECKIN_TIME}
• Check-out: {CHECKOUT_DATE} às {CHECKOUT_TIME}
• Endereço: {PROPERTY_ADDRESS}
• Código de Acesso: {ACCESS_CODE}

INSTRUÇÕES DE CHECK-IN:
1. Dirijam-se ao edifício no endereço indicado
2. Usem o código {ACCESS_CODE} no painel da porta principal
3. O vosso apartamento é o nº {APARTMENT_NUMBER}
4. O código da porta do apartamento é {APARTMENT_CODE}

O QUE ENCONTRARÃO:
✓ Apartamento completamente equipado
✓ WiFi gratuito de alta velocidade
✓ Amenities de boas-vindas
✓ Guia completo da cidade
✓ Apoio 24/7 via WhatsApp

CONTACTOS DE EMERGÊNCIA:
📞 WhatsApp: +351 910 123 456
✉️ Email: {HOST_EMAIL}

Esperamos que tenham uma estadia maravilhosa!

Com os melhores cumprimentos,
Equipa Monumental Atlantic`,
    lastModified: "2024-01-08",
    isActive: true
  }
];

export const TemplatesPage = () => {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "house-rules":
        return <Home className="h-5 w-5" />;
      case "info-guide":
        return <MapPin className="h-5 w-5" />;
      case "wifi-access":
        return <Wifi className="h-5 w-5" />;
      case "emergency":
        return <Shield className="h-5 w-5" />;
      case "welcome":
        return <Mail className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "house-rules":
        return "Regras da Casa";
      case "info-guide":
        return "Guia de Informações";
      case "wifi-access":
        return "Acesso WiFi";
      case "emergency":
        return "Emergência";
      case "welcome":
        return "Boas-Vindas";
      default:
        return category;
    }
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setEditContent(template.content);
    setIsEditing(true);
  };

  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      setTemplates(templates.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, content: editContent, lastModified: new Date().toISOString().split('T')[0] }
          : t
      ));
      setIsEditing(false);
      setSelectedTemplate(null);
      toast({
        title: "Template Guardado",
        description: "O template foi atualizado com sucesso.",
      });
    }
  };

  const handleDownloadTemplate = (template: Template) => {
    // Generate PDF using jsPDF
    const doc = new (window as any).jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(template.name, 20, 30);
    
    // Add category and description
    doc.setFontSize(12);
    doc.text(`Categoria: ${getCategoryName(template.category)}`, 20, 50);
    doc.text(`Descrição: ${template.description}`, 20, 60);
    doc.text(`Última modificação: ${new Date(template.lastModified).toLocaleDateString('pt-PT')}`, 20, 70);
    
    // Add separator line
    doc.line(20, 80, 190, 80);
    
    // Add content
    doc.setFontSize(10);
    const splitContent = doc.splitTextToSize(template.content, 170);
    doc.text(splitContent, 20, 90);
    
    // Save the PDF
    doc.save(`${template.name.replace(/\s+/g, '_')}.pdf`);
    
    toast({
      title: "PDF Gerado",
      description: `Template ${template.name} pronto para download.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground mt-1">
            Gerir e personalizar templates para comunicação com hóspedes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Templates</CardTitle>
              <CardDescription>Clique num template para visualizar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {getCategoryIcon(template.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getCategoryName(template.category)}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant={template.isActive ? "default" : "secondary"}>
                            {template.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(template.lastModified).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Preview/Edit */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(selectedTemplate.category)}
                    {selectedTemplate.name}
                  </CardTitle>
                  <CardDescription>{selectedTemplate.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadTemplate(selectedTemplate)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTemplate(selectedTemplate)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Conteúdo do Template</Label>
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={20}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedTemplate(null);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveTemplate}>
                        Guardar Alterações
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {getCategoryName(selectedTemplate.category)}
                        </Badge>
                        <Badge variant={selectedTemplate.isActive ? "default" : "secondary"}>
                          {selectedTemplate.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Modificado: {new Date(selectedTemplate.lastModified).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {selectedTemplate.content}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Selecione um template da lista para visualizar e editar
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Operações comuns com templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Home className="h-6 w-6" />
              <span>Novo Template Regras</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Wifi className="h-6 w-6" />
              <span>Gerar QR WiFi</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Mail className="h-6 w-6" />
              <span>Template Email</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Download className="h-6 w-6" />
              <span>Download Todos</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};