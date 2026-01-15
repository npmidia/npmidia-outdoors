import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, ShoppingCart, Heart } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link } from "wouter";

export default function MinhasReservas() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  const { data: reservations, isLoading } = trpc.reservation.myReservations.useQuery();
  const { data: outdoors } = trpc.outdoor.list.useQuery({ activeOnly: false });
  const { data: allBiweeks } = trpc.biweek.getByYear.useQuery({ year: new Date().getFullYear() });

  const reservationsWithDetails = useMemo(() => {
    if (!reservations || !outdoors) return [];

    return reservations.map(reservation => {
      const outdoor = outdoors.find(o => o.id === reservation.outdoorId);
      return {
        ...reservation,
        outdoor,
      };
    });
  }, [reservations, outdoors]);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numPrice);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprovado
          </Badge>
        );
      case "denied":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Negado
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b border-border">
          <div className="container flex items-center h-16">
            <Skeleton className="h-10 w-32" />
          </div>
        </header>
        <main className="container py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-npmidia.png" alt="NPMIDIA" className="h-10" />
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/outdoors">
              <Button variant="ghost">Ver Outdoors</Button>
            </Link>
            <Link href="/favoritos">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/carrinho">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="outline">Painel Admin</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          {/* Back Link */}
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Calendar className="h-8 w-8" />
            Minhas Reservas
          </h1>

          {reservationsWithDetails.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Você ainda não tem reservas
              </h2>
              <p className="text-muted-foreground mb-6">
                Explore nossos outdoors e faça sua primeira reserva
              </p>
              <Link href="/outdoors">
                <Button>Ver Outdoors Disponíveis</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reservationsWithDetails.map((reservation) => (
                <Card key={reservation.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {/* Outdoor Photo */}
                    <div className="sm:w-48 aspect-video sm:aspect-square bg-muted flex-shrink-0">
                      {reservation.outdoor?.photoUrl ? (
                        <img
                          src={reservation.outdoor.photoUrl}
                          alt={reservation.outdoor.code}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Reservation Details */}
                    <CardContent className="flex-1 p-4">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{reservation.outdoor?.code || "Outdoor"}</h3>
                          <p className="text-sm text-muted-foreground">
                            {reservation.outdoor?.neighborhood && `${reservation.outdoor.neighborhood}, `}
                            {reservation.outdoor?.city}
                          </p>
                        </div>
                        {getStatusBadge(reservation.status)}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Data do pedido:</p>
                          <p className="font-medium">{formatDate(reservation.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Valor total:</p>
                          <p className="font-bold text-primary">{formatPrice(reservation.totalValue)}</p>
                        </div>
                      </div>

                      {/* Services */}
                      {(reservation.includePaperGlue || reservation.includeCanvasInstall) && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-sm text-muted-foreground mb-1">Serviços inclusos:</p>
                          <div className="flex flex-wrap gap-2">
                            {reservation.includePaperGlue && (
                              <Badge variant="secondary">Papel e Colagem</Badge>
                            )}
                            {reservation.includeCanvasInstall && (
                              <Badge variant="secondary">Lona e Instalação</Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-6 mt-auto">
        <div className="container text-center">
          <p className="text-sm text-background/70">
            © {new Date().getFullYear()} NPMIDIA. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
