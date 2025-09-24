import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Trainers from "./pages/Trainers";
import Nutrition from "./pages/Nutrition";
import Training from "./pages/Training";
import Exercises from "./pages/Exercises";
import NotFound from "./pages/NotFound";
import Registrazione from "./pages/Registrazione";
import CompletaProfilo from "./pages/completaProfilo";
import CompletaProfiloPT from "./pages/completaProfiloPT";
import EditProfile from "./pages/ProfileEdit";
import EditProfilePT from "./pages/PTProfileEdit";
import NutritionChat from "./pages/NutritionChat";
import PTHome from "./pages/PTHome";
import PTClients from "./pages/PTClients";
import PTClientTraining from "./pages/PTClientTraining";
import PTProfile from "./pages/PTProfile";
import Purchase from "./pages/Purchase";
import AbbonamentoEsistente from "./pages/abbonamento-esistente";
import Dieta from "./pages/Dieta";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/training" element={<Training />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/registrazione" element={<Registrazione />} />
          <Route path="/completaProfilo" element={<CompletaProfilo />} />
          <Route path="/completaProfiloPT" element={<CompletaProfiloPT />} />

          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/editProfilePT" element={<EditProfilePT />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/abbonamento-esistente" element={<AbbonamentoEsistente />} />
          <Route path="/dieta" element={<Dieta />} />

          <Route path="/chatbot" element={<NutritionChat />} />
          <Route path="/PTHome" element={<PTHome />} />
          <Route path="/PTClients" element={<PTClients />} />
          <Route
            path="/PTClientTraining/:clientId"
            element={<PTClientTraining />}
          />
          <Route path="/PTProfile" element={<PTProfile />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
