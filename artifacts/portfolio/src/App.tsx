import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trackPageView } from "@/lib/analytics";
import NotFound from "@/pages/not-found";

import { CustomCursor } from "@/components/layout/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { ParticleBackground } from "@/components/layout/ParticleBackground";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AdminFloatingButton } from "@/components/layout/AdminFloatingButton";
import { AiAssistant } from "@/components/layout/AiAssistant";
import { EditModeProvider } from "@/components/EditModeProvider";
import { EditModeProjectManager } from "@/components/EditModeProjectManager";
import { EditToolbar } from "@/components/EditToolbar";
import Home from "@/pages/home";
import Projects from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";
import About from "@/pages/about";
import Safety from "@/pages/safety";
import Contact from "@/pages/contact";
import ServicesPage from "@/pages/services";
import ServiceDetail from "@/pages/services-detail";
import ClientsPage from "@/pages/clients";
import ClientDetail from "@/pages/client-detail";
import DocumentsPage from "@/pages/documents";
import PoliciesPage from "@/pages/policies";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProjectNew from "@/pages/admin/project-new";
import AdminProjectEdit from "@/pages/admin/project-edit";
import AdminProjectImages from "@/pages/admin/project-images";
import AdminServices from "@/pages/admin/services";
import AdminServicesEdit from "@/pages/admin/services-edit";
import AdminSettings from "@/pages/admin/settings";
import AdminPageContent from "@/pages/admin/page-content";
import AdminDocuments from "@/pages/admin/documents";
import AdminClients from "@/pages/admin/clients";
import AdminPolicies from "@/pages/admin/policies";
import AdminMessages from "@/pages/admin/messages";
import AdminBlog from "@/pages/admin/blog";
import AdminBlogEdit from "@/pages/admin/blog-edit";
import BlogPage from "@/pages/blog";
import BlogDetail from "@/pages/blog-detail";
import AdminMedia from "@/pages/admin/media";
import AdminTestimonials from "@/pages/admin/testimonials";
import AdminJobs from "@/pages/admin/jobs";
import AdminJobsEdit from "@/pages/admin/jobs-edit";
import Careers, { JobDetail } from "@/pages/careers";

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return (
    <>
      <ScrollToTop />
      <ParticleBackground />
      {!isAdmin && <Navbar />}
      <CustomCursor />
      {!isAdmin && <AdminFloatingButton />}
      {!isAdmin && <EditModeProjectManager />}
      {!isAdmin && <EditToolbar />}
      <AiAssistant />
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Home} />
        <Route path="/projects">
          <div className="pt-24"><Projects /></div>
        </Route>
        <Route path="/projects/:slug">
          {() => <ProjectDetail />}
        </Route>
        <Route path="/services">
          <div className="pt-24"><ServicesPage /></div>
        </Route>
        <Route path="/services/:slug">
          <div className="pt-24"><ServiceDetail /></div>
        </Route>
        <Route path="/about">
          <div className="pt-24"><About /></div>
        </Route>
        <Route path="/safety">
          <div className="pt-24"><Safety /></div>
        </Route>
        <Route path="/contact">
          <div className="pt-24"><Contact /></div>
        </Route>
        <Route path="/clients" component={ClientsPage} />
        <Route path="/clients/:slug" component={ClientDetail} />
        <Route path="/documents">
          <div className="pt-24"><DocumentsPage /></div>
        </Route>
        <Route path="/policies">
          <div className="pt-24"><PoliciesPage /></div>
        </Route>
        <Route path="/blog" component={BlogPage} />
        <Route path="/blog/:slug" component={BlogDetail} />
        <Route path="/careers" component={Careers} />
        <Route path="/careers/:slug" component={JobDetail} />

        {/* Admin login — accessible via /admin-panel (primary) and /admin-login (legacy) */}
        <Route path="/admin-panel" component={AdminLogin} />
        <Route path="/admin-login" component={AdminLogin} />

        {/* Admin routes */}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/projects/new" component={AdminProjectNew} />
        <Route path="/admin/projects/:id/edit" component={AdminProjectEdit} />
        <Route path="/admin/projects/:id/images" component={AdminProjectImages} />
        <Route path="/admin/services" component={AdminServices} />
        <Route path="/admin/services/new" component={AdminServicesEdit} />
        <Route path="/admin/services/:id/edit" component={AdminServicesEdit} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route path="/admin/page-content" component={AdminPageContent} />
        <Route path="/admin/documents" component={AdminDocuments} />
        <Route path="/admin/clients" component={AdminClients} />
        <Route path="/admin/policies" component={AdminPolicies} />
        <Route path="/admin/messages" component={AdminMessages} />
        <Route path="/admin/blog" component={AdminBlog} />
        <Route path="/admin/blog/new" component={AdminBlogEdit} />
        <Route path="/admin/blog/:id/edit" component={AdminBlogEdit} />
        <Route path="/admin/media" component={AdminMedia} />
        <Route path="/admin/testimonials" component={AdminTestimonials} />
        <Route path="/admin/jobs" component={AdminJobs} />
        <Route path="/admin/jobs/new" component={AdminJobsEdit} />
        <Route path="/admin/jobs/:id/edit" component={AdminJobsEdit} />

        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <EditModeProvider>
            <Router />
          </EditModeProvider>
        </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
