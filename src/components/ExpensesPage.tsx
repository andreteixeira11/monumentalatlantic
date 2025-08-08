import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, Receipt, Calendar, Euro, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  property?: string;
}

const mockExpenses: Expense[] = [
  {
    id: "EXP-001",
    description: "Serviço de limpeza",
    amount: 150,
    category: "Limpeza",
    date: "2024-12-01",
    property: "Apartamento Centro Porto"
  },
  {
    id: "EXP-002",
    description: "Reparação torneira",
    amount: 80,
    category: "Manutenção",
    date: "2024-12-05",
    property: "Casa Vila Nova de Gaia"
  },
  {
    id: "EXP-003",
    description: "Conta de eletricidade",
    amount: 120,
    category: "Utilities",
    date: "2024-12-10",
    property: "Loft Ribeira"
  },
  {
    id: "EXP-004",
    description: "Anúncio no Facebook",
    amount: 50,
    category: "Marketing",
    date: "2024-12-12",
  },
  {
    id: "EXP-005",
    description: "Produtos de limpeza",
    amount: 35,
    category: "Limpeza",
    date: "2024-12-15",
  }
];

const expenseCategories = [
  "Limpeza",
  "Manutenção", 
  "Utilities",
  "Marketing",
  "Seguros",
  "Taxas",
  "Outros"
];

const properties = [
  "Apartamento Centro Porto",
  "Casa Vila Nova de Gaia",
  "Loft Ribeira"
];

interface ExpensesPageProps {
  onBack: () => void;
}

export const ExpensesPage = ({ onBack }: ExpensesPageProps) => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    description: "",
    amount: 0,
    category: "",
    date: new Date().toISOString().split('T')[0],
    property: ""
  });
  const { toast } = useToast();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Limpeza":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Manutenção":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Utilities":
        return "bg-green-100 text-green-800 border-green-200";
      case "Marketing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Seguros":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Taxas":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category || !newExpense.date) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const expense: Expense = {
      id: `EXP-${Date.now()}`,
      description: newExpense.description!,
      amount: newExpense.amount!,
      category: newExpense.category!,
      date: newExpense.date!,
      property: newExpense.property || undefined
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      description: "",
      amount: 0,
      category: "",
      date: new Date().toISOString().split('T')[0],
      property: ""
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Despesa Adicionada",
      description: "A despesa foi registada com sucesso.",
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast({
      title: "Despesa Removida",
      description: "A despesa foi removida com sucesso.",
    });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonthExpenses = expenses
    .filter(expense => expense.date.startsWith('2024-12'))
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Despesas</h1>
            <p className="text-muted-foreground">Gestão das suas despesas</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Despesa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Despesa</DialogTitle>
              <DialogDescription>
                Registe uma nova despesa para acompanhar os seus custos.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Input
                  id="description"
                  placeholder="Ex: Serviço de limpeza"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor (€) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Propriedade (Opcional)</Label>
                <Select
                  value={newExpense.property}
                  onValueChange={(value) => setNewExpense({ ...newExpense, property: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma propriedade" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property} value={property}>
                        {property}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddExpense}>
                  Adicionar Despesa
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas Este Mês
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{currentMonthExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.filter(e => e.date.startsWith('2024-12')).length} despesas registadas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Despesas
            </CardTitle>
            <Euro className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.length} despesas no total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>Lista de Despesas</span>
          </CardTitle>
          <CardDescription>
            Todas as suas despesas registadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ainda não há despesas registadas</p>
              </div>
            ) : (
              expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold">{expense.description}</span>
                      <Badge className={getCategoryColor(expense.category)}>
                        {expense.category}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(expense.date).toLocaleDateString('pt-PT')}</span>
                      </span>
                      {expense.property && (
                        <span>{expense.property}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold">€{expense.amount.toLocaleString()}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
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