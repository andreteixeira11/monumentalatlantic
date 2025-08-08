import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { MessageCircle, Send, Search, Filter, Settings, Reply, User } from "lucide-react";
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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mensagens</h1>
          <p className="text-muted-foreground">Comunicação com hóspedes das plataformas</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configurar Integrações
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Procurar mensagens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                Todas
              </Button>
              <Button
                variant={statusFilter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("unread")}
              >
                Não Lidas
              </Button>
              <Button
                variant={statusFilter === "replied" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("replied")}
              >
                Respondidas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Mensagens Recentes</span>
          </CardTitle>
          <CardDescription>
            {filteredMessages.length} mensagem(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Não foram encontradas mensagens</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar>
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold">{message.guestName}</span>
                        <Badge className={getPlatformColor(message.platform)}>
                          {message.platform === "booking" ? "Booking.com" : "Airbnb"}
                        </Badge>
                        <Badge className={getStatusColor(message.status)}>
                          {message.status === "unread" && "Não lida"}
                          {message.status === "read" && "Lida"}
                          {message.status === "replied" && "Respondida"}
                        </Badge>
                      </div>
                      <div className="text-sm font-medium">{message.subject}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {message.lastMessage}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Reply className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <span>{selectedMessage.subject}</span>
                <Badge className={getPlatformColor(selectedMessage.platform)}>
                  {selectedMessage.platform === "booking" ? "Booking.com" : "Airbnb"}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Conversa com {selectedMessage.guestName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Conversation */}
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {selectedMessage.conversation.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "host" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === "host"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === "host" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                        {formatTimestamp(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Reply */}
              <div className="space-y-4 border-t pt-4">
                <div>
                  <Label htmlFor="reply">Sua Resposta</Label>
                  <Textarea
                    id="reply"
                    placeholder="Escreva a sua resposta..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSendReply}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Resposta
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};