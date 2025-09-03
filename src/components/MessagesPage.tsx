import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { MessageCircle, Send, Search, Settings, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  guestName: string;
  platform: "booking" | "airbnb";
  subject: string;
  lastMessage: string;
  timestamp: string;
  status: "unread" | "read" | "replied";
  conversation: {
    sender: "guest" | "host";
    message: string;
    timestamp: string;
  }[];
}

const mockMessages: Message[] = [
  {
    id: "MSG-001",
    guestName: "Maria Silva",
    platform: "booking",
    subject: "Pergunta sobre check-in",
    lastMessage: "A que horas posso fazer o check-in?",
    timestamp: "2024-12-15T14:30:00",
    status: "unread",
    conversation: [
      {
        sender: "guest",
        message: "Olá! A que horas posso fazer o check-in?",
        timestamp: "2024-12-15T14:30:00"
      }
    ]
  },
  {
    id: "MSG-002",
    guestName: "João Santos",
    platform: "airbnb",
    subject: "Informações sobre estacionamento",
    lastMessage: "Existe estacionamento disponível?",
    timestamp: "2024-12-15T12:15:00",
    status: "read",
    conversation: [
      {
        sender: "guest",
        message: "Bom dia! Existe estacionamento disponível na propriedade?",
        timestamp: "2024-12-15T12:15:00"
      },
      {
        sender: "host",
        message: "Olá João! Sim, temos estacionamento gratuito disponível.",
        timestamp: "2024-12-15T12:45:00"
      }
    ]
  },
  {
    id: "MSG-003",
    guestName: "Ana Costa",
    platform: "booking",
    subject: "Pedido especial",
    lastMessage: "Obrigada pela atenção!",
    timestamp: "2024-12-14T16:20:00",
    status: "replied",
    conversation: [
      {
        sender: "guest",
        message: "Olá! Seria possível ter check-in tardio? Chego depois das 22h.",
        timestamp: "2024-12-14T15:20:00"
      },
      {
        sender: "host",
        message: "Olá Ana! Sim, sem problema. Vou deixar as chaves na caixa de segurança.",
        timestamp: "2024-12-14T15:45:00"
      },
      {
        sender: "guest",
        message: "Obrigada pela atenção!",
        timestamp: "2024-12-14T16:20:00"
      }
    ]
  }
];

export const MessagesPage = () => {
  const [messages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read" | "replied">("all");
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "read":
        return "bg-warning/20 text-warning border-warning/30";
      case "replied":
        return "bg-success/20 text-success border-success/30";
      default:
        return "bg-muted/50 text-muted-foreground border-muted/30";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "booking":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "airbnb":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendReply = () => {
    if (!replyText.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, escreva uma mensagem.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Mensagem Enviada",
      description: "A sua resposta foi enviada com sucesso.",
    });
    setReplyText("");
    setSelectedMessage(null);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-PT');
  };

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-variant bg-clip-text text-transparent">
            Central de Mensagens
          </h1>
          <p className="text-muted-foreground">Chat integrado com todas as plataformas</p>
        </div>
        <Button variant="outline" className="shadow-soft">
          <Settings className="h-4 w-4 mr-2" />
          Configurar Integrações
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Não Lidas</p>
                <p className="text-2xl font-bold text-destructive">
                  {messages.filter(m => m.status === 'unread').length}
                </p>
              </div>
              <Badge variant="destructive">
                {messages.filter(m => m.status === 'unread').length}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Respondidas</p>
                <p className="text-2xl font-bold text-success">
                  {messages.filter(m => m.status === 'replied').length}
                </p>
              </div>
              <Badge className="bg-success text-success-foreground">
                {messages.filter(m => m.status === 'replied').length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Chat List Sidebar */}
        <Card className="shadow-medium border-primary/20 lg:col-span-1">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>Conversas</span>
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {filteredMessages.length}
              </Badge>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Procurar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-1">
              <Button
                variant={statusFilter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter("all")}
                className="flex-1 text-xs"
              >
                Todas
              </Button>
              <Button
                variant={statusFilter === "unread" ? "default" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter("unread")}
                className="flex-1 text-xs"
              >
                Não Lidas
              </Button>
              <Button
                variant={statusFilter === "replied" ? "default" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter("replied")}
                className="flex-1 text-xs"
              >
                Respondidas
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 h-full overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma conversa encontrada</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-accent/50 border-l-4 ${
                        selectedMessage?.id === message.id 
                          ? 'bg-primary/10 border-l-primary shadow-soft' 
                          : message.status === 'unread' 
                          ? 'border-l-destructive bg-destructive/5'
                          : 'border-l-transparent'
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {message.guestName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm truncate">{message.guestName}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleTimeString('pt-PT', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge 
                              className={`${getPlatformColor(message.platform)} text-xs px-1.5 py-0.5`}
                              variant="secondary"
                            >
                              {message.platform === "booking" ? "B" : "A"}
                            </Badge>
                            {message.status === 'unread' && (
                              <div className="w-2 h-2 bg-destructive rounded-full"></div>
                            )}
                          </div>
                          
                          <p className="text-xs text-muted-foreground truncate">
                            {message.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages Area */}
        <Card className="shadow-medium border-primary/20 lg:col-span-2">
          {selectedMessage ? (
            <>
              {/* Chat Header */}
              <CardHeader className="bg-gradient-to-r from-card to-card/50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {selectedMessage.guestName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedMessage.guestName}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPlatformColor(selectedMessage.platform)}>
                          {selectedMessage.platform === "booking" ? "Booking.com" : "Airbnb"}
                        </Badge>
                        <CardDescription>{selectedMessage.subject}</CardDescription>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-hidden p-0">
                <div className="h-[400px] overflow-y-auto custom-scrollbar p-4 space-y-4">
                  {selectedMessage.conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === "host" ? "justify-end" : "justify-start"} animate-fade-in-up`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl shadow-soft ${
                          msg.sender === "host"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <p className={`text-xs mt-2 ${
                          msg.sender === "host" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Reply Input */}
                <div className="border-t p-4 bg-gradient-to-r from-background to-muted/20">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Escreva a sua resposta..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      className="resize-none bg-background/50 border-primary/20 focus:border-primary/40"
                    />
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        {replyText.length}/500 caracteres
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Template
                        </Button>
                        <Button onClick={handleSendReply} className="shadow-soft">
                          <Send className="h-4 w-4 mr-2" />
                          Enviar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">Selecione uma Conversa</h3>
                <p className="text-sm">Escolha uma conversa da lista para ver as mensagens</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};