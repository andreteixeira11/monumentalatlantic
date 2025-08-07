import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Dashboard } from "@/components/Dashboard";
import { Home } from "lucide-react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-primary p-4 rounded-2xl shadow-strong">
              <Home className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Portal de Gestão
          </h1>
          <h2 className="text-3xl font-semibold mb-6 text-foreground">
            Alojamento Local
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Monitore o desempenho das suas propriedades com analytics avançados, 
            gráficos detalhados e métricas em tempo real.
          </p>
        </div>
        
        <div className="flex justify-center animate-fade-in">
          <LoginForm onLogin={handleLogin} />
        </div>
        
        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-sm">
            Gerir • Analisar • Otimizar o seu negócio de alojamento local
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
