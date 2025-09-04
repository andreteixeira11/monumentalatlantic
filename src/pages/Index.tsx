import { useAuth } from "@/contexts/AuthContext";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return <Dashboard onLogout={handleLogout} />;
};

export default Index;
