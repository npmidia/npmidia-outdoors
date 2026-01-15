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
import { Plus, Pencil, Trash2, Lightbulb, MapPin, Upload, X, Loader2, Image } from "lucide-react";
import { useState, useRef } from "react";
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
  photoUrl2: string;
  photoUrl3: string;
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
  photoUrl2: "",
  photoUrl3: "",
};

export default function AdminOutdoors() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<OutdoorFormData>(emptyForm);
  const [uploadingPhoto, setUploadingPhoto] = useState<1 | 2 | 3 | null>(null);
  
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRef3 = useRef<HTMLInputElement>(null);

  const { data: outdoors, isLoading } = trpc.outdoor.list.useQuery({ activeOnly: false });
  const utils = trpc.useUtils();

  const uploadImage = trpc.upload.image.useMutation({
    onError: (error) => {
      toast.error(error.message || "Erro ao fazer upload da imagem");
      setUploadingPhoto(null);
    },
  });

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, photoNumber: 1 | 2 | 3) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setUploadingPhoto(photoNumber);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        
        const result = await uploadImage.mutateAsync({
          base64,
          filename: file.name,
          contentType: file.type,
        });

        const fieldName = photoNumber === 1 ? 'photoUrl' : photoNumber === 2 ? 'photoUrl2' : 'photoUrl3';
        setFormData(prev => ({ ...prev, [fieldName]: result.url }));
        setUploadingPhoto(null);
        toast.success("Imagem enviada com sucesso!");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploadingPhoto(null);
    }
  };

  const removePhoto = (photoNumber: 1 | 2 | 3) => {
    const fieldName = photoNumber === 1 ? 'photoUrl' : photoNumber === 2 ? 'photoUrl2' : 'photoUrl3';
    setFormData(prev => ({ ...prev, [fieldName]: '' }));
  };

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
      photoUrl2: outdoor.photoUrl2 || "",
      photoUrl3: outdoor.photoUrl3 || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.city || !formData.pricePerBiweek) {
      toast.error("Preencha os campos obrigatórios: Código, Cidade e Valor");
      return;
    }

    const dataToSend = {
      ...formData,
      photoUrl: formData.photoUrl || undefined,
      photoUrl2: formData.photoUrl2 || undefined,
      photoUrl3: formData.photoUrl3 || undefined,
    };

    if (editingId) {
      updateOutdoor.mutate({ id: editingId, ...dataToSend });
    } else {
      createOutdoor.mutate(dataToSend);
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

  const PhotoUploadBox = ({ 
    photoNumber, 
    photoUrl, 
    fileInputRef 
  }: { 
    photoNumber: 1 | 2 | 3; 
    photoUrl: string; 
    fileInputRef: React.RefObject<HTMLInputElement>;
  }) => (
    <div className="space-y-2">
      <Label>Foto {photoNumber} {photoNumber === 1 && "(Principal)"}</Label>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e, photoNumber)}
      />
      {photoUrl ? (
        <div className="relative group">
          <img 
            src={photoUrl} 
            alt={`Foto ${photoNumber}`} 
            className="w-full h-32 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={() => removePhoto(photoNumber)}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingPhoto === photoNumber}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
        >
          {uploadingPhoto === photoNumber ? (
            <>
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Enviando...</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Clique para enviar</span>
            </>
          )}
        </button>
      )}
    </div>
  );

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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Outdoor" : "Novo Outdoor"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Fotos */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Fotos do Outdoor
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <PhotoUploadBox 
                      photoNumber={1} 
                      photoUrl={formData.photoUrl} 
                      fileInputRef={fileInputRef1 as React.RefObject<HTMLInputElement>}
                    />
                    <PhotoUploadBox 
                      photoNumber={2} 
                      photoUrl={formData.photoUrl2} 
                      fileInputRef={fileInputRef2 as React.RefObject<HTMLInputElement>}
                    />
                    <PhotoUploadBox 
                      photoNumber={3} 
                      photoUrl={formData.photoUrl3} 
                      fileInputRef={fileInputRef3 as React.RefObject<HTMLInputElement>}
                    />
                  </div>
                </div>

                {/* Informações Básicas */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Informações Básicas</h3>
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
                </div>

                {/* Endereço */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Endereço</h3>
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
                </div>

                {/* Coordenadas */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Coordenadas (para o mapa)</h3>
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
                </div>

                {/* Dimensões */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Dimensões</h3>
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
                </div>

                {/* Data de Ativação */}
                <div>
                  <Label htmlFor="activationDate">Data de Ativação</Label>
                  <Input
                    id="activationDate"
                    type="date"
                    value={formData.activationDate}
                    onChange={(e) => setFormData({ ...formData, activationDate: e.target.value })}
                  />
                </div>

                {/* Switches */}
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

                {/* Botões */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createOutdoor.isPending || updateOutdoor.isPending || uploadingPhoto !== null}>
                    {createOutdoor.isPending || updateOutdoor.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      editingId ? "Salvar Alterações" : "Criar Outdoor"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              Carregando...
            </div>
          ) : outdoors && outdoors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
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
                    <TableCell>
                      {outdoor.photoUrl ? (
                        <img 
                          src={outdoor.photoUrl} 
                          alt={outdoor.code} 
                          className="w-16 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <Image className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
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
              <p className="text-sm text-muted-foreground mt-1">Clique em "Novo Outdoor" para começar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
