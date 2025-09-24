import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 aggiunto useNavigate
import PTNavigation from "@/components/PTNavigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Calendar,
  Award,
  Users,
  Edit,
  LogOut, // 👈 icona logout
} from "lucide-react";

interface PTData {
  pt_id: number;
  Nome: string;
  AnniDiEsperienza: string;
  TitoloDiStudio: string;
  Tariffa: string;
  Recapito: string;
  Email?: string;
  immagine?: string;
}

const PTProfile = () => {
  const [trainerData, setTrainerData] = useState<PTData | null>(null);
  const navigate = useNavigate(); // 👈 serve per redirect dopo logout

  useEffect(() => {
    fetch("http://localhost/endopoints/getPTProfile.php", { 
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTrainerData(data.data);
        } else {
          console.error("Errore:", data.error);
        }
      })
      .catch((err) => console.error("Errore fetch:", err));
  }, []);

  // 👇 funzione logout
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost/endopoints/logout.php", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        navigate("/login"); // 👈 redirect alla login
      } else {
        console.error("Errore logout:", data.error);
      }
    } catch (err) {
      console.error("Errore durante il logout:", err);
    }
  };

  if (!trainerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Caricamento profilo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PTNavigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Profilo Personal Trainer</h1>
            <p className="text-xl text-muted-foreground">
              Gestisci le tue informazioni professionali
            </p>
          </div>

          {/* 🔹 Bottone Logout */}
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-card to-card/50 border-gym-border">
              <CardHeader className="text-center">
                <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-primary">
                  <AvatarImage
                    src={
                      trainerData.immagine
                        ? `http://localhost/findMyPT/Images/${trainerData.immagine}`
                        : "/placeholder.svg"
                    }
                    alt={trainerData.Nome}
                  />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                    {trainerData.Nome.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <CardTitle className="text-2xl">{trainerData.Nome}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                  <Award className="h-4 w-4" />
                  Personal Trainer Certificato
                </CardDescription>
                <div className="flex justify-center mt-4">
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {trainerData.TitoloDiStudio}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Link to="/editProfilePT">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifica Profilo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-gradient-to-br from-card to-card/50 border-gym-border">
              <CardHeader>
                <CardTitle>Informazioni Personali</CardTitle>
                <CardDescription>
                  I tuoi dati di contatto e professionali
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-background/50 border border-gym-border">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{trainerData.Email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-background/50 border border-gym-border">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Recapito</p>
                      <p className="font-medium">{trainerData.Recapito}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-background/50 border border-gym-border">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Esperienza
                      </p>
                      <p className="font-medium">
                        {trainerData.AnniDiEsperienza} anni
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-background/50 border border-gym-border">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Titolo di Studio
                      </p>
                      <p className="font-medium">
                        {trainerData.TitoloDiStudio}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-background/50 border border-gym-border">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tariffa</p>
                      <p className="font-medium">{trainerData.Tariffa} €</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PTProfile;
