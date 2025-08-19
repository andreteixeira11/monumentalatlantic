import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Euro, TrendingUp, TrendingDown, Calendar, Plus, Receipt, PieChart, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

const monthlyOverviewData = [
  {
    month: "Janeiro",
    estadia: 2200,
    taxaLimpeza: 150,
    valorTotalFaturado: 2350,
    comissaoBooking: 350,
    limpezaJack: 120,
    consumiveisJack: 80,
    comissaoGestao: 352.5, // 15% do valor total
    despesasGerais: 200,
    autoliquidacaoIVA: 469,
    agua: 45,
    luz: 85,
    internet: 40,
    brindesHospedes: 30,
    valorAntesImposto: 1648,
    irs: 164.8, // 10%
    valorLiquido: 1483.2
  },
  {
    month: "Fevereiro", 
    estadia: 1800,
    taxaLimpeza: 150,
    valorTotalFaturado: 1950,
    comissaoBooking: 292.5,
    limpezaJack: 120,
    consumiveisJack: 75,
    comissaoGestao: 292.5,
    despesasGerais: 180,
    autoliquidacaoIVA: 390,
    agua: 42,
    luz: 78,
    internet: 40,
    brindesHospedes: 25,
    valorAntesImposto: 1365,
    irs: 136.5,
    valorLiquido: 1228.5
  },
  {
    month: "Março",
    estadia: 2800,
    taxaLimpeza: 150,
    valorTotalFaturado: 2950,
    comissaoBooking: 442.5,
    limpezaJack: 120,
    consumiveisJack: 90,
    comissaoGestao: 442.5,
    despesasGerais: 220,
    autoliquidacaoIVA: 590,
    agua: 48,
    luz: 92,
    internet: 40,
    brindesHospedes: 35,
    valorAntesImposto: 2070,
    irs: 207,
    valorLiquido: 1863
  },
  {
    month: "Abril",
    estadia: 3200,
    taxaLimpeza: 200,
    valorTotalFaturado: 3400,
    comissaoBooking: 510,
    limpezaJack: 150,
    consumiveisJack: 95,
    comissaoGestao: 510,
    despesasGerais: 250,
    autoliquidacaoIVA: 680,
    agua: 52,
    luz: 105,
    internet: 40,
    brindesHospedes: 40,
    valorAntesImposto: 2388,
    irs: 238.8,
    valorLiquido: 2149.2
  },
  {
    month: "Maio",
    estadia: 4200,
    taxaLimpeza: 250,
    valorTotalFaturado: 4450,
    comissaoBooking: 667.5,
    limpezaJack: 180,
    consumiveisJack: 110,
    comissaoGestao: 667.5,
    despesasGerais: 300,
    autoliquidacaoIVA: 890,
    agua: 58,
    luz: 118,
    internet: 40,
    brindesHospedes: 50,
    valorAntesImposto: 3119,
    irs: 311.9,
    valorLiquido: 2807.1
  },
  {
    month: "Junho",
    estadia: 3600,
    taxaLimpeza: 200,
    valorTotalFaturado: 3800,
    comissaoBooking: 570,
    limpezaJack: 150,
    consumiveisJack: 100,
    comissaoGestao: 570,
    despesasGerais: 280,
    autoliquidacaoIVA: 760,
    agua: 55,
    luz: 110,
    internet: 40,
    brindesHospedes: 45,
    valorAntesImposto: 2660,
    irs: 266,
    valorLiquido: 2394
  }
];

