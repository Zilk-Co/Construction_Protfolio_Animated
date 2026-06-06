import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { CustomCursor } from "@/components/layout/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { ParticleBackground } from "@/components/layout/ParticleBackground";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AdminFloatingButton } from "@/components/layout/AdminFloatingButton";
import Home from "@/pages/home";
import Projects from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";
import Contact from "@/pages/contact";
import MachineryPage from "@/pages/machinery";
import MachineryDetail from "@/pages/machinery-detail";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProjectNew from "@/pages/admin/project-new";
import AdminProjectEdit from "@/pages/admin/project-edit";
import AdminProjectImages from "@/pages/admin/project-images";
import AdminMachinery from "@/pages/admin/machinery";
import AdminMachineryEdit from "@/pages/admin/machinery-edit";
import AdminSettings from "@/pages/admin/settings";

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      <ParticleBackground />
      {!isAdmin && <Navbar />}
      <CustomCursor />
      <AdminFloatingButton />
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Home} />
        <Route path="/projects">
          <div className="pt-24"><Projects /></div>
        </Route>
        <Route path="/projects/:slug">
          {() => <ProjectDetail />}
        </Route>
        <Route path="/machinery">
          <div className="pt-24"><MachineryPage /></div>
        </Route>
        <Route path="/machinery/:slug">
          <div className="pt-24"><MachineryDetail /></div>
        </Route>
        <Route path="/contact">
          <div className="pt-24"><Contact /></div>
        </Route>

        {/* Admin login — accessible via /admin-panel (primary) and /admin-login (legacy) */}
        <Route path="/admin-panel" component={AdminLogin} />
        <Route path="/admin-login" component={AdminLogin} />

        {/* Admin routes */}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/projects/new" component={AdminProjectNew} />
        <Route path="/admin/projects/:id/edit" component={AdminProjectEdit} />
        <Route path="/admin/projects/:id/images" component={AdminProjectImages} />
        <Route path="/admin/machinery" component={AdminMachinery} />
        <Route path="/admin/machinery/new" component={AdminMachineryEdit} />
        <Route path="/admin/machinery/:id/edit" component={AdminMachineryEdit} />
        <Route path="/admin/settings" component={AdminSettings} />

        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
