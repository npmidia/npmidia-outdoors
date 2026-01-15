import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  ArrowRight,
  LogOut,
  Home
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
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

  const { data: stats, isLoading } = trpc.admin.stats.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Skeleton className="w-64 h-screen" />
          <div className="flex-1 p-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-foreground text-background min-h-screen p-4 flex flex-col">
        <div className="mb-8">
          <img src="/logo-npmidia.png" alt="NPMIDIA" className="h-10 brightness-0 invert" />
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start text-background hover:bg-background/10 bg-background/20">
              <LayoutDashboard className="h-4 w-4 mr-3" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/outdoors">
            <Button variant="ghost" className="w-full justify-start text-background hover:bg-background/10">
              <MapPin className="h-4 w-4 mr-3" />
              Outdoors
            </Button>
          </Link>
          <Link href="/admin/reservas">
            <Button variant="ghost" className="w-full justify-start text-background hover:bg-background/10">
              <Calendar className="h-4 w-4 mr-3" />
              Reservas
            </Button>
          </Link>
          <Link href="/admin/usuarios">
            <Button variant="ghost" className="w-full justify-start text-background hover:bg-background/10">
              <Users className="h-4 w-4 mr-3" />
              Usuários
            </Button>
          </Link>
          <Link href="/admin/bisemanas">
            <Button variant="ghost" className="w-full justify-start text-background hover:bg-background/10">
              <Clock className="h-4 w-4 mr-3" />
              Bi-semanas
            </Button>
          </Link>
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
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo ao painel administrativo, {user?.name || "Admin"}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reservas Pendentes
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.pendingReservations || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Aguardando aprovação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Outdoors Ativos
              </CardTitle>
              <MapPin className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.activeOutdoors || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Disponíveis para reserva
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Cadastrados na plataforma
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/outdoors">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Gerenciar Outdoors</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/reservas">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="font-medium">Ver Reservas</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/usuarios">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium">Gerenciar Usuários</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/bisemanas">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-medium">Bi-semanas</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