export const FinancesPage = () => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Configurações do PDF
    doc.setFontSize(20);
    doc.text('Relatório Financeiro', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32);
    
    // Adicionar estatísticas resumidas
    doc.setFontSize(14);
    doc.text('Resumo Atual', 14, 50);
    doc.setFontSize(10);
    doc.text(`Receita Mês Atual: €${currentMonthStats.revenue.toLocaleString()}`, 14, 60);
    doc.text(`Despesas Mês Atual: €${currentMonthStats.expenses.toLocaleString()}`, 14, 68);
    doc.text(`Lucro Mês Atual: €${currentMonthStats.profit.toLocaleString()}`, 14, 76);
    doc.text(`Margem de Lucro: ${currentMonthStats.profitMargin}%`, 14, 84);
    
    // Preparar dados para a tabela
    const tableData = monthlyOverviewData.map(data => [
      data.month,
      `€${data.estadia.toLocaleString()}`,
      `€${data.taxaLimpeza.toLocaleString()}`,
      `€${data.valorTotalFaturado.toLocaleString()}`,
      `-€${data.comissaoBooking.toLocaleString()}`,
      `-€${data.limpezaJack.toLocaleString()}`,
      `-€${data.consumiveisJack.toLocaleString()}`,
      `-€${data.comissaoGestao.toLocaleString()}`,
      `-€${data.despesasGerais.toLocaleString()}`,
      `-€${data.autoliquidacaoIVA.toLocaleString()}`,
      `-€${data.agua.toLocaleString()}`,
      `-€${data.luz.toLocaleString()}`,
      `-€${data.internet.toLocaleString()}`,
      `-€${data.brindesHospedes.toLocaleString()}`,
      `€${data.valorAntesImposto.toLocaleString()}`,
      `-€${data.irs.toLocaleString()}`,
      `€${data.valorLiquido.toLocaleString()}`
    ]);
    
    // Adicionar tabela
    (doc as any).autoTable({
      head: [[
        'Mês', 'Estadia', 'Taxa Limpeza', 'Total Faturado',
        'Comissão Booking', 'Limpeza (Jack)', 'Consumíveis',
        'Comissão Gestão', 'Despesas Gerais', 'Autoliq. IVA',
        'Água', 'Luz', 'Internet', 'Brindes',
        'Antes Imposto', 'IRS (10%)', 'Valor Líquido'
      ]],
      body: tableData,
      startY: 100,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [34, 197, 94], // Verde
        textColor: 255,
        fontSize: 7,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 15 },
        16: { fillColor: [240, 253, 244], textColor: [22, 163, 74], fontStyle: 'bold' }
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      }
    });
    
    // Salvar o PDF
    doc.save(`relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finanças</h1>
          <p className="text-muted-foreground">Visão geral das suas finanças e desempenho</p>
        </div>
        <Button 
          onClick={generatePDF}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
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

          {/* Monthly Overview Table */}
          <Card className="shadow-soft bg-gradient-to-br from-card to-card/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Resumo Mensal Detalhado</CardTitle>
              <CardDescription>
                Overview completo das receitas, despesas e valores líquidos por mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-muted">
                      <TableHead className="w-[100px] font-semibold">Mês</TableHead>
                      <TableHead className="text-right font-semibold">Estadia</TableHead>
                      <TableHead className="text-right font-semibold">Taxa Limpeza</TableHead>
                      <TableHead className="text-right font-semibold">Total Faturado</TableHead>
                      <TableHead className="text-right font-semibold">Comissão Booking</TableHead>
                      <TableHead className="text-right font-semibold">Limpeza (Jack)</TableHead>
                      <TableHead className="text-right font-semibold">Consumíveis</TableHead>
                      <TableHead className="text-right font-semibold">Comissão Gestão</TableHead>
                      <TableHead className="text-right font-semibold">Despesas Gerais</TableHead>
                      <TableHead className="text-right font-semibold">Autoliq. IVA</TableHead>
                      <TableHead className="text-right font-semibold">Água</TableHead>
                      <TableHead className="text-right font-semibold">Luz</TableHead>
                      <TableHead className="text-right font-semibold">Internet</TableHead>
                      <TableHead className="text-right font-semibold">Brindes</TableHead>
                      <TableHead className="text-right font-semibold">Antes Imposto</TableHead>
                      <TableHead className="text-right font-semibold">IRS (10%)</TableHead>
                      <TableHead className="text-right font-semibold text-primary">Valor Líquido</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyOverviewData.map((data, index) => (
                      <TableRow key={index} className="border-muted hover:bg-muted/50">
                        <TableCell className="font-medium">{data.month}</TableCell>
                        <TableCell className="text-right text-success">€{data.estadia.toLocaleString()}</TableCell>
                        <TableCell className="text-right">€{data.taxaLimpeza.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-semibold text-success">€{data.valorTotalFaturado.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-destructive">-€{data.comissaoBooking.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-destructive">-€{data.limpezaJack.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-destructive">-€{data.consumiveisJack.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-destructive">-€{data.comissaoGestao.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-destructive">-€{data.despesasGerais.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-destructive">-€{data.autoliquidacaoIVA.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground">-€{data.agua.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground">-€{data.luz.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground">-€{data.internet.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground">-€{data.brindesHospedes.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">€{data.valorAntesImposto.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-destructive">-€{data.irs.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-bold text-primary text-lg">€{data.valorLiquido.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
};