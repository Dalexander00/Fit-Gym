import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const Dieta = () => {
  const [weeklyDiet, setWeeklyDiet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nutritionist, setNutritionist] = useState(null);

  useEffect(() => {
    fetch("http://localhost/endopoints/dieta.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWeeklyDiet(data.dieta);
          setNutritionist(data.idNutrizionista);
        } else {
          console.error("Errore:", data.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore fetch dieta:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-8">Caricamento dieta...</p>;
  if (!weeklyDiet.length)

    return <p className="text-center py-8">Nessuna dieta disponibile <br /><br /><Button onClick={() => window.history.back()}>Torna indietro</Button></p>

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            LA TUA DIETA PERSONALIZZATA
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Settimana del 4-10 Marzo 2024 • Nutrizionista: {nutritionist?.Nome}
          </p>
        </div>

        {/* Weekly Diet Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {weeklyDiet.map((day, index) => (
            <Card key={index} className="shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                <CardHeader className="relative flex flex-col items-center pb-4">
                    {/* Giorno */}
                    <div className="px-4 py-3 rounded-xl font-bold text-lg flex items-center justify-center w-full min-h-[48px] bg-green-500 text-white mb-3">
                    {day.day}
                    </div>

                    {/* Nome del giorno */}
                    <div className="text-xl font-bold text-center min-h-[28px]">{day.dayName}</div>

                    {/* Focus */}
                    <Badge
                    variant="outline"
                    className="text-sm px-3 py-1 mt-2 min-h-[24px] flex items-center justify-center border-green-500 text-green-500"
                    >
                    {day.focus}
                    </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                    {Object.entries(day.meals).map(([mealType, mealItems], mealIndex) => {
                        const items = typeof mealItems === "string" ? mealItems.split(",") : []; // evita errori
                        return (
                            <div key={mealIndex} className="bg-background/20 p-3 rounded-lg border border-green-200">
                            <div className="font-semibold text-green-600 mb-2">{mealType}</div>

                            {items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="flex items-center space-x-3 p-2 rounded-md bg-gray-800/70 mb-1"
                              >
                                <Utensils className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-200">{item.trim()}</span>
                              </div>
                            ))}
                            </div>
                        );
                        })}
                </CardContent>
            </Card>

          ))}
        </div>

        {/* Note generali */}
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-amber-600">
                Consigli del Nutrizionista
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Bevi almeno 2 litri di acqua al giorno, prediligi cotture al
                vapore o alla griglia, limita zuccheri e fritti.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dieta;