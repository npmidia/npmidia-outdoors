import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  MapPin, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileImage,
  Upload,
  Trash2,
  Download,
  ExternalLink,
  MessageSquare,
  Palette,
  Wrench,
} from "lucide-react";
import { useState, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { toast } from "sonner";

export default function ReservationDetails() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const reservationId = parseInt(id || "0");
  
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [saleNumber, setSaleNumber] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: reservation, isLoading, refetch } = trpc.admin.getReservationDetails.useQuery(
    { id: reservationId },
    { enabled: reservationId > 0 }
  );
  
  const utils = trpc.useUtils();
  
  const updateProduction = trpc.admin.updateReservationProduction.useMutation({
    onSuccess: () => {
      toast.success("Informações atualizadas!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar");
    },
  });
  
  const approveWithSale = trpc.admin.approveWithSaleNumber.useMutation({
    onSuccess: () => {
      toast.success("Reserva aprovada com sucesso!");
      setShowApproveDialog(false);
      setSaleNumber("");
      refetch();
      utils.reservation.listAll.invalidate();
      utils.admin.stats.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao aprovar");
    },
  });
  
  const updateStatus = trpc.reservation.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado!");
      refetch();
      utils.reservation.listAll.invalidate();
      utils.admin.stats.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar status");
    },
  });
  
  const uploadArt = trpc.reservationArt.upload.useMutation({
    onSuccess: () => {
      toast.success("Arte enviada com sucesso!");
      setIsUploading(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao enviar arte");
      setIsUploading(false);
    },
  });
  
  const deleteArt = trpc.reservationArt.delete.useMutation({
    onSuccess: () => {
      toast.success("Arte removida!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover arte");
    },
  });
  
  const formatPrice = (price: string | number | null) => {
    if (!price) return "R$ 0,00";
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
  
  const formatDateTime = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getArtStatusBadge = (status: string | null) => {
    switch (status) {
      case "waiting":
        return <Badge variant="outline" className="bg-gray-50">Aguardando</Badge>;
      case "received":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Recebida</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Aprovada</Badge>;
      case "in_production":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Em Produção</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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
          reservationId,
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
  
  const handleApprove = () => {
    if (!saleNumber.trim()) {
      toast.error("Número da venda é obrigatório");
      return;
    }
    approveWithSale.mutate({ id: reservationId, saleNumber: saleNumber.trim() });
  };
  
  const openWhatsApp = () => {
    if (reservation?.userPhone) {
      const phone = reservation.userPhone.replace(/\D/g, '');
      const message = encodeURIComponent(`Olá ${reservation.userName || ''}! Sobre sua reserva #${reservationId} na NPMIDIA...`);
      window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout title="Detalhes da Reserva" subtitle="Carregando...">
        <div className="text-center py-12">Carregando...</div>
      </AdminLayout>
    );
  }
  
  if (!reservation) {
    return (
      <AdminLayout title="Detalhes da Reserva" subtitle="Reserva não encontrada">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Reserva não encontrada</p>
          <Button onClick={() => navigate("/admin/reservas")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Reservas
          </Button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout 
      title={`Reserva #${reservationId}`} 
      subtitle="Detalhes completos da reserva"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate("/admin/reservas")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          {getStatusBadge(reservation.status)}
          {reservation.userPhone && (
            <Button variant="outline" size="sm" onClick={openWhatsApp}>
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">Nome</Label>
                <p className="font-medium">{reservation.userName || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Empresa</Label>
                <p className="font-medium flex items-center gap-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {reservation.userCompany || "-"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">E-mail</Label>
                <p className="font-medium flex items-center gap-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {reservation.userEmail || "-"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Telefone</Label>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {reservation.userPhone || "-"}
                </p>
              </div>
              <div className="col-span-2">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary"
                  onClick={() => navigate(`/admin/clientes/${reservation.userId}`)}
                >
                  Ver histórico completo do cliente →
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Purchase Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Detalhes da Compra
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Outdoor Info */}
              <div className="flex gap-4">
                {reservation.outdoorPhotoUrl && (
                  <img 
                    src={reservation.outdoorPhotoUrl} 
                    alt="Outdoor" 
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-lg">{reservation.outdoorCode}</p>
                  <p className="text-muted-foreground text-sm">
                    {reservation.outdoorStreet}{reservation.outdoorNumber ? `, ${reservation.outdoorNumber}` : ''}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {reservation.outdoorNeighborhood}, {reservation.outdoorCity} - {reservation.outdoorState}
                  </p>
                  <p className="text-sm mt-1">
                    Tamanho: {reservation.outdoorWidth}m x {reservation.outdoorHeight}m
                  </p>
                </div>
              </div>
              
              <Separator />
              
              {/* Biweeks */}
              <div>
                <Label className="text-muted-foreground text-xs">Bi-semanas Reservadas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {reservation.biweeks?.map((bw) => (
                    <Badge key={bw.biweekId} variant="secondary">
                      {bw.biweekNumber?.toString().padStart(2, '0')} ({formatDate(bw.startDate)} - {formatDate(bw.endDate)})
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Services */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Serviços Adicionais</Label>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      <span>Papel e Colagem:</span>
                      <Badge variant={reservation.includePaperGlue ? "default" : "outline"}>
                        {reservation.includePaperGlue ? "Sim (+R$ 350)" : "Não"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      <span>Lona e Instalação:</span>
                      <Badge variant={reservation.includeCanvasInstall ? "default" : "outline"}>
                        {reservation.includeCanvasInstall ? "Sim (+R$ 1.500)" : "Não"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Valor Total</Label>
                  <p className="text-2xl font-bold text-primary">{formatPrice(reservation.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Arts Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Arte para Impressão
                </CardTitle>
                <CardDescription>
                  Status: {getArtStatusBadge(reservation.artStatus)}
                </CardDescription>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.ai,.cdr,.psd,.eps"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Enviando..." : "Enviar Arte"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {reservation.arts && reservation.arts.length > 0 ? (
                <div className="space-y-3">
                  {reservation.arts.map((art) => (
                    <div 
                      key={art.id} 
                      className={`flex items-center justify-between p-3 rounded-lg border ${art.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <FileImage className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{art.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            Versão {art.version} • {art.uploadedByRole === 'admin' ? 'Admin' : 'Cliente'} • {formatDateTime(art.createdAt)}
                          </p>
                          {art.isActive && (
                            <Badge variant="outline" className="mt-1 bg-green-100 text-green-700">
                              Versão Ativa
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(art.fileUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = art.fileUrl;
                            link.download = art.fileName;
                            link.click();
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            if (confirm("Remover esta arte?")) {
                              deleteArt.mutate({ id: art.id });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileImage className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma arte enviada ainda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Management */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reservation.status === "pending" && (
                <>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => setShowApproveDialog(true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar Reserva
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      if (confirm("Deseja negar esta reserva?")) {
                        updateStatus.mutate({ id: reservationId, status: "denied" });
                      }
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Negar Reserva
                  </Button>
                </>
              )}
              {reservation.status !== "pending" && (
                <Select
                  value={reservation.status}
                  onValueChange={(value) => updateStatus.mutate({ id: reservationId, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alterar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="denied">Negado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>
          
          {/* Production Management */}
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Produção</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="saleNumber">Nº da Venda (Conta Azul)</Label>
                <Input
                  id="saleNumber"
                  value={reservation.saleNumber || ""}
                  onChange={(e) => {
                    updateProduction.mutate({ id: reservationId, saleNumber: e.target.value || null });
                  }}
                  placeholder="Ex: 12345"
                />
              </div>
              
              <div>
                <Label htmlFor="artStatus">Status da Arte</Label>
                <Select
                  value={reservation.artStatus || "waiting"}
                  onValueChange={(value) => updateProduction.mutate({ id: reservationId, artStatus: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waiting">Aguardando</SelectItem>
                    <SelectItem value="received">Recebida</SelectItem>
                    <SelectItem value="approved">Aprovada</SelectItem>
                    <SelectItem value="in_production">Em Produção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="scheduledInstallDate">Data de Instalação Prevista</Label>
                <Input
                  id="scheduledInstallDate"
                  type="date"
                  value={reservation.scheduledInstallDate ? new Date(reservation.scheduledInstallDate).toISOString().split('T')[0] : ""}
                  onChange={(e) => {
                    updateProduction.mutate({ id: reservationId, scheduledInstallDate: e.target.value || null });
                  }}
                />
              </div>
              
              <div>
                <Label htmlFor="adminNotes">Observações Internas</Label>
                <Textarea
                  id="adminNotes"
                  value={reservation.adminNotes || ""}
                  onChange={(e) => {
                    updateProduction.mutate({ id: reservationId, adminNotes: e.target.value || null });
                  }}
                  placeholder="Notas internas sobre a negociação..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="clientNotes">Observações para o Cliente</Label>
                <Textarea
                  id="clientNotes"
                  value={reservation.clientNotes || ""}
                  onChange={(e) => {
                    updateProduction.mutate({ id: reservationId, clientNotes: e.target.value || null });
                  }}
                  placeholder="Mensagem visível para o cliente..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Histórico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Criada em:</span>
                <span>{formatDateTime(reservation.createdAt)}</span>
              </div>
              {reservation.approvedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aprovada em:</span>
                  <span>{formatDateTime(reservation.approvedAt)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Atualizada em:</span>
                <span>{formatDateTime(reservation.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Reserva</DialogTitle>
            <DialogDescription>
              Para aprovar a reserva, informe o número da venda do Conta Azul.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="approvalSaleNumber">Número da Venda (Conta Azul) *</Label>
            <Input
              id="approvalSaleNumber"
              value={saleNumber}
              onChange={(e) => setSaleNumber(e.target.value)}
              placeholder="Ex: 12345"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={!saleNumber.trim() || approveWithSale.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {approveWithSale.isPending ? "Aprovando..." : "Aprovar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
