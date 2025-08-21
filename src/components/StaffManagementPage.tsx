import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Users, Plus, CheckCircle, Clock, AlertTriangle, Calendar, Download, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  propertyName: string;
  assignedTo: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  estimatedTime: number; // em minutos
  type: "cleaning" | "maintenance" | "checkin" | "checkout" | "other";
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isActive: boolean;
  skills: string[];
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Limpeza Check-out",
    description: "Limpeza completa após check-out do hóspede",
    propertyName: "Apartamento Centro Porto",
    assignedTo: "Maria Silva",
    priority: "high",
    status: "pending",
    dueDate: "2024-01-20",
    estimatedTime: 120,
    type: "cleaning"
  },
  {
    id: "2",
    title: "Verificação de Manutenção",
    description: "Verificar torneiras e luzes antes do próximo check-in",
    propertyName: "Casa Vila Nova de Gaia",
    assignedTo: "João Santos",
    priority: "medium",
    status: "in-progress",
    dueDate: "2024-01-21",
    estimatedTime: 60,
    type: "maintenance"
  },
  {
    id: "3",
    title: "Preparação Check-in",
    description: "Preparar amenities e verificar condições da propriedade",
    propertyName: "Loft Ribeira",
    assignedTo: "Ana Costa",
    priority: "medium",
    status: "completed",
    dueDate: "2024-01-19",
    estimatedTime: 90,
    type: "checkin"
  }
];

const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "Maria Silva",
    role: "Housekeeping",
    email: "maria@exemplo.com",
    phone: "+351 910 123 456",
    isActive: true,
    skills: ["limpeza", "lavandaria", "organização"]
  },
  {
    id: "2",
    name: "João Santos",
    role: "Manutenção",
    email: "joao@exemplo.com",
    phone: "+351 920 654 321",
    isActive: true,
    skills: ["eletricidade", "canalização", "carpintaria"]
  },
  {
    id: "3",
    name: "Ana Costa",
    role: "Guest Relations",
    email: "ana@exemplo.com",
    phone: "+351 930 789 012",
    isActive: true,
    skills: ["check-in", "atendimento", "resolução problemas"]
  }
];

export const StaffManagementPage = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string>("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Concluída</Badge>;
      case "in-progress":
        return <Badge variant="secondary" className="bg-primary text-primary-foreground">Em Progresso</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Pendente</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Alta</Badge>;
      case "medium":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Média</Badge>;
      case "low":
        return <Badge variant="outline">Baixa</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const handleAutoAssignTask = (taskId: string) => {
    // Simular atribuição automática baseada em skills e disponibilidade
    const availableStaff = staff.filter(s => s.isActive);
    const randomStaff = availableStaff[Math.floor(Math.random() * availableStaff.length)];
    
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, assignedTo: randomStaff.name, status: "in-progress" as const }
        : task
    ));

    toast({
      title: "Tarefa Atribuída",
      description: `Tarefa atribuída automaticamente a ${randomStaff.name}`,
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Lista de Tarefas",
      description: "A gerar PDF com todas as tarefas...",
    });
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: "completed" as const }
        : task
    ));

    toast({
      title: "Tarefa Concluída",
      description: "Tarefa marcada como concluída com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Gestão de Staff</h1>
          <p className="text-muted-foreground mt-1">
            Gerir equipas, tarefas e automatizar atribuições
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button onClick={handleDownloadPDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Lista PDF
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="staff">Equipa</TabsTrigger>
          <TabsTrigger value="automation">Automação</TabsTrigger>
        </TabsList>

        {/* Tasks */}
        <TabsContent value="tasks" className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tarefas</p>
                    <p className="text-2xl font-bold">{tasks.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Concluídas</p>
                    <p className="text-2xl font-bold text-success">
                      {tasks.filter(t => t.status === "completed").length}
                    </p>
                  </div>
                  <Badge className="bg-success text-success-foreground">
                    {Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Em Progresso</p>
                    <p className="text-2xl font-bold text-primary">
                      {tasks.filter(t => t.status === "in-progress").length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendentes</p>
                    <p className="text-2xl font-bold text-warning">
                      {tasks.filter(t => t.status === "pending").length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Tarefas</CardTitle>
              <CardDescription>Todas as tarefas organizadas por prioridade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg space-y-3 lg:space-y-0">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {task.type === "cleaning" && <Settings className="h-5 w-5 text-primary" />}
                        {task.type === "maintenance" && <Settings className="h-5 w-5 text-primary" />}
                        {task.type === "checkin" && <Users className="h-5 w-5 text-primary" />}
                        {task.type === "checkout" && <Users className="h-5 w-5 text-primary" />}
                        {task.type === "other" && <Settings className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <p className="text-sm text-muted-foreground">{task.propertyName}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {getStatusBadge(task.status)}
                          {getPriorityBadge(task.priority)}
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString('pt-PT')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {task.estimatedTime}min
                          </span>
                        </div>
                        <p className="text-sm font-medium mt-1">
                          Atribuído a: {task.assignedTo}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 lg:ml-4">
                      <div className="flex space-x-2">
                        {task.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAutoAssignTask(task.id)}
                          >
                            Atribuir Auto
                          </Button>
                        )}
                        {task.status === "in-progress" && (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Concluir
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff */}
        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Membros da Equipa</CardTitle>
                <CardDescription>Gerir membros do staff e suas competências</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Membro
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staff.map((member) => (
                  <div key={member.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg space-y-3 lg:space-y-0">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {member.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={member.isActive}
                          onCheckedChange={(checked) => {
                            setStaff(staff.map(s => 
                              s.id === member.id ? { ...s, isActive: checked } : s
                            ));
                          }}
                        />
                        <Label className="text-sm">Ativo</Label>
                      </div>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Automação</CardTitle>
              <CardDescription>Configurar regras automáticas para atribuição de tarefas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Atribuição Automática</h3>
                  <p className="text-sm text-muted-foreground">
                    Atribuir tarefas automaticamente baseado em competências e disponibilidade
                  </p>
                </div>
                <Switch 
                  checked={autoAssignEnabled}
                  onCheckedChange={setAutoAssignEnabled}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Regras de Atribuição</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Limpeza → Housekeeping</Label>
                    <Select defaultValue="maria">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maria">Maria Silva</SelectItem>
                        <SelectItem value="auto">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Manutenção → Técnico</Label>
                    <Select defaultValue="joao">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="joao">João Santos</SelectItem>
                        <SelectItem value="auto">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Check-in → Guest Relations</Label>
                    <Select defaultValue="ana">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ana">Ana Costa</SelectItem>
                        <SelectItem value="auto">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tempo Antecedência (horas)</Label>
                    <Input type="number" defaultValue="2" />
                  </div>
                </div>

                <div className="pt-4">
                  <Button>Guardar Configurações</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};