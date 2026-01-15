import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";


import { trpc } from "@/lib/trpc";
import { MapPin, Lightbulb, Search, ShoppingCart, Heart, ArrowLeft, Calendar, X } from "lucide-react";
import { BiweekHelpModal } from "@/components/BiweekHelpModal";
import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";

export default function Outdoors() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterWithLighting, setFilterWithLighting] = useState(true);
  const [filterWithoutLighting, setFilterWithoutLighting] = useState(true);
  const [selectedBiweeks, setSelectedBiweeks] = useState<number[]>([]);

  const currentYear = new Date().getFullYear();
  const { data: outdoors, isLoading } = trpc.outdoor.list.useQuery({ activeOnly: true });
  const { data: favorites } = trpc.favorite.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: biweeks } = trpc.biweek.getByYear.useQuery({ year: currentYear });
  const { data: reservations } = trpc.reservation.list.useQuery();
  
  const favoriteIds = useMemo(() => {
    return new Set(favorites?.map(f => f.outdoorId) || []);
  }, [favorites]);

  // Get reserved/pending biweeks per outdoor
  const reservedBiweeksByOutdoor = useMemo(() => {
    if (!reservations) return new Map<number, Set<number>>();
    
    const map = new Map<number, Set<number>>();
    reservations.forEach(reservation => {
      if (reservation.status === 'approved' || reservation.status === 'pending') {
        const biweekIds = JSON.parse(reservation.biweekIds) as number[];
        biweekIds.forEach(biweekId => {
          if (!map.has(reservation.outdoorId)) {
            map.set(reservation.outdoorId, new Set());
          }
          map.get(reservation.outdoorId)!.add(biweekId);
        });
      }
    });
    return map;
  }, [reservations]);

  // Filter biweeks that are in the future
  const availableBiweeks = useMemo(() => {
    if (!biweeks) return [];
    const today = new Date();
    return biweeks.filter(b => new Date(b.endDate) >= today);
  }, [biweeks]);

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
      if (!filterWithLighting && !filterWithoutLighting) {
        return false; // No filter selected, show nothing
      }
      if (!filterWithLighting && outdoor.hasLighting) {
        return false;
      }
      if (!filterWithoutLighting && !outdoor.hasLighting) {
        return false;
      }
      
      // Biweek availability filter - check if outdoor is available for ALL selected biweeks
      if (selectedBiweeks.length > 0) {
        const reservedBiweeksSet = reservedBiweeksByOutdoor.get(outdoor.id);
        for (const biweekId of selectedBiweeks) {
          if (reservedBiweeksSet && reservedBiweeksSet.has(biweekId)) {
            return false; // This outdoor is reserved/pending for one of the selected biweeks
          }
        }
      }
      
      return true;
    });
  }, [outdoors, searchQuery, filterWithLighting, filterWithoutLighting, selectedBiweeks, reservedBiweeksByOutdoor]);

  const handleReserve = (outdoorId: number) => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    setLocation(`/reservar/${outdoorId}`);
  };

  const formatBiweekDate = (dateValue: Date | string) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
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

              {/* Biweek Filter - Visual Grid like Reservar page */}
              <div className="lg:col-span-2">
                <Label className="mb-2 block flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Filtrar por Bi-semana {selectedBiweeks.length > 0 && <span className="text-primary font-semibold">({selectedBiweeks.length} selecionada{selectedBiweeks.length > 1 ? 's' : ''})</span>}
                  <BiweekHelpModal year={currentYear} />
                </Label>
                <div className="flex flex-wrap gap-2 mb-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span>Disponível</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-primary" />
                    <span>Selecionada</span>
                  </div>
                </div>
                <div className="border border-border rounded-lg p-3 bg-background">
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 gap-2">
                    {availableBiweeks.map((biweek) => {
                      const isSelected = selectedBiweeks.includes(biweek.id);
                      return (
                        <button
                          key={biweek.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedBiweeks(selectedBiweeks.filter(id => id !== biweek.id));
                            } else {
                              setSelectedBiweeks([...selectedBiweeks, biweek.id]);
                            }
                          }}
                          className={`
                            p-2 rounded-lg text-center transition-all text-white
                            ${isSelected 
                              ? "bg-primary ring-2 ring-offset-2 ring-primary" 
                              : "bg-green-500 hover:bg-green-600"
                            }
                          `}
                        >
                          <div className="font-bold text-sm">{String(biweek.biweekNumber).padStart(2, '0')}</div>
                          <div className="text-xs opacity-80">
                            {formatBiweekDate(biweek.startDate)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {availableBiweeks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma bi-semana disponível</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Lighting Filter */}
              <div className="lg:col-span-2">
                <Label className="mb-2 block flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Iluminação
                </Label>
                <div className="flex flex-wrap gap-4 mt-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="lighting-with"
                      checked={filterWithLighting}
                      onCheckedChange={(checked) => setFilterWithLighting(checked === true)}
                    />
                    <Label htmlFor="lighting-with" className="cursor-pointer font-normal">
                      Com iluminação
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="lighting-without"
                      checked={filterWithoutLighting}
                      onCheckedChange={(checked) => setFilterWithoutLighting(checked === true)}
                    />
                    <Label htmlFor="lighting-without" className="cursor-pointer font-normal">
                      Sem iluminação
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Clear All Filters Button */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {(searchQuery || selectedBiweeks.length > 0 || !filterWithLighting || !filterWithoutLighting) && (
                  <span>Filtros ativos</span>
                )}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedBiweeks([]);
                  setFilterWithLighting(true);
                  setFilterWithoutLighting(true);
                }}
              >
                <X className="h-4 w-4" />
                Limpar Todos os Filtros
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-muted-foreground">
            {isLoading ? (
              "Carregando..."
            ) : (
              <>
                {filteredOutdoors.length} outdoor{filteredOutdoors.length !== 1 ? 's' : ''} encontrado{filteredOutdoors.length !== 1 ? 's' : ''}
                {selectedBiweeks.length > 0 && (
                  <span className="ml-1 text-primary font-medium">
                    (disponíveis nas bi-semanas selecionadas)
                  </span>
                )}
              </>
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
