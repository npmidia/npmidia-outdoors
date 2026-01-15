import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Calendar, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminBisemanas() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data: biweeks, isLoading, refetch } = trpc.biweek.getByYear.useQuery({ year: selectedYear });
  const utils = trpc.useUtils();

  const generateBiweeks = trpc.biweek.generate.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.length} bi-semanas geradas para ${selectedYear}!`);
      utils.biweek.getByYear.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao gerar bi-semanas");
    },
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  return (
    <AdminLayout title="Bi-semanas" subtitle="Gerencie o calendário de bi-semanas para locação">
      <div className="space-y-6">
        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Como funciona o sistema de bi-semanas</h3>
            <p className="text-muted-foreground mb-4">
              O mercado de outdoor trabalha com um sistema de <strong>bi-semanas</strong>, 
              que divide o ano em períodos de 14 dias para locação dos espaços publicitários.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>O ano é dividido em <strong>26 bi-semanas</strong> (numeradas de 02 a 52, números pares)</li>
              <li>Cada bi-semana representa <strong>14 dias corridos</strong> de veiculação</li>
              <li>A bi-semana 02 começa no final de dezembro do ano anterior</li>
              <li>O sistema gera automaticamente o calendário seguindo essa lógica</li>
            </ul>
          </CardContent>
        </Card>

        {/* Main Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Calendário de Bi-semanas</CardTitle>
            <div className="flex items-center gap-4">
              <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => generateBiweeks.mutate({ year: selectedYear })}
                disabled={generateBiweeks.isPending}
              >
                {generateBiweeks.isPending ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Gerar Bi-semanas {selectedYear}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Carregando...</div>
            ) : biweeks && biweeks.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Bi-semana</TableHead>
                      <TableHead>Período de Veiculação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {biweeks.slice(0, 13).map((biweek) => (
                      <TableRow key={biweek.id}>
                        <TableCell className="font-bold text-primary">
                          {String(biweek.biweekNumber).padStart(2, '0')}
                        </TableCell>
                        <TableCell>
                          {formatDate(biweek.startDate)} à {formatDate(biweek.endDate)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Bi-semana</TableHead>
                      <TableHead>Período de Veiculação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {biweeks.slice(13).map((biweek) => (
                      <TableRow key={biweek.id}>
                        <TableCell className="font-bold text-primary">
                          {String(biweek.biweekNumber).padStart(2, '0')}
                        </TableCell>
                        <TableCell>
                          {formatDate(biweek.startDate)} à {formatDate(biweek.endDate)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma bi-semana para {selectedYear}</h3>
                <p className="text-muted-foreground mb-6">
                  Clique no botão acima para gerar o calendário de bi-semanas
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
