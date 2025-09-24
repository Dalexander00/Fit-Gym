import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { Dumbbell, Repeat, Hash, Weight, Clock } from "lucide-react";

interface BackendExercise {
  name: string;
  sets: string;
  reps: string;
  weight: string;
  rest: string;
}

interface DayPlan {
  day: string;
  dayName: string;
  focus: string;
  exercises: BackendExercise[];
}

interface BackendDay {
  day: string;
  dayName: string;
  focus: string;
  exercises: string;
}

const Training = () => {
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [trainer, setTrainer] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost/endopoints/training.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.error("Errore:", data.error);
          setLoading(false);
          return;
        }

        const parsedPlan: DayPlan[] = (data.scheda as BackendDay[]).map((day) => ({
          day: day.day,
          dayName: day.dayName,
          focus: day.focus,
          exercises: day.exercises
            ? day.exercises.split("|").map((exStr) => {
                const [name, sets, reps, weight, rest] = exStr.split("*");
                return { name, sets, reps, weight, rest };
              })
            : [],
        }));

        setWeeklyPlan(parsedPlan);
        setTrainer(data.idPT);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore fetch scheda:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-8">Caricamento scheda...</p>;
  if (!weeklyPlan.length) return <p className="text-center py-8">Nessuna scheda disponibile</p>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            LA TUA SCHEDA DI ALLENAMENTO
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Settimana corrente • Personal Trainer ID: {trainer}
          </p>
        </div>

        {/* Weekly Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {weeklyPlan.map((day, index) => (
            <Card 
              key={index} 
              className="shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gym-card to-gym-card border-gym-border"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-center">
                  <div className="px-4 py-3 rounded-xl mb-3 font-bold text-lg bg-primary text-primary-foreground">
                    {day.day}
                  </div>
                  <div className="text-xl font-bold mb-2">{day.dayName}</div>
                  <Badge variant="outline" className="text-sm px-3 py-1 border-primary text-primary">
                    {day.focus}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {day.exercises.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">Nessun esercizio programmato</p>
                ) : (
                  day.exercises.map((ex, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-orange-200 bg-background/50 hover:bg-background/70"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Dumbbell className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-sm">{ex.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3 text-primary" />
                          <span>Serie: {ex.sets}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Repeat className="h-3 w-3 text-primary" />
                          <span>Ripetizioni: {ex.reps}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Weight className="h-3 w-3 text-primary" />
                          <span>Peso: {ex.weight}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-primary" />
                          <span>Riposo: {ex.rest}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Training;
