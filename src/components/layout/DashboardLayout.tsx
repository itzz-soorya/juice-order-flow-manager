
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  User, 
  Home, 
  Coffee, 
  LayoutGrid, 
  BarChart 
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Coffee className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Sadmonks Juice Shop</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium capitalize">
                {currentUser?.role}: {currentUser?.username}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-sm">
          <nav className="p-4 space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/dashboard")}
            >
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => navigate("/tables")}
            >
              <LayoutGrid className="mr-2 h-5 w-5" />
              Tables
            </Button>
            {currentUser?.role === "admin" && (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => navigate("/juices")}
                >
                  <Coffee className="mr-2 h-5 w-5" />
                  Manage Juices
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => navigate("/reports")}
                >
                  <BarChart className="mr-2 h-5 w-5" />
                  Sales Reports
                </Button>
              </>
            )}
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
