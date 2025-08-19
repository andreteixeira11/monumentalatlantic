import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Euro, TrendingUp, TrendingDown, Calendar, Plus, Receipt, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

const monthlyFinanceData = [
  { month: "Jan", revenue: 2400, expenses: 800, profit: 1600 },
  { month: "Fev", revenue: 1398, expenses: 600, profit: 798 },
  { month: "Mar", revenue: 3200, expenses: 1200, profit: 2000 },
  { month: "Abr", revenue: 3908, expenses: 1500, profit: 2408 },
  { month: "Mai", revenue: 4800, expenses: 1800, profit: 3000 },
  { month: "Jun", revenue: 3800, expenses: 1400, profit: 2400 },
];

const expenseCategories = [
  { name: "Limpeza", value: 35, color: "hsl(217, 91%, 60%)" },
  { name: "Manutenção", value: 25, color: "hsl(217, 91%, 70%)" },
  { name: "Utilities", value: 20, color: "hsl(230, 91%, 65%)" },
  { name: "Marketing", value: 12, color: "hsl(240, 91%, 60%)" },
  { name: "Outros", value: 8, color: "hsl(250, 91%, 65%)" },
];

const currentMonthStats = {
  revenue: 3800,
  expenses: 1400,
  profit: 2400,
  profitMargin: 63.2
};

const totalStats = {
  revenue: 19506,
  expenses: 7300,
  profit: 12206,
  profitMargin: 62.6
};

export const FinancesPage = () => {

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finanças</h1>
          <p className="text-muted-foreground">Visão geral das suas finanças e desempenho</p>
        </div>
      </div>

      <div className="space-y-6">
          {/* Current Month Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Receita (Mês Atual)
                </CardTitle>
                <Euro className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{currentMonthStats.revenue.toLocaleString()}</div>
                <p className="text-xs text-success flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18.7% vs mês anterior
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Despesas (Mês Atual)
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{currentMonthStats.expenses.toLocaleString()}</div>
                <p className="text-xs text-destructive flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.3% vs mês anterior
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Lucro (Mês Atual)
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{currentMonthStats.profit.toLocaleString()}</div>
                <p className="text-xs text-primary flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +25.1% vs mês anterior
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Margem de Lucro
                </CardTitle>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {currentMonthStats.profitMargin}%
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMonthStats.profitMargin}%</div>
                <p className="text-xs text-primary flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3.2% vs mês anterior
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Total Stats */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Totais Desde o Início</CardTitle>
              <CardDescription>
                Desempenho financeiro desde que existe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                  <p className="text-3xl font-bold text-success">€{totalStats.revenue.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Despesas Totais</p>
                  <p className="text-3xl font-bold text-destructive">€{totalStats.expenses.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Lucro Total</p>
                  <p className="text-3xl font-bold text-primary">€{totalStats.profit.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Margem Média</p>
                  <p className="text-3xl font-bold">{totalStats.profitMargin}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-soft bg-gradient-to-br from-card to-card/50 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl">Evolução Financeira</CardTitle>
                <CardDescription>
                  Receitas, despesas e lucro por mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={monthlyFinanceData} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" strokeOpacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        `€${value}`,
                        name === 'revenue' ? 'Receita' : 
                        name === 'expenses' ? 'Despesas' : 'Lucro'
                      ]}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)'
                      }}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="hsl(var(--success))" 
                      name="revenue" 
                      radius={[6, 6, 0, 0]}
                      maxBarSize={60}
                    />
                    <Bar 
                      dataKey="expenses" 
                      fill="hsl(var(--destructive))" 
                      name="expenses" 
                      radius={[6, 6, 0, 0]}
                      maxBarSize={60}
                    />
                    <Bar 
                      dataKey="profit" 
                      fill="hsl(var(--primary))" 
                      name="profit" 
                      radius={[6, 6, 0, 0]}
                      maxBarSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-soft bg-gradient-to-br from-card to-card/50 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl">Categorias de Despesas</CardTitle>
                <CardDescription>
                  Distribuição das despesas por categoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <RechartsPieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={3}
                      dataKey="value"
                      labelLine={false}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text 
                            x={x} 
                            y={y} 
                            fill="white" 
                            textAnchor={x > cx ? 'start' : 'end'} 
                            dominantBaseline="central"
                            fontSize={12}
                            fontWeight="500"
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke="hsl(var(--background))"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Profit Trend */}
          <Card className="shadow-soft bg-gradient-to-br from-card to-card/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Tendência de Lucro</CardTitle>
              <CardDescription>
                Evolução do lucro mensal com área sombreada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthlyFinanceData}>
                  <defs>
                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(var(--muted))" 
                    strokeOpacity={0.3} 
                  />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip 
                    formatter={(value) => [`€${value}`, 'Lucro']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4}
                    dot={{ 
                      fill: 'hsl(var(--primary))', 
                      strokeWidth: 3, 
                      r: 8,
                      stroke: 'hsl(var(--background))'
                    }}
                    activeDot={{ 
                      r: 10, 
                      fill: 'hsl(var(--primary))',
                      stroke: 'hsl(var(--background))',
                      strokeWidth: 3,
                      filter: 'drop-shadow(0 4px 6px hsl(var(--primary) / 0.3))'
                    }}
                    fill="url(#profitGradient)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
      </div>
    </div>
  );
};