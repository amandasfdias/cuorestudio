import { ReactNode } from "react";
import TabBar from "./TabBar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="max-w-lg mx-auto">{children}</main>
      <TabBar />
    </div>
  );
};

export default AppLayout;
