import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

import { trpc } from "@/lib/trpc";
import { MapPin, Lightbulb, Search, ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";

export default function Outdoors() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLighting, setFilterLighting] = useState<boolean | null>(null);

  const { data: outdoors, isLoading } = trpc.outdoor.list.useQuery({ activeOnly: true });
  const { data: favorites } = trpc.favorite.list.useQuery(undefined, { enabled: isAuthenticated });
  
  const favoriteIds = useMemo(() => {
    return new Set(favorites?.map(f => f.outdoorId) || []);
  }, [favorites]);

  const filteredOutdoors = useMemo(() => {
    if (!outdoors) return [];
    
    return outdoors.filter(outdoor => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesCode = outdoor.code.toLowerCase().includes(query);
        const matchesCity = outdoor.city?.toLowerCase().includes(query);
        const matchesNeighborhood = outdoor.neighborhood?.toLowerCase().includes(query);
        if (!matchesCode && !matchesCity && !matchesNeighborhood) return false;
      }
      
      // Lighting filter
      if (filterLighting !== null && outdoor.hasLighting !== filterLighting) {
        return false;
      }
      
      return true;
    });
  }, [outdoors, searchQuery, filterLighting]);

  const handleReserve = (outdoorId: number) => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    setLocation(`/reservar/${outdoorId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-npmidia.png" alt="NPMIDIA" className="h-10" />
          </Link>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/minhas-reservas">
                  <Button variant="ghost">Minhas Reservas</Button>
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
              </>
            ) : (
              <Link href="/login">
                <Button variant="default">Entrar</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Outdoors Disponíveis</h1>
            <p className="text-muted-foreground mt-2">
              Encontre o outdoor ideal para sua campanha publicitária
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-border p-4 mb-8">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="search" className="mb-2 block">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Código, cidade ou bairro..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="lighting-yes"
                    checked={filterLighting === true}
                    onCheckedChange={(checked) => setFilterLighting(checked ? true : null)}
                  />
                  <Label htmlFor="lighting-yes" className="cursor-pointer">Com iluminação</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="lighting-no"
                    checked={filterLighting === false}
                    onCheckedChange={(checked) => setFilterLighting(checked ? false : null)}
                  />
                  <Label htmlFor="lighting-no" className="cursor-pointer">Sem iluminação</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-muted-foreground">
            {isLoading ? (
              "Carregando..."
            ) : (
              `${filteredOutdoors.length} outdoor${filteredOutdoors.length !== 1 ? 's' : ''} encontrado${filteredOutdoors.length !== 1 ? 's' : ''}`
            )}
          </div>

          {/* Outdoors Grid */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredOutdoors.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum outdoor encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros de busca
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredOutdoors.map((outdoor) => (
                <OutdoorCard
                  key={outdoor.id}
                  outdoor={outdoor}
                  isFavorite={favoriteIds.has(outdoor.id)}
                  isAuthenticated={isAuthenticated}
                  onReserve={() => handleReserve(outdoor.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-6">
        <div className="container text-center">
          <p className="text-sm text-background/70">
            © {new Date().getFullYear()} NPMIDIA. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface OutdoorCardProps {
  outdoor: {
    id: number;
    code: string;
    city: string;
    neighborhood: string | null;
    hasLighting: boolean;
    photoUrl: string | null;
    pricePerBiweek: string;
    width: string | null;
    height: string | null;
  };
  isFavorite: boolean;
  isAuthenticated: boolean;
  onReserve: () => void;
}

function OutdoorCard({ outdoor, isFavorite, isAuthenticated, onReserve }: OutdoorCardProps) {
  const utils = trpc.useUtils();
  const addFavorite = trpc.favorite.add.useMutation({
    onSuccess: () => utils.favorite.list.invalidate(),
  });
  const removeFavorite = trpc.favorite.remove.useMutation({
    onSuccess: () => utils.favorite.list.invalidate(),
  });

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (isFavorite) {
      removeFavorite.mutate({ outdoorId: outdoor.id });
    } else {
      addFavorite.mutate({ outdoorId: outdoor.id });
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(price));
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
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
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
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

        {outdoor.width && outdoor.height && (
          <p className="text-xs text-muted-foreground">
            Tamanho: {outdoor.width}m x {outdoor.height}m
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={onReserve} className="w-full">
          Reservar
        </Button>
      </CardFooter>
    </Card>
  );
}
