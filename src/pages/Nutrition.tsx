import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import {
  Star,
  Users,
  GraduationCap,
  Phone,
  Mail,
  Clock,
  MapPin,
  DollarSign,
} from "lucide-react";
import { useEffect, useState } from "react";

const Nutrition = () => {
  const [nutritionists, setNutritionists] = useState([]);

  useEffect(() => {
    fetch("http://localhost/endopoints/nutritionists.php")
      .then((res) => res.json())
      .then((data) => setNutritionists(data))
      .catch((err) => console.error("Errore caricamento nutrizionisti:", err));
  }, []);

  const IMAGE_BASE_PATH = "http://localhost/findMyPt/Images/";

  const scegliNutrizionista = async (idNutrizionista) => {
    try {
      const res = await fetch(
        "http://localhost/endopoints/abbonamento_nutr.php",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idNutrizionista }),
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("Nutrizionista salvato con successo!");
      } else {
        alert("Errore: " + data.error);
      }
    } catch (err) {
      console.error("Errore durante la scelta del nutrizionista:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            I NOSTRI <span className="text-primary">NUTRIZIONISTI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Raggiungi i tuoi obiettivi con l'aiuto dei nostri nutrizionisti
            esperti. Piani alimentari personalizzati per ogni esigenza e stile
            di vita.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 max-w-4xl mx-auto">
          {nutritionists.map((nutritionist) => (
            <Card
              key={nutritionist.id}
              className="bg-gym-card border-gym-border shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Colonna sinistra */}
                  <div className="md:col-span-3 text-center md:text-left">
                    <Avatar className="w-24 h-24 mx-auto md:mx-0 mb-4 border-4 border-primary">
                      <AvatarImage
                        src={IMAGE_BASE_PATH + nutritionist.file}
                        alt={nutritionist.Nome}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                        {nutritionist.Nome.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-1">
                      {nutritionist.Nome}
                    </h3>

                    <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        {nutritionist.AnniDiEsperienza}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {nutritionist.rating || "4.5"}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      onClick={() =>
                        scegliNutrizionista(nutritionist.idNutrizionista)
                      }
                    >
                      SCEGLI NUTRIZIONISTA
                    </Button>
                  </div>

                  {/* Colonna destra */}
                  <div className="md:col-span-9 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-lg text-primary mb-2">
                            FORMAZIONE:
                          </h4>
                          <p className="text-lg text-muted-foreground">
                            {nutritionist.TitoloDiStudio ||
                              "Titolo non disponibile"}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-lg text-primary mb-2">
                            UFFICIO:
                          </h4>
                          <div className="flex items-center text-lg text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            {nutritionist.Ufficio ||
                              "Indirizzo non disponibile"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-lg text-muted-foreground flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              TARIFFA:
                            </span>
                            <span className="font-semibold text-medium text-primary">
                              {nutritionist.Tariffa || "N/D"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-lg text-muted-foreground flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              TELEFONO:
                            </span>
                            <span className="font-medium text-medium">
                              {nutritionist.Recapito || "N/D"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-lg text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              DISPONIBILITÀ:
                            </span>
                            <span className="font-medium text-medium">
                              {nutritionist.availability ||
                                "Lun-Sab 09:00-19:00"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-lg text-muted-foreground flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              EMAIL:
                            </span>
                            <span className="font-medium text-medium">
                              {nutritionist.Email || "N/D"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Hai esigenze nutrizionali specifiche? Contattaci per una consulenza
            personalizzata.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="border-gym-border hover:bg-primary hover:text-primary-foreground"
          >
            Richiedi Consulenza Speciale
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
