import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: () => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao seu portal de gestão.",
      });
      onLogin();
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md shadow-medium">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Acesso ao Portal</CardTitle>
        <CardDescription>
          Entre com as suas credenciais para aceder ao dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Palavra-passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            variant="hero"
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "A entrar..." : "Entrar"}
          </Button>
        </form>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Button variant="link" className="p-0 h-auto text-primary">
              Registe-se aqui
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};