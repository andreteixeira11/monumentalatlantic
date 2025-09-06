import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";

export const AirbnbCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processando autenticação...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage('Autenticação cancelada ou erro na autorização.');
        setTimeout(() => window.close(), 3000);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Parâmetros de callback inválidos.');
        setTimeout(() => window.close(), 3000);
        return;
      }

      try {
        const response = await supabase.functions.invoke('airbnb-oauth', {
          body: {
            action: 'callback',
            code,
            state
          }
        });

        if (response.data?.success) {
          setStatus('success');
          setMessage('Conta Airbnb conectada com sucesso!');
          setTimeout(() => window.close(), 2000);
        } else {
          throw new Error(response.data?.error || 'Erro ao processar callback');
        }
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage('Erro ao conectar com o Airbnb. Tente novamente.');
        setTimeout(() => window.close(), 3000);
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            {status === 'loading' && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
            {status === 'success' && <CheckCircle className="h-6 w-6 text-success" />}
            {status === 'error' && <XCircle className="h-6 w-6 text-destructive" />}
            <span>Conectar Airbnb</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">{message}</p>
          {status === 'success' && (
            <p className="text-sm text-success mt-2">Esta janela será fechada automaticamente.</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-destructive mt-2">Esta janela será fechada automaticamente.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};