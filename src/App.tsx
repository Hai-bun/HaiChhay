import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LanguageProvider from "./lib/LanguageProvider";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import SignIn from "./pages/SignIn";
import AuthGuard from "./components/AuthGuard";
import GuestInvite from "./pages/GuestInvite";
import WeddingDetail from "./pages/WeddingDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// A new page always starts at the top. Without this, opening the invitation from the
// (scrolled) invite page landed part-way down the hero and skipped its opening animation.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/admin"
              element={
                <AuthGuard>
                  <Admin />
                </AuthGuard>
              }
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/invite/:guestId" element={<GuestInvite />} />
            <Route path="/wedding" element={<WeddingDetail />} />
            <Route path="/wedding/:guestId" element={<WeddingDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
