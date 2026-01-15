import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface BiweekHelpModalProps {
  year?: number;
}

export function BiweekHelpModal({ year }: BiweekHelpModalProps) {
  const currentYear = year || new Date().getFullYear();
  const { data: biweeks, isLoading } = trpc.biweek.getByYear.useQuery({ year: currentYear });

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateShort = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short'
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full hover:bg-muted"
          title="Ver calendário de bi-semanas"
        >
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Calendário de Bi-semanas {currentYear}
          </DialogTitle>
          <DialogDescription>
            Cada bi-semana corresponde a um período de 14 dias. Confira abaixo as datas de início e fim de cada período.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando calendário...
            </div>
          ) : biweeks && biweeks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-2 text-left font-semibold text-sm">
                      Bi-semana
                    </th>
                    <th className="border border-border px-3 py-2 text-left font-semibold text-sm">
                      Data Início
                    </th>
                    <th className="border border-border px-3 py-2 text-left font-semibold text-sm">
                      Data Fim
                    </th>
                    <th className="border border-border px-3 py-2 text-left font-semibold text-sm">
                      Período
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {biweeks.map((biweek, index) => (
                    <tr 
                      key={biweek.id} 
                      className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}
                    >
                      <td className="border border-border px-3 py-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                          {String(biweek.biweekNumber).padStart(2, '0')}
                        </span>
                      </td>
                      <td className="border border-border px-3 py-2 text-sm">
                        {formatDate(biweek.startDate)}
                      </td>
                      <td className="border border-border px-3 py-2 text-sm">
                        {formatDate(biweek.endDate)}
                      </td>
                      <td className="border border-border px-3 py-2 text-sm text-muted-foreground">
                        {formatDateShort(biweek.startDate)} - {formatDateShort(biweek.endDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma bi-semana cadastrada para {currentYear}</p>
              <p className="text-sm mt-2">
                Entre em contato com o administrador para gerar o calendário.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Sobre o sistema de bi-semanas</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Cada bi-semana tem duração de <strong>14 dias</strong></li>
            <li>• O ano possui <strong>26 bi-semanas</strong> (numeradas de 02 a 52, apenas números pares)</li>
            <li>• A bi-semana 02 inicia no final de dezembro do ano anterior</li>
            <li>• As reservas são feitas por bi-semana completa</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
