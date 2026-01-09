import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Public Pages
import Home from "./pages/Home";
import Projects, { ProjectDetail } from "./pages/Projects";
import ComingSoon from "./pages/ComingSoon";
import OrgChart from "./pages/OrgChart";
import Team from "./pages/Team";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProjects from "./pages/admin/Projects";
import AdminComingSoon from "./pages/admin/ComingSoon";
import AdminTeam from "./pages/admin/Team";
import AdminOrgChart from "./pages/admin/OrgChart";
import AdminAbout from "./pages/admin/About";
import AdminContact from "./pages/admin/Contact";
import AdminSettings from "./pages/admin/Settings";
import LoginPage from "./pages/Login";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/projelerimiz" component={Projects} />
      <Route path="/projelerimiz/:slug" component={ProjectDetail} />
      <Route path="/pek-yakinda" component={ComingSoon} />
      <Route path="/organizasyon-semasi" component={OrgChart} />
      <Route path="/ekibimiz" component={Team} />
      <Route path="/hakkimizda" component={About} />
      <Route path="/iletisim" component={Contact} />

      {/* Auth Routes */}
      <Route path="/login" component={LoginPage} />

      {/* Admin Routes */}
      <Route path="/admin" component={() => (
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      )} />
      <Route path="/admin/projeler" component={() => (
        <AdminLayout>
          <AdminProjects />
        </AdminLayout>
      )} />
      <Route path="/admin/pek-yakinda" component={() => (
        <AdminLayout>
          <AdminComingSoon />
        </AdminLayout>
      )} />
      <Route path="/admin/ekip" component={() => (
        <AdminLayout>
          <AdminTeam />
        </AdminLayout>
      )} />
      <Route path="/admin/organizasyon" component={() => (
        <AdminLayout>
          <AdminOrgChart />
        </AdminLayout>
      )} />
      <Route path="/admin/hakkimizda" component={() => (
        <AdminLayout>
          <AdminAbout />
        </AdminLayout>
      )} />
      <Route path="/admin/iletisim" component={() => (
        <AdminLayout>
          <AdminContact />
        </AdminLayout>
      )} />
      <Route path="/admin/ayarlar" component={() => (
        <AdminLayout>
          <AdminSettings />
        </AdminLayout>
      )} />

      {/* 404 */}
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
