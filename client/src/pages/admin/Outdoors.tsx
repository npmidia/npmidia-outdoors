import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Plus, Pencil, Trash2, Lightbulb, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OutdoorFormData {
  code: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: string;
  longitude: string;
  width: string;
  height: string;
  pricePerBiweek: string;
  hasLighting: boolean;
  activationDate: string;
  isActive: boolean;
  photoUrl: string;
}

const emptyForm: OutdoorFormData = {
  code: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  latitude: "",
  longitude: "",
  width: "",
  height: "",
  pricePerBiweek: "",
  hasLighting: false,
  activationDate: "",
  isActive: true,
  photoUrl: "",
};

export default function AdminOutdoors() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<OutdoorFormData>(emptyForm);

  const { data: outdoors, isLoading } = trpc.outdoor.list.useQuery({ activeOnly: false });
  const utils = trpc.useUtils();

  const createOutdoor = trpc.outdoor.create.useMutation({
    onSuccess: () => {
      toast.success("Outdoor criado com sucesso!");
      utils.outdoor.list.invalidate();
      setIsDialogOpen(false);
      setFormData(emptyForm);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar outdoor");
    },
  });

  const updateOutdoor = trpc.outdoor.update.useMutation({
    onSuccess: () => {
      toast.success("Outdoor atualizado com sucesso!");
      utils.outdoor.list.invalidate();
      setIsDialogOpen(false);
      setFormData(emptyForm);
      setEditingId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar outdoor");
    },
  });

  const deleteOutdoor = trpc.outdoor.delete.useMutation({
    onSuccess: () => {
      toast.success("Outdoor removido com sucesso!");
      utils.outdoor.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover outdoor");
    },
  });

  const handleEdit = (outdoor: any) => {
    setEditingId(outdoor.id);
    setFormData({
      code: outdoor.code || "",
      street: outdoor.street || "",
      number: outdoor.number || "",
      neighborhood: outdoor.neighborhood || "",
      city: outdoor.city || "",
      state: outdoor.state || "",
      zipCode: outdoor.zipCode || "",
      latitude: outdoor.latitude || "",
      longitude: outdoor.longitude || "",
      width: outdoor.width || "",
      height: outdoor.height || "",
      pricePerBiweek: outdoor.pricePerBiweek || "",
      hasLighting: outdoor.hasLighting || false,
      activationDate: outdoor.activationDate ? new Date(outdoor.activationDate).toISOString().split('T')[0] : "",
      isActive: outdoor.isActive ?? true,
      photoUrl: outdoor.photoUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.city || !formData.pricePerBiweek) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (editingId) {
      updateOutdoor.mutate({ id: editingId, ...formData });
    } else {
      createOutdoor.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este outdoor?")) {
      deleteOutdoor.mutate({ id });
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(price));
  };

  return (
    <AdminLayout title="Gerenciar Outdoors" subtitle="Cadastre e gerencie os outdoors disponíveis">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Outdoors Cadastrados</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingId(null);
              setFormData(emptyForm);
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Outdoor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Outdoor" : "Novo Outdoor"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Código *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="Ex: OUT-001"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerBiweek">Valor por Bi-semana (R$) *</Label>
                    <Input
                      id="pricePerBiweek"
                      type="number"
                      step="0.01"
                      value={formData.pricePerBiweek}
                      onChange={(e) => setFormData({ ...formData, pricePerBiweek: e.target.value })}
                      placeholder="Ex: 1500.00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="street">Rua</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      placeholder="Nome da rua"
                    />
                  </div>
                  <div>
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      placeholder="Ex: 123"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      placeholder="Nome do bairro"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Nome da cidade"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Ex: SP"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="Ex: 01234-567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      placeholder="Ex: -23.550520"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      placeholder="Ex: -46.633308"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">Largura (m)</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.01"
                      value={formData.width}
                      onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                      placeholder="Ex: 9.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Altura (m)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.01"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="Ex: 3.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="activationDate">Data de Ativação</Label>
                  <Input
                    id="activationDate"
                    type="date"
                    value={formData.activationDate}
                    onChange={(e) => setFormData({ ...formData, activationDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="photoUrl">URL da Foto</Label>
                  <Input
                    id="photoUrl"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="hasLighting"
                      checked={formData.hasLighting}
                      onCheckedChange={(checked) => setFormData({ ...formData, hasLighting: checked })}
                    />
                    <Label htmlFor="hasLighting">Possui iluminação</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Ativo</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createOutdoor.isPending || updateOutdoor.isPending}>
                    {editingId ? "Salvar Alterações" : "Criar Outdoor"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Carregando...</div>
          ) : outdoors && outdoors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Valor/Bi-semana</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outdoors.map((outdoor) => (
                  <TableRow key={outdoor.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {outdoor.code}
                        {outdoor.hasLighting && (
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {outdoor.neighborhood && `${outdoor.neighborhood}, `}{outdoor.city}
                      </div>
                    </TableCell>
                    <TableCell>
                      {outdoor.width && outdoor.height 
                        ? `${outdoor.width}m x ${outdoor.height}m`
                        : "-"
                      }
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatPrice(outdoor.pricePerBiweek)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={outdoor.isActive ? "default" : "secondary"}>
                        {outdoor.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(outdoor)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(outdoor.id)}
                          disabled={deleteOutdoor.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum outdoor cadastrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
