import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, User, Eye, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminReservas() {
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState<number | null>(null);

  const { data: reservations, isLoading } = trpc.reservation.listAll.useQuery();
  const { data: outdoors } = trpc.outdoor.list.useQuery({ activeOnly: false });
  const { data: users } = trpc.user.list.useQuery();

  const utils = trpc.useUtils();

  const updateStatus = trpc.reservation.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      utils.reservation.listAll.invalidate();
      utils.admin.stats.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar status");
    },
  });

  const reservationsWithDetails = useMemo(() => {
    if (!reservations || !outdoors || !users) return [];

    return reservations.map(reservation => {
      const outdoor = outdoors.find(o => o.id === reservation.outdoorId);
      const user = users.find(u => u.id === reservation.userId);
      return {
        ...reservation,
        outdoor,
        user,
      };
    });
  }, [reservations, outdoors, users]);

  const filteredReservations = useMemo(() => {
    let filtered = reservationsWithDetails;
    
    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    
    // Filter by client
    if (clientFilter) {
      filtered = filtered.filter(r => r.userId === clientFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.user?.name?.toLowerCase().includes(query) ||
        r.user?.email?.toLowerCase().includes(query) ||
        r.outdoor?.code?.toLowerCase().includes(query) ||
        r.saleNumber?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [reservationsWithDetails, statusFilter, clientFilter, searchQuery]);
  
  // Get unique clients for filter
  const uniqueClients = useMemo(() => {
    const clientMap = new Map();
    reservationsWithDetails.forEach(r => {
      if (r.user && !clientMap.has(r.userId)) {
        clientMap.set(r.userId, r.user);
      }
    });
    return Array.from(clientMap.values());
  }, [reservationsWithDetails]);

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

  const handleStatusChange = (reservationId: number, newStatus: "pending" | "approved" | "denied" | "cancelled") => {
    updateStatus.mutate({ id: reservationId, status: newStatus });
  };

  return (
    <AdminLayout title="Gerenciar Reservas" subtitle="Aprove ou negue as solicitações de reserva">
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle>Reservas ({filteredReservations.length})</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email, outdoor ou nº venda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={clientFilter?.toString() || "all"} onValueChange={(v) => setClientFilter(v === "all" ? null : parseInt(v))}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os clientes</SelectItem>
                  {uniqueClients.map(client => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name || client.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="denied">Negados</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
              {(searchQuery || clientFilter || statusFilter !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setClientFilter(null);
                    setStatusFilter("all");
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Carregando...</div>
          ) : filteredReservations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nº Venda</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Outdoor</TableHead>
                  <TableHead>Serviços</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-mono text-sm">#{reservation.id}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {reservation.saleNumber ? (
                        <span className="text-primary font-medium">{reservation.saleNumber}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{reservation.user?.name || "Usuário"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{reservation.outdoor?.code || "-"}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {reservation.includePaperGlue && (
                          <Badge variant="secondary" className="text-xs">Papel/Colagem</Badge>
                        )}
                        {reservation.includeCanvasInstall && (
                          <Badge variant="secondary" className="text-xs">Lona/Instalação</Badge>
                        )}
                        {!reservation.includePaperGlue && !reservation.includeCanvasInstall && (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatPrice(reservation.totalValue)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(reservation.createdAt)}
                    </TableCell>
                    <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/admin/reservas/${reservation.id}`)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {reservation.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => navigate(`/admin/reservas/${reservation.id}`)}
                              disabled={updateStatus.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleStatusChange(reservation.id, "denied")}
                              disabled={updateStatus.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Negar
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {statusFilter === "all" 
                  ? "Nenhuma reserva encontrada" 
                  : `Nenhuma reserva com status "${statusFilter}"`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
