import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  ShoppingCart,
  MessageSquare,
  Eye,
  AlertCircle,
} from "lucide-react";
import { useParams, useLocation } from "wouter";

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const userId = parseInt(id || "0");
  
  const { data: clientData, isLoading } = trpc.admin.getClientDetails.useQuery(
    { userId },
    { enabled: userId > 0 }
  );
  
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
  
  const getArtStatusBadge = (status: string | null) => {
    switch (status) {
      case "waiting":
        return <Badge variant="outline" className="bg-gray-50 text-xs">Aguardando</Badge>;
      case "received":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">Recebida</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">Aprovada</Badge>;
      case "in_production":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">Em Produção</Badge>;
      default:
        return null;
    }
  };
  
  const openWhatsApp = () => {
    if (clientData?.user.phone) {
      const phone = clientData.user.phone.replace(/\D/g, '');
      const message = encodeURIComponent(`Olá ${clientData.user.name || ''}! Aqui é da NPMIDIA...`);
      window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout title="Detalhes do Cliente" subtitle="Carregando...">
        <div className="text-center py-12">Carregando...</div>
      </AdminLayout>
    );
  }
  
  if (!clientData) {
    return (
      <AdminLayout title="Detalhes do Cliente" subtitle="Cliente não encontrado">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Cliente não encontrado</p>
          <Button onClick={() => navigate("/admin/usuarios")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Usuários
          </Button>
        </div>
      </AdminLayout>
    );
  }
  
  const { user, reservations, stats } = clientData;
  
  // Filter reservations by status
  const activeReservations = reservations.filter(r => r.status === "approved");
  const pendingReservations = reservations.filter(r => r.status === "pending");
  
  const ReservationTable = ({ items }: { items: typeof reservations }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nº Venda</TableHead>
          <TableHead>Outdoor</TableHead>
          <TableHead>Cidade</TableHead>
          <TableHead>Serviços</TableHead>
          <TableHead>Arte</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
              Nenhuma reserva encontrada
            </TableCell>
          </TableRow>
        ) : (
          items.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-mono text-sm">#{reservation.id}</TableCell>
              <TableCell className="font-mono text-sm">
                {reservation.saleNumber || "-"}
              </TableCell>
              <TableCell className="font-medium">{reservation.outdoorCode || "-"}</TableCell>
              <TableCell>{reservation.outdoorCity || "-"}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {reservation.includePaperGlue && (
                    <Badge variant="secondary" className="text-xs">P/C</Badge>
                  )}
                  {reservation.includeCanvasInstall && (
                    <Badge variant="secondary" className="text-xs">L/I</Badge>
                  )}
                  {!reservation.includePaperGlue && !reservation.includeCanvasInstall && (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {getArtStatusBadge(reservation.artStatus)}
              </TableCell>
              <TableCell className="font-semibold text-primary">
                {formatPrice(reservation.totalValue)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(reservation.createdAt)}
              </TableCell>
              <TableCell>{getStatusBadge(reservation.status)}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/admin/reservas/${reservation.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
  
  return (
    <AdminLayout 
      title={user.name || "Cliente"} 
      subtitle="Histórico completo do cliente"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate("/admin/usuarios")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        {user.phone && (
          <Button variant="outline" onClick={openWhatsApp}>
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        )}
      </div>
      
      {/* Client Info & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Client Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs">Nome</p>
              <p className="font-medium">{user.name || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Empresa</p>
              <p className="font-medium flex items-center gap-1">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {user.company || "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">E-mail</p>
              <p className="font-medium flex items-center gap-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {user.email || "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Telefone</p>
              <p className="font-medium flex items-center gap-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {user.phone || "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Cadastrado em</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(user.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Último acesso</p>
              <p className="font-medium">{formatDateTime(user.lastSignedIn)}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Reservas</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              {stats.totalReservations}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <span className="text-green-600">{stats.approvedReservations} aprovadas</span>
              {stats.pendingReservations > 0 && (
                <span className="text-yellow-600 ml-2">{stats.pendingReservations} pendentes</span>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Gasto</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              {formatPrice(stats.totalSpent)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Em reservas aprovadas
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Reservations Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                Todas ({reservations.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Ativas ({activeReservations.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pendentes ({pendingReservations.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <ReservationTable items={reservations} />
            </TabsContent>
            
            <TabsContent value="active">
              <ReservationTable items={activeReservations} />
            </TabsContent>
            
            <TabsContent value="pending">
              <ReservationTable items={pendingReservations} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
