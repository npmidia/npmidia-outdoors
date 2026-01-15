import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Home from "./pages/Home";
import Outdoors from "./pages/Outdoors";
import Reservar from "./pages/Reservar";
import Carrinho from "./pages/Carrinho";
import MinhasReservas from "./pages/MinhasReservas";
import Favoritos from "./pages/Favoritos";
import Perfil from "./pages/Perfil";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOutdoors from "./pages/admin/Outdoors";
import AdminReservas from "./pages/admin/Reservas";
import AdminUsuarios from "./pages/admin/Usuarios";
import AdminBisemanas from "./pages/admin/Bisemanas";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/outdoors" component={Outdoors} />
      <Route path="/reservar/:id" component={Reservar} />
      
      {/* Protected Routes (Client) */}
      <Route path="/carrinho" component={Carrinho} />
      <Route path="/minhas-reservas" component={MinhasReservas} />
      <Route path="/favoritos" component={Favoritos} />
      <Route path="/perfil" component={Perfil} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/outdoors" component={AdminOutdoors} />
      <Route path="/admin/reservas" component={AdminReservas} />
      <Route path="/admin/usuarios" component={AdminUsuarios} />
      <Route path="/admin/bisemanas" component={AdminBisemanas} />
      
      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
