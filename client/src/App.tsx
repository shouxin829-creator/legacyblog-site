import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { ArticlePage, BlogIndex } from "./pages/Blog";
import ArchivePage from "./pages/Archive";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import { ServicePage, ServicesIndex } from "./pages/Services";
import { SiteLayout } from "@/components/SiteLayout";

function Router() {
  return <SiteLayout><Switch>
    <Route path="/" component={Home} />
    <Route path="/blog" component={BlogIndex} />
    <Route path="/blog/:slug" component={ArticlePage} />
    <Route path="/services" component={ServicesIndex} />
    <Route path="/services/:slug" component={ServicePage} />
    <Route path="/archive" component={ArchivePage} />
    <Route path="/about" component={AboutPage} />
    <Route path="/contact" component={ContactPage} />
    <Route component={NotFound} />
  </Switch></SiteLayout>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
