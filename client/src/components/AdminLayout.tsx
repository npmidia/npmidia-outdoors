import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoginUrl } from "@/const";
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  LogOut,
  Home
} from "lucide-react";
import { useEffect, ReactNode } from "react";
import { Link, useLocation } from "wouter";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (!authLoading && user?.role !== "admin") {
      setLocation("/");
    }
  }, [authLoading, isAuthenticated, user?.role, setLocation]);

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
          <Skeleton className="w-64 h-screen" />
          <div className="flex-1 p-8">
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-foreground text-background min-h-screen p-4 flex flex-col fixed left-0 top-0">
        <div className="mb-8">
          <img src="/logo-npmidia.png" alt="NPMIDIA" className="h-10 brightness-0 invert" />
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start text-background hover:bg-background/10 ${
                  isActive(item.href) ? "bg-background/20" : ""
                }`}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="border-t border-background/20 pt-4 space-y-2">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-background hover:bg-background/10">
              <Home className="h-4 w-4 mr-3" />
              Voltar ao Site
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-background hover:bg-background/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-64">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
