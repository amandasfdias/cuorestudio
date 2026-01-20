import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="animate-pulse">
          <img src={logo} alt="Cuore" className="w-48 h-auto opacity-50" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-6">
      <div className="animate-fade-in">
        <img 
          src={logo} 
          alt="Cuore Bake & Craft Studio" 
          className="w-64 h-auto"
        />
      </div>
      <p className="mt-8 text-muted-foreground font-body text-sm tracking-wide">
        Suas receitas favoritas em um só lugar
      </p>
    </div>
  );
};

export default Index;
