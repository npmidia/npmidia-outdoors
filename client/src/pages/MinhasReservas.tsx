import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ShoppingCart, 
  Heart, 
  MessageCircle,
  Upload,
  FileImage,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Info,
  Palette,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function MinhasReservas() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [expandedReservation, setExpandedReservation] = useState<number | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  const { data: reservations, isLoading, refetch } = trpc.reservation.myReservations.useQuery();
  const { data: outdoors } = trpc.outdoor.list.useQuery({ activeOnly: false });
  const { data: allBiweeks } = trpc.biweek.getByYear.useQuery({ year: new Date().getFullYear() });

  const uploadArt = trpc.reservationArt.upload.useMutation({
    onSuccess: () => {
      toast.success("Arte enviada com sucesso!");
      setIsUploading(false);
      setShowUploadDialog(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao enviar arte");
      setIsUploading(false);
    },
  });

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

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
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

  const getArtStatusText = (status: string | null) => {
    switch (status) {
      case "waiting":
        return "Aguardando envio";
      case "received":
        return "Recebida - em análise";
      case "approved":
        return "Aprovada";
      case "in_production":
        return "Em produção";
      default:
        return "Aguardando envio";
    }
  };

  const getArtStatusColor = (status: string | null) => {
    switch (status) {
      case "waiting":
        return "text-gray-600";
      case "received":
        return "text-blue-600";
      case "approved":
        return "text-green-600";
      case "in_production":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedReservationId) return;

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 50MB.");
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        await uploadArt.mutateAsync({
          reservationId: selectedReservationId,
          base64,
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openUploadDialog = (reservationId: number) => {
    setSelectedReservationId(reservationId);
    setShowUploadDialog(true);
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

          {/* WhatsApp CTA */}
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-lg text-green-800">Garanta seu espaço</h3>
                  <p className="text-green-700">Chame no WhatsApp para aprovar a reserva e concluir o pagamento do seu outdoor.</p>
                </div>
                <a
                  href="https://wa.me/551730420203?text=Olá!%20Gostaria%20de%20aprovar%20minha%20reserva%20de%20outdoor."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  <Button className="bg-green-500 hover:bg-green-600 text-white gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Chamar no WhatsApp
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

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
                <Collapsible
                  key={reservation.id}
                  open={expandedReservation === reservation.id}
                  onOpenChange={(open) => setExpandedReservation(open ? reservation.id : null)}
                >
                  <Card className="overflow-hidden">
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
                          <div className="flex items-center gap-2">
                            {getStatusBadge(reservation.status)}
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {expandedReservation === reservation.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Data do pedido:</p>
                            <p className="font-medium">{formatDate(reservation.createdAt)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Valor total:</p>
                            <p className="font-bold text-primary">{formatPrice(reservation.totalValue)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Arte:</p>
                            <p className={`font-medium ${getArtStatusColor((reservation as any).artStatus)}`}>
                              {getArtStatusText((reservation as any).artStatus)}
                            </p>
                          </div>
                        </div>

                        {/* Services */}
                        {(reservation.includePaperGlue || reservation.includeCanvasInstall) && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-sm text-muted-foreground mb-1">Serviços inclusos:</p>
                            <div className="flex flex-wrap gap-2">
                              {reservation.includePaperGlue && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Palette className="h-3 w-3" />
                                  Papel e Colagem
                                </Badge>
                              )}
                              {reservation.includeCanvasInstall && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Wrench className="h-3 w-3" />
                                  Lona e Instalação
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </div>

                    {/* Expanded Content */}
                    <CollapsibleContent>
                      <div className="border-t border-border p-4 bg-muted/30">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Arte Section */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <FileImage className="h-4 w-4" />
                              Arte para Impressão
                            </h4>
                            
                            {(reservation.status === "approved" || reservation.status === "pending") && (
                              <div className="space-y-3">
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => openUploadDialog(reservation.id)}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Enviar Arte
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                  Formatos aceitos: JPG, PNG, PDF, AI, CDR, PSD (máx. 50MB)
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Notes Section */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Info className="h-4 w-4" />
                              Observações
                            </h4>
                            {(reservation as any).clientNotes ? (
                              <p className="text-sm bg-white p-3 rounded-lg border">
                                {(reservation as any).clientNotes}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Nenhuma observação no momento.
                              </p>
                            )}
                            
                            {(reservation as any).scheduledInstallDate && (
                              <div className="mt-3">
                                <p className="text-sm text-muted-foreground">Data de instalação prevista:</p>
                                <p className="font-medium">{formatDate((reservation as any).scheduledInstallDate)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
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

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Arte</DialogTitle>
            <DialogDescription>
              Envie o arquivo da arte para impressão do seu outdoor.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.ai,.cdr,.psd,.eps"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Enviando...</p>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="font-medium">Clique para selecionar um arquivo</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG, PDF, AI, CDR, PSD (máx. 50MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
