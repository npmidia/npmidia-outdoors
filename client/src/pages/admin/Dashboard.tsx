import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  Home,
  DollarSign,
  AlertTriangle,
  Bell,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (!authLoading && user?.role !== "admin") {
      setLocation("/");
    }
  }, [authLoading, isAuthenticated, user?.role, setLocation]);

  const { data: stats, isLoading, refetch } = trpc.admin.stats.useQuery(undefined, {
    enabled: user?.role === "admin",
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  // Atualização automática a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleRefresh = () => {
    refetch();
    setLastUpdate(new Date());
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Skeleton className="w-64 h-screen" />
          <div className="flex-1 p-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
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

  const pendingOver24h = stats?.pendingOver24h || [];
  const recentReservations = stats?.recentReservations || [];

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
            <Button variant="ghost" className="w-full justify-start text-background hover:bg-background/10 relative">
              <Calendar className="h-4 w-4 mr-3" />
              Reservas
              {(stats?.pendingReservations || 0) > 0 && (
                <Badge className="ml-auto bg-yellow-500 text-black">{stats?.pendingReservations}</Badge>
              )}
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
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo ao painel administrativo, {user?.name || "Admin"}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Atualizado {getTimeAgo(lastUpdate)}</span>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Alert for pending reservations over 24h */}
        {pendingOver24h.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Atenção: {pendingOver24h.length} reserva(s) pendente(s) há mais de 24 horas!</span>
            </div>
            <div className="space-y-2">
              {pendingOver24h.slice(0, 3).map((reservation: any) => (
                <div key={reservation.id} className="flex items-center justify-between bg-white p-3 rounded border border-red-100">
                  <div>
                    <span className="font-medium">{reservation.userName || "Cliente"}</span>
                    <span className="text-muted-foreground mx-2">•</span>
                    <span className="text-red-600 font-semibold">{formatCurrency(reservation.totalValue)}</span>
                    <span className="text-muted-foreground mx-2">•</span>
                    <span className="text-sm text-muted-foreground">{getTimeAgo(reservation.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {reservation.userPhone && (
                      <a 
                        href={`https://wa.me/55${reservation.userPhone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                    <Link href="/admin/reservas">
                      <Button size="sm" variant="destructive">Ver Reserva</Button>
                    </Link>
                  </div>
                </div>
              ))}
              {pendingOver24h.length > 3 && (
                <Link href="/admin/reservas">
                  <Button variant="link" className="text-red-600">
                    Ver todas as {pendingOver24h.length} reservas pendentes
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Faturamento Mensal
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats?.monthlyRevenue || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Reservas aprovadas este mês
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reservas Pendentes
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats?.pendingReservations || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Aguardando aprovação
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clientes Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.activeClients || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Com reservas no sistema
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Outdoors Ativos
              </CardTitle>
              <MapPin className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeOutdoors || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Disponíveis para reserva
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reservations - Real-time notifications */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Reservas Recentes
              </CardTitle>
              <Badge variant="outline" className="animate-pulse">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Tempo real
              </Badge>
            </CardHeader>
            <CardContent>
              {recentReservations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma reserva encontrada
                </p>
              ) : (
                <div className="space-y-3">
                  {recentReservations.map((reservation: any) => (
                    <div 
                      key={reservation.id} 
                      className={`p-3 rounded-lg border ${
                        reservation.status === 'pending' 
                          ? 'bg-yellow-50 border-yellow-200' 
                          : reservation.status === 'approved'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{reservation.userName || "Cliente"}</span>
                          <Badge 
                            variant={
                              reservation.status === 'pending' ? 'secondary' :
                              reservation.status === 'approved' ? 'default' : 'destructive'
                            }
                            className={
                              reservation.status === 'pending' ? 'bg-yellow-500 text-black' :
                              reservation.status === 'approved' ? 'bg-green-500' : ''
                            }
                          >
                            {reservation.status === 'pending' ? 'Pendente' :
                             reservation.status === 'approved' ? 'Aprovada' : 'Negada'}
                          </Badge>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatCurrency(reservation.totalValue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-3">
                          {reservation.userEmail && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {reservation.userEmail}
                            </span>
                          )}
                          {reservation.userPhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {reservation.userPhone}
                            </span>
                          )}
                        </div>
                        <span>{getTimeAgo(reservation.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/admin/reservas">
                <Button variant="outline" className="w-full mt-4">
                  Ver Todas as Reservas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/outdoors">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium block">Gerenciar Outdoors</span>
                      <span className="text-sm text-muted-foreground">Cadastrar, editar ou desativar</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>

              <Link href="/admin/reservas">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <span className="font-medium block">Aprovar Reservas</span>
                      <span className="text-sm text-muted-foreground">
                        {stats?.pendingReservations || 0} pendente(s)
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>

              <Link href="/admin/usuarios">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-medium block">Gerenciar Usuários</span>
                      <span className="text-sm text-muted-foreground">{stats?.totalUsers || 0} cadastrados</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>

              <Link href="/admin/bisemanas">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium block">Bi-semanas</span>
                      <span className="text-sm text-muted-foreground">Gerar calendário de períodos</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
