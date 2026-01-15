import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Heart, MapPin, Lightbulb, ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function Favoritos() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  const { data: favorites, isLoading } = trpc.favorite.list.useQuery();
  const { data: outdoors } = trpc.outdoor.list.useQuery({ activeOnly: false });

  const utils = trpc.useUtils();
  const removeFavorite = trpc.favorite.remove.useMutation({
    onSuccess: () => {
      toast.success("Removido dos favoritos");
      utils.favorite.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover favorito");
    },
  });

  const favoriteOutdoors = useMemo(() => {
    if (!favorites || !outdoors) return [];
    return favorites
      .map(fav => outdoors.find(o => o.id === fav.outdoorId))
      .filter(Boolean);
  }, [favorites, outdoors]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(price));
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-64 rounded-xl" />
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
            <Link href="/minhas-reservas">
              <Button variant="ghost">Minhas Reservas</Button>
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
          <Link href="/outdoors" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Galeria
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Heart className="h-8 w-8 fill-primary text-primary" />
            Meus Favoritos
          </h1>

          {favoriteOutdoors.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Você ainda não tem favoritos
              </h2>
              <p className="text-muted-foreground mb-6">
                Marque outdoors como favoritos para acessá-los rapidamente
              </p>
              <Link href="/outdoors">
                <Button>Ver Outdoors Disponíveis</Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteOutdoors.map((outdoor: any) => (
                <Card key={outdoor.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video bg-muted">
                    {outdoor.photoUrl ? (
                      <img
                        src={outdoor.photoUrl}
                        alt={`Outdoor ${outdoor.code}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Remove Favorite Button */}
                    <button
                      onClick={() => removeFavorite.mutate({ outdoorId: outdoor.id })}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors"
                      disabled={removeFavorite.isPending}
                    >
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </button>

                    {/* Lighting Badge */}
                    {outdoor.hasLighting && (
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-yellow-500 text-white text-xs font-medium flex items-center gap-1">
                        <Lightbulb className="h-3 w-3" />
                        Iluminado
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-lg text-foreground">{outdoor.code}</h3>
                      <span className="text-sm font-semibold text-primary whitespace-nowrap">
                        {formatPrice(outdoor.pricePerBiweek)}/bi-semana
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {outdoor.neighborhood ? `${outdoor.neighborhood}, ` : ""}{outdoor.city}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button 
                      onClick={() => setLocation(`/reservar/${outdoor.id}`)} 
                      className="w-full"
                    >
                      Reservar
                    </Button>
                  </CardFooter>
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
