import logo from "@/assets/logo.png";

const Index = () => {
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
