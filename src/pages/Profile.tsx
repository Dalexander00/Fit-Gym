import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import {
  User,
  Mail,
  Weight,
  Ruler,
  Calendar,
  Edit,
  Dumbbell,
  Utensils,
  CreditCard,
  Target,
  LogOut
} from "lucide-react";

const Profile = () => {
const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/endopoints/profilo.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("User data:", data);
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore fetch profilo:", err);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost/endopoints/logout.php", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        navigate("/login"); // reindirizza alla pagina di login
      } else {
        console.error("Errore logout:", data.error);
      }
    } catch (err) {
      console.error("Errore durante il logout:", err);
    }
  };

  if (loading)
    return <p className="text-center py-8">Caricamento profilo...</p>;
  if (!userData)
    return <p className="text-center py-8">Nessun dato disponibile</p>;

  const profileFields = [
    { label: "NOME E COGNOME", value: userData.Nome, icon: User },
    { label: "EMAIL", value: userData.Email, icon: Mail },
    { label: "PESO (KG)", value: userData.Peso, icon: Weight },
    { label: "ALTEZZA (CM)", value: userData.Altezza, icon: Ruler },
    { label: "ETÀ", value: userData.Eta, icon: Calendar },
    { label: "GENERE", value: userData.Sesso, icon: User },
    { label: "LIVELLO ATTIVITÀ", value: userData.Attivita, icon: Dumbbell },
    { label: "OBIETTIVO", value: userData.Obbiettivo, icon: Target },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gym-card border-gym-border shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24 border-4 border-primary">
                    <AvatarImage
                      src={
                        userData.file
                          ? `http://localhost/findMyPT/Images/${userData.file}`
                          : "/placeholder-avatar.jpg"
                      }
                      alt={userData.Nome}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                      {userData.Nome
                        ? userData.Nome.split(" ")
                            .map((n: string) => n[0])
                            .join("")
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl font-bold">
                  {userData.Nome}
                </CardTitle>
                <p className="text-muted-foreground">Cliente</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.idPT && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Personal Trainer
                    </p>
                    <p className="font-semibold text-primary">
                      ID: {userData.idPT}
                    </p>
                  </div>
                )}

                {userData.idNutrizionista && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Nutritionist
                    </p>
                    <p className="font-semibold text-primary">
                      ID: {userData.idNutrizionista}
                    </p>
                  </div>
                )}

                {/* 🔹 Bottone Logout */}
                <div className="text-center">
                  <Button
                    onClick={handleLogout}
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="bg-gym-card border-gym-border shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold text-primary">
                  DATI PROFILO
                </CardTitle>

                <Link to="/editProfile">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gym-border hover:bg-primary hover:text-primary-foreground"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    MODIFICA
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profileFields.map((field, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <field.icon className="h-4 w-4 text-primary" />
                        <label className="text-sm font-semibold text-primary">
                          {field.label}:
                        </label>
                      </div>
                      <p className="text-lg font-medium pl-6">
                        {field.value || "N/D"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
