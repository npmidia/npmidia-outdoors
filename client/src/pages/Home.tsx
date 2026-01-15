import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { MapPin, Lightbulb, Calendar, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-npmidia.png" alt="NPMIDIA" className="h-10" />
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/outdoors">
              <Button variant="ghost">Ver Outdoors</Button>
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/minhas-reservas">
                  <Button variant="ghost">Minhas Reservas</Button>
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
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button variant="default">Entrar</Button>
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 lg:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Anuncie sua marca nos melhores{" "}
                <span className="text-primary">outdoors</span> da região
              </h1>
              <p className="text-lg text-muted-foreground">
                A NPMIDIA oferece os melhores pontos de mídia exterior para sua campanha publicitária. 
                Escolha, reserve e gerencie seus outdoors de forma simples e rápida.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/outdoors">
                  <Button size="lg" className="gap-2">
                    Ver Outdoors Disponíveis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <a href={getLoginUrl()}>
                    <Button size="lg" variant="outline">
                      Criar Conta
                    </Button>
                  </a>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center border border-primary/20">
                <img 
                  src="/logo-npmidia.png" 
                  alt="NPMIDIA Outdoors" 
                  className="w-2/3 opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Como funciona
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Reserve seu espaço publicitário em poucos passos
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-secondary/30 border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Escolha o Local</h3>
              <p className="text-muted-foreground">
                Navegue pela nossa galeria de outdoors e encontre o ponto ideal para sua campanha.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-secondary/30 border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Selecione o Período</h3>
              <p className="text-muted-foreground">
                Escolha as bi-semanas disponíveis para veiculação da sua campanha.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-secondary/30 border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Confirme a Reserva</h3>
              <p className="text-muted-foreground">
                Adicione ao carrinho, escolha serviços adicionais e finalize seu pedido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Sistema de Bi-semanas
              </h2>
              <p className="text-white/90 mb-4">
                O mercado de outdoor trabalha com um sistema de <strong>bi-semanas</strong>, 
                que divide o ano em períodos de 14 dias para locação dos espaços publicitários.
              </p>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>26 bi-semanas por ano, numeradas de 02 a 52</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Cada bi-semana representa 14 dias de veiculação</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Selecione múltiplas bi-semanas para campanhas longas</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">Serviços Adicionais</h3>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Papel e Colagem</span>
                    <span className="text-lg font-bold">R$ 350,00</span>
                  </div>
                  <p className="text-sm text-white/70 mt-1">
                    Impressão em papel e instalação no outdoor
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Lona e Instalação</span>
                    <span className="text-lg font-bold">R$ 1.500,00</span>
                  </div>
                  <p className="text-sm text-white/70 mt-1">
                    Impressão em lona de alta qualidade e instalação profissional
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pronto para anunciar?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Explore nossa galeria de outdoors e encontre o ponto perfeito para sua campanha publicitária.
          </p>
          <Link href="/outdoors">
            <Button size="lg" className="gap-2">
              Explorar Outdoors
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <img src="/logo-npmidia.png" alt="NPMIDIA" className="h-8 brightness-0 invert" />
            <p className="text-sm text-background/70">
              © {new Date().getFullYear()} NPMIDIA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
