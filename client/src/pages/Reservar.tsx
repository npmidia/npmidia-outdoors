import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { MapPin, Lightbulb, ArrowLeft, ShoppingCart, Check, Calendar } from "lucide-react";
import { BiweekHelpModal } from "@/components/BiweekHelpModal";
import { useState, useMemo, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { toast } from "sonner";

type BiweekStatus = "available" | "pending" | "blocked";

interface BiweekWithStatus {
  id: number;
  year: number;
  biweekNumber: number;
  startDate: Date;
  endDate: Date;
  reservationStatus: BiweekStatus;
}

export default function Reservar() {
  const { id } = useParams<{ id: string }>();
  const outdoorId = parseInt(id || "0");
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [selectedBiweeks, setSelectedBiweeks] = useState<number[]>([]);
  const [includePaperGlue, setIncludePaperGlue] = useState(false);
  const [includeCanvasInstall, setIncludeCanvasInstall] = useState(false);
  const currentYear = new Date().getFullYear();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  const { data: outdoor, isLoading: outdoorLoading } = trpc.outdoor.getById.useQuery(
    { id: outdoorId },
    { enabled: outdoorId > 0 }
  );

  const { data: biweeks, isLoading: biweeksLoading } = trpc.biweek.getStatusForOutdoor.useQuery(
    { outdoorId, year: currentYear },
    { enabled: outdoorId > 0 }
  );

  const utils = trpc.useUtils();
  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => {
      toast.success("Adicionado ao carrinho!");
      utils.cart.list.invalidate();
      setLocation("/carrinho");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao adicionar ao carrinho");
    },
  });

  // Generate biweeks if not available
  const generateBiweeks = trpc.biweek.generate.useMutation({
    onSuccess: () => {
      utils.biweek.getStatusForOutdoor.invalidate();
    },
  });

  useEffect(() => {
    if (biweeks && biweeks.length === 0 && user?.role === "admin") {
      generateBiweeks.mutate({ year: currentYear });
    }
  }, [biweeks, user?.role, currentYear]);

  const pricePerBiweek = outdoor ? parseFloat(outdoor.pricePerBiweek) : 0;

  const totalValue = useMemo(() => {
    let total = pricePerBiweek * selectedBiweeks.length;
    if (includePaperGlue) total += 350;
    if (includeCanvasInstall) total += 1500;
    return total;
  }, [pricePerBiweek, selectedBiweeks.length, includePaperGlue, includeCanvasInstall]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const handleBiweekToggle = (biweekId: number, status: BiweekStatus) => {
    if (status !== "available") return;
    
    setSelectedBiweeks(prev => {
      if (prev.includes(biweekId)) {
        return prev.filter(id => id !== biweekId);
      }
      return [...prev, biweekId];
    });
  };

  const handleAddToCart = () => {
    if (selectedBiweeks.length === 0) {
      toast.error("Selecione pelo menos uma bi-semana");
      return;
    }

    addToCart.mutate({
      outdoorId,
      biweekIds: selectedBiweeks,
      includePaperGlue,
      includeCanvasInstall,
    });
  };

  const getBiweekStatusColor = (status: BiweekStatus) => {
    switch (status) {
      case "available":
        return "bg-green-500 hover:bg-green-600 text-white cursor-pointer";
      case "pending":
        return "bg-yellow-500 text-white cursor-not-allowed";
      case "blocked":
        return "bg-red-500 text-white cursor-not-allowed";
      default:
        return "bg-gray-400 text-white cursor-not-allowed";
    }
  };

  const getBiweekStatusLabel = (status: BiweekStatus) => {
    switch (status) {
      case "available":
        return "Liberada";
      case "pending":
        return "Pendente";
      case "blocked":
        return "Bloqueada";
      default:
        return "Indisponível";
    }
  };

  // Check if biweek is before outdoor activation date
  const isBiweekBeforeActivation = (biweek: BiweekWithStatus) => {
    if (!outdoor?.activationDate) return false;
    const activationDate = new Date(outdoor.activationDate);
    const biweekStart = new Date(biweek.startDate);
    return biweekStart < activationDate;
  };

  if (authLoading || outdoorLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b border-border">
          <div className="container flex items-center h-16">
            <Skeleton className="h-10 w-32" />
          </div>
        </header>
        <main className="container py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-video rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  if (!outdoor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Outdoor não encontrado</h2>
          <Link href="/outdoors">
            <Button>Voltar para Galeria</Button>
          </Link>
        </div>
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
            <Link href="/carrinho">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Outdoor Info & Biweeks */}
            <div className="lg:col-span-2 space-y-6">
              {/* Outdoor Photo & Info */}
              <Card>
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Photo */}
                  <div className="aspect-video md:aspect-square bg-muted relative">
                    {outdoor.photoUrl ? (
                      <img
                        src={outdoor.photoUrl}
                        alt={`Outdoor ${outdoor.code}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    {outdoor.hasLighting && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-yellow-500 text-white text-sm font-medium flex items-center gap-1">
                        <Lightbulb className="h-4 w-4" />
                        Iluminado
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <CardContent className="p-6 flex flex-col justify-center">
                    <h1 className="text-2xl font-bold text-foreground mb-2">{outdoor.code}</h1>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-foreground">
                            {outdoor.street && `${outdoor.street}, ${outdoor.number || 's/n'}`}
                          </p>
                          <p className="text-muted-foreground">
                            {outdoor.neighborhood && `${outdoor.neighborhood}, `}{outdoor.city}
                            {outdoor.state && ` - ${outdoor.state}`}
                          </p>
                        </div>
                      </div>

                      {outdoor.width && outdoor.height && (
                        <p className="text-muted-foreground">
                          <strong>Tamanho:</strong> {outdoor.width}m x {outdoor.height}m
                        </p>
                      )}

                      <div className="pt-2 border-t border-border">
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(pricePerBiweek)} <span className="text-sm font-normal text-muted-foreground">/ bi-semana</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Map */}
              {outdoor.latitude && outdoor.longitude && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Localização
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${outdoor.latitude},${outdoor.longitude}&zoom=15`}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Biweeks Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Bi-semanas {currentYear}
                    <BiweekHelpModal year={currentYear} />
                  </CardTitle>
                  <div className="flex flex-wrap gap-4 text-sm mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500" />
                      <span>Liberada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-500" />
                      <span>Pendente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-500" />
                      <span>Bloqueada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gray-400" />
                      <span>Fora de validade</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {biweeksLoading ? (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                      {[...Array(26)].map((_, i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : biweeks && biweeks.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                      {(biweeks as BiweekWithStatus[]).map((biweek) => {
                        const isBeforeActivation = isBiweekBeforeActivation(biweek);
                        const effectiveStatus = isBeforeActivation ? "blocked" : biweek.reservationStatus;
                        const isSelected = selectedBiweeks.includes(biweek.id);

                        return (
                          <button
                            key={biweek.id}
                            onClick={() => handleBiweekToggle(biweek.id, effectiveStatus)}
                            disabled={effectiveStatus !== "available"}
                            className={`
                              p-2 rounded-lg text-center transition-all
                              ${isBeforeActivation ? "bg-gray-400 text-white cursor-not-allowed" : getBiweekStatusColor(effectiveStatus)}
                              ${isSelected ? "ring-2 ring-offset-2 ring-primary" : ""}
                            `}
                          >
                            <div className="font-bold text-sm">{String(biweek.biweekNumber).padStart(2, '0')}</div>
                            <div className="text-xs opacity-80">
                              {formatDate(biweek.startDate)}
                            </div>
                            {isSelected && (
                              <Check className="h-3 w-3 mx-auto mt-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma bi-semana disponível para {currentYear}</p>
                      {user?.role === "admin" && (
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => generateBiweeks.mutate({ year: currentYear })}
                          disabled={generateBiweeks.isPending}
                        >
                          Gerar Bi-semanas
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo da Reserva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Selected Biweeks */}
                  <div>
                    <Label className="text-sm font-medium">Bi-semanas selecionadas</Label>
                    {selectedBiweeks.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {selectedBiweeks.map(id => {
                          const biweek = biweeks?.find(b => b.id === id);
                          return biweek ? (
                            <span key={id} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                              {String(biweek.biweekNumber).padStart(2, '0')}
                            </span>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">
                        Nenhuma bi-semana selecionada
                      </p>
                    )}
                  </div>

                  {/* Services */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Serviços Adicionais</Label>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                      <Checkbox
                        id="paper-glue"
                        checked={includePaperGlue}
                        onCheckedChange={(checked) => setIncludePaperGlue(!!checked)}
                      />
                      <div className="flex-1">
                        <Label htmlFor="paper-glue" className="cursor-pointer font-medium">
                          Papel e Colagem
                        </Label>
                        <p className="text-sm text-muted-foreground">+ R$ 350,00</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                      <Checkbox
                        id="canvas-install"
                        checked={includeCanvasInstall}
                        onCheckedChange={(checked) => setIncludeCanvasInstall(!!checked)}
                      />
                      <div className="flex-1">
                        <Label htmlFor="canvas-install" className="cursor-pointer font-medium">
                          Lona e Instalação
                        </Label>
                        <p className="text-sm text-muted-foreground">+ R$ 1.500,00</p>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {selectedBiweeks.length} bi-semana{selectedBiweeks.length !== 1 ? 's' : ''} × {formatPrice(pricePerBiweek)}
                      </span>
                      <span>{formatPrice(pricePerBiweek * selectedBiweeks.length)}</span>
                    </div>
                    {includePaperGlue && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Papel e Colagem</span>
                        <span>R$ 350,00</span>
                      </div>
                    )}
                    {includeCanvasInstall && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Lona e Instalação</span>
                        <span>R$ 1.500,00</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(totalValue)}</span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={selectedBiweeks.length === 0 || addToCart.isPending}
                    className="w-full"
                    size="lg"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
