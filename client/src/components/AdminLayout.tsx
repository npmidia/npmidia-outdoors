import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getLoginUrl } from "@/const";
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  LogOut,
  Home,
  Menu,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useEffect, ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (!authLoading && user?.role !== "admin") {
      setLocation("/");
    }
  }, [authLoading, isAuthenticated, user?.role, setLocation]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location === "/admin";
    }
    return location.startsWith(path);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Skeleton className="w-64 h-screen hidden lg:block" />
          <div className="flex-1 p-4 lg:p-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return null;
  }

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/outdoors", icon: MapPin, label: "Outdoors" },
    { href: "/admin/reservas", icon: Calendar, label: "Reservas" },
    { href: "/admin/usuarios", icon: Users, label: "Usuários" },
    { href: "/admin/bisemanas", icon: Clock, label: "Bi-semanas" },
  ];

  const SidebarContent = ({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) => (
    <>
      <div className={`mb-8 ${collapsed ? "flex justify-center" : ""}`}>
        {collapsed ? (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
            NP
          </div>
        ) : (
          <img src="/logo-npmidia.png" alt="NPMIDIA" className="h-10 brightness-0 invert" />
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={onNavigate}>
            <Button 
              variant="ghost" 
              className={`w-full ${collapsed ? "justify-center px-2" : "justify-start"} text-background hover:bg-background/10 ${
                isActive(item.href) ? "bg-background/20" : ""
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="border-t border-background/20 pt-4 space-y-2">
        <Link href="/" onClick={onNavigate}>
          <Button 
            variant="ghost" 
            className={`w-full ${collapsed ? "justify-center px-2" : "justify-start"} text-background hover:bg-background/10`}
            title={collapsed ? "Voltar ao Site" : undefined}
          >
            <Home className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
            {!collapsed && <span>Voltar ao Site</span>}
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          className={`w-full ${collapsed ? "justify-center px-2" : "justify-start"} text-background hover:bg-background/10`}
          onClick={handleLogout}
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-foreground text-background flex items-center justify-between px-4 z-50">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-background hover:bg-background/10">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-foreground border-none">
            <div className="h-full p-4 flex flex-col">
              <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <img src="/logo-npmidia.png" alt="NPMIDIA" className="h-8 brightness-0 invert" />
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex fixed left-0 top-0 h-screen bg-foreground text-background flex-col transition-all duration-300 z-40 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className={`flex-1 p-4 flex flex-col ${sidebarCollapsed ? "items-center" : ""}`}>
          <SidebarContent collapsed={sidebarCollapsed} />
        </div>
        
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center shadow-md hover:bg-foreground/90 transition-colors border border-background/20"
          title={sidebarCollapsed ? "Expandir menu" : "Minimizar menu"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main 
        className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        } pt-14 lg:pt-0`}
      >
        <div className="p-4 lg:p-8">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-muted-foreground text-sm lg:text-base">{subtitle}</p>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
