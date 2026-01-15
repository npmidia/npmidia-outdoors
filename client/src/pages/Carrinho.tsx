import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Trash2, ArrowLeft, MapPin, Check, ShoppingBag, MessageCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function Carrinho() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  const { data: cartItems, isLoading } = trpc.cart.list.useQuery();
  const { data: outdoors } = trpc.outdoor.list.useQuery({ activeOnly: false });
  const { data: allBiweeks } = trpc.biweek.getByYear.useQuery({ year: new Date().getFullYear() });

  const utils = trpc.useUtils();

  const removeFromCart = trpc.cart.remove.useMutation({
    onSuccess: () => {
      toast.success("Item removido do carrinho");
      utils.cart.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover item");
    },
  });

  const checkout = trpc.cart.checkout.useMutation({
    onSuccess: () => {
      toast.success("Pedido realizado com sucesso! Aguarde a aprovação.");
      utils.cart.list.invalidate();
      setLocation("/minhas-reservas");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao finalizar pedido");
    },
  });

  const cartItemsWithDetails = useMemo(() => {
    if (!cartItems || !outdoors || !allBiweeks) return [];

    return cartItems.map(item => {
      const outdoor = outdoors.find(o => o.id === item.outdoorId);
      const biweekIds = JSON.parse(item.biweekIds) as number[];
      const biweeks = biweekIds
        .map(id => allBiweeks.find(b => b.id === id))
        .filter(Boolean);

      const pricePerBiweek = outdoor ? parseFloat(outdoor.pricePerBiweek) : 0;
      let subtotal = pricePerBiweek * biweekIds.length;
      if (item.includePaperGlue) subtotal += 350;
      if (item.includeCanvasInstall) subtotal += 1500;

      return {
        ...item,
        outdoor,
        biweeks,
        pricePerBiweek,
        subtotal,
      };
    });
  }, [cartItems, outdoors, allBiweeks]);

  const totalValue = useMemo(() => {
    return cartItemsWithDetails.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cartItemsWithDetails]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
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
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2].map(i => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-64 rounded-xl" />
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
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          {/* Back Link */}
          <Link href="/outdoors" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Continuar Comprando
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" />
            Carrinho de Compras
          </h1>

          {cartItemsWithDetails.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Seu carrinho está vazio
              </h2>
              <p className="text-muted-foreground mb-6">
                Adicione outdoors ao carrinho para fazer sua reserva
              </p>
              <Link href="/outdoors">
                <Button>Ver Outdoors Disponíveis</Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItemsWithDetails.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      {/* Outdoor Photo */}
                      <div className="sm:w-48 aspect-video sm:aspect-square bg-muted flex-shrink-0">
                        {item.outdoor?.photoUrl ? (
                          <img
                            src={item.outdoor.photoUrl}
                            alt={item.outdoor.code}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <CardContent className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{item.outdoor?.code || "Outdoor"}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.outdoor?.neighborhood && `${item.outdoor.neighborhood}, `}
                              {item.outdoor?.city}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFromCart.mutate({ id: item.id })}
                            disabled={removeFromCart.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Biweeks */}
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1">Bi-semanas:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.biweeks.map((biweek: any) => (
                              <span key={biweek.id} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                                {String(biweek.biweekNumber).padStart(2, '0')}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Services */}
                        {(item.includePaperGlue || item.includeCanvasInstall) && (
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-1">Serviços:</p>
                            <div className="flex flex-wrap gap-2 text-sm">
                              {item.includePaperGlue && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Check className="h-3 w-3 text-green-500" />
                                  Papel e Colagem (+R$ 350)
                                </span>
                              )}
                              {item.includeCanvasInstall && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Check className="h-3 w-3 text-green-500" />
                                  Lona e Instalação (+R$ 1.500)
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Subtotal */}
                        <div className="flex justify-between items-center pt-3 border-t border-border">
                          <span className="text-sm text-muted-foreground">
                            {item.biweeks.length} bi-semana{item.biweeks.length !== 1 ? 's' : ''} × {formatPrice(item.pricePerBiweek)}
                          </span>
                          <span className="font-bold text-primary">{formatPrice(item.subtotal)}</span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-24 h-fit">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items Summary */}
                    <div className="space-y-2">
                      {cartItemsWithDetails.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground truncate max-w-[60%]">
                            {item.outdoor?.code} ({item.biweeks.length} bi-sem.)
                          </span>
                          <span>{formatPrice(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between font-bold text-lg pt-4 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(totalValue)}</span>
                    </div>

                    {/* Checkout Button */}
                    <Button
                      onClick={() => checkout.mutate()}
                      disabled={checkout.isPending}
                      className="w-full"
                      size="lg"
                    >
                      {checkout.isPending ? "Processando..." : "Confirmar Pedido"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Ao confirmar, seu pedido será enviado para aprovação. 
                      Você receberá uma notificação quando for aprovado.
                    </p>
                  </CardContent>
                </Card>

                {/* WhatsApp CTA */}
                <Card className="mt-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-green-800">Garanta seu espaço</h3>
                        <p className="text-sm text-green-700">Chame no WhatsApp para aprovar a reserva e concluir o pagamento do seu outdoor.</p>
                      </div>
                    </div>
                    <a
                      href="https://wa.me/551730420203?text=Olá!%20Gostaria%20de%20aprovar%20minha%20reserva%20de%20outdoor."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Chamar no WhatsApp
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
