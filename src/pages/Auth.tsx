import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Building2, Loader2, Check } from 'lucide-react';

const Auth = () => {
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
    packageTier: 'basic',
    paymentFrequency: 'monthly'
  });

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: 'Erro no login',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Login realizado com sucesso!',
            description: 'Bem-vindo de volta.',
          });
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: 'Erro',
            description: 'As palavras-passe não coincidem.',
            variant: 'destructive',
          });
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) {
          toast({
            title: 'Erro no registo',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Conta criada com sucesso!',
            description: 'Verifique o seu email para confirmar a conta.',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Algo correu mal. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">
              {isLogin ? 'Entrar na conta' : 'Criar conta'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Aceda à sua plataforma de gestão de alojamento'
                : 'Crie a sua conta para começar a gerir propriedades'
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="O seu nome completo"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Palavra-passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="A sua palavra-passe"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar palavra-passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme a sua palavra-passe"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required={!isLogin}
                />
              </div>
            )}

            {!isLogin && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Escolha o seu plano</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'basic', name: 'Basic', price: '€29', features: ['1 propriedade', 'Suporte básico'] },
                      { id: 'premium', name: 'Premium', price: '€59', features: ['5 propriedades', 'Integrações avançadas', 'Suporte prioritário'] },
                      { id: 'deluxe', name: 'Deluxe', price: '€99', features: ['Propriedades ilimitadas', 'Todas as funcionalidades', 'Suporte 24/7'] }
                    ].map((plan) => (
                      <div
                        key={plan.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.packageTier === plan.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, packageTier: plan.id }))}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{plan.name}</span>
                              <Badge variant="secondary">{plan.price}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {plan.features.join(' • ')}
                            </div>
                          </div>
                          {formData.packageTier === plan.id && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentFrequency">Frequência de pagamento</Label>
                  <Select 
                    value={formData.paymentFrequency} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, paymentFrequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral (-10%)</SelectItem>
                      <SelectItem value="annual">Anual (-20%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              {isLogin 
                ? 'Não tem conta? Criar conta'
                : 'Já tem conta? Entrar'
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;