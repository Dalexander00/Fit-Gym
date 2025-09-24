import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PTNavigation from "@/components/PTNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Save, User } from "lucide-react";
import { toast } from "sonner";


type Exercise = {
  name: string;
  sets: string;
  reps: string;
  weight: string;
  rest: string;
  notes: string;
};


type DayPlan = {
  day: string;
  exercises: Exercise[];
};


interface ClientData {
  user_id: number;
  Nome: string;
  Eta: number;
  Peso: number;
  Altezza: number;
  Sesso: string;
  Attivita: string;
  Obbiettivo: string;
}

const PTClientTraining = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState<ClientData | null>(null);
  const [trainingPlan, setTrainingPlan] = useState<{ weekPlan: DayPlan[] }>({
    weekPlan: [
      { day: "Lunedì", exercises: [] },
      { day: "Martedì", exercises: [] },
      { day: "Mercoledì", exercises: [] },
      { day: "Giovedì", exercises: [] },
      { day: "Venerdì", exercises: [] },
      { day: "Sabato", exercises: [] },
      { day: "Domenica", exercises: [] },
    ],
  });

  // 🔹 Fetch dati cliente
  useEffect(() => {
  if (!clientId) return;
  fetch(`http://localhost/endopoints/getClient.php?id=${clientId}`, {
    method: "GET",
    credentials: "include", // necessario per i cookie di sessione
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        // aggiorna il client con i dati reali
        setClient(data.data);
      } else {
        console.error("Errore backend:", data.error);
      }
    })
    .catch((err) => console.error("Errore fetch:", err));
}, [clientId]);



  const addExercise = (dayIndex: number) => {
    const newExercise: Exercise = {
      name: "",
      sets: "",
      reps: "",
      weight: "",
      rest: "",
      notes: "",
    };
    const updatedPlan = { ...trainingPlan };
    updatedPlan.weekPlan[dayIndex].exercises.push(newExercise);
    setTrainingPlan(updatedPlan);
  };

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    const updatedPlan = { ...trainingPlan };
    updatedPlan.weekPlan[dayIndex].exercises.splice(exerciseIndex, 1);
    setTrainingPlan(updatedPlan);
  };

  const updateExercise = (
    dayIndex: number,
    exerciseIndex: number,
    field: keyof Exercise,
    value: string
  ) => {
    const updatedPlan = { ...trainingPlan };
    updatedPlan.weekPlan[dayIndex].exercises[exerciseIndex][field] = value;
    setTrainingPlan(updatedPlan);
  };

  const savePlan = async () => {
    if (!client) return;

    // 🔹 Creazione payload per il backend
    interface SavePlanPayload {
      idPt: number;
      user_id: number;
    }

    const payload: SavePlanPayload = { idPt: 1, user_id: client.user_id}; 
    trainingPlan.weekPlan.forEach((day, index) => {
      // concatena esercizi del giorno
      const dayString = day.exercises
        .map((ex) => [ex.name, ex.sets, ex.reps, ex.weight, ex.rest].join("*"))
        .join("|"); // usa | per separare più esercizi
      payload[`Giorno${index + 1}`] = dayString;
    });


    try {
      const res = await fetch(
        "http://localhost/endopoints/saveTrainingPlan.php",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Piano di allenamento salvato con successo!");
      } else {
        toast.error("Errore salvataggio piano: " + data.error);
      }
    } catch (err) {
      console.error("Errore salvataggio piano:", err);
      toast.error("Errore di rete durante il salvataggio");
    }
  };

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Caricamento dati cliente...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PTNavigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/PTClients"
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna ai Clienti
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Piano di Allenamento</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xl text-muted-foreground">
                    {client.Nome}
                  </span>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {client.Obbiettivo}
                </Badge>
                <Badge variant="secondary">{client.Eta} anni</Badge>
              </div>
            </div>

            <Button
              onClick={savePlan}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Salva Piano
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {trainingPlan.weekPlan.map((day, dayIndex) => (
            <Card
              key={dayIndex}
              className="bg-gradient-to-br from-card to-card/50 border-gym-border"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{day.day}</CardTitle>
                  <Button
                    onClick={() => addExercise(dayIndex)}
                    variant="outline"
                    size="sm"
                    className="border-gym-border"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi Esercizio
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {day.exercises.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nessun esercizio programmato per questo giorno</p>
                    <p className="text-sm">
                      Clicca "Aggiungi Esercizio" per iniziare
                    </p>
                  </div>
                ) : (
                  day.exercises.map((exercise, exerciseIndex) => (
                    <Card
                      key={exerciseIndex}
                      className="bg-background/50 border-gym-border"
                    >
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                          <div className="md:col-span-2">
                            <Label>Esercizio</Label>
                            <Input
                              value={exercise.name}
                              onChange={(e) =>
                                updateExercise(
                                  dayIndex,
                                  exerciseIndex,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="Nome esercizio"
                              className="bg-background border-gym-border"
                            />
                          </div>
                          <div>
                            <Label>Serie</Label>
                            <Input
                              value={exercise.sets}
                              onChange={(e) =>
                                updateExercise(
                                  dayIndex,
                                  exerciseIndex,
                                  "sets",
                                  e.target.value
                                )
                              }
                              placeholder="4"
                              className="bg-background border-gym-border"
                            />
                          </div>
                          <div>
                            <Label>Ripetizioni</Label>
                            <Input
                              value={exercise.reps}
                              onChange={(e) =>
                                updateExercise(
                                  dayIndex,
                                  exerciseIndex,
                                  "reps",
                                  e.target.value
                                )
                              }
                              placeholder="8-10"
                              className="bg-background border-gym-border"
                            />
                          </div>
                          <div>
                            <Label>Peso</Label>
                            <Input
                              value={exercise.weight}
                              onChange={(e) =>
                                updateExercise(
                                  dayIndex,
                                  exerciseIndex,
                                  "weight",
                                  e.target.value
                                )
                              }
                              placeholder="70kg"
                              className="bg-background border-gym-border"
                            />
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Label>Riposo</Label>
                              <Input
                                value={exercise.rest}
                                onChange={(e) =>
                                  updateExercise(
                                    dayIndex,
                                    exerciseIndex,
                                    "rest",
                                    e.target.value
                                  )
                                }
                                placeholder="90s"
                                className="bg-background border-gym-border"
                              />
                            </div>
                            <Button
                              onClick={() =>
                                removeExercise(dayIndex, exerciseIndex)
                              }
                              variant="outline"
                              size="sm"
                              className="mt-6 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Label>Note</Label>
                          <Textarea
                            value={exercise.notes}
                            onChange={(e) =>
                              updateExercise(
                                dayIndex,
                                exerciseIndex,
                                "notes",
                                e.target.value
                              )
                            }
                            placeholder="Note aggiuntive per l'esercizio..."
                            className="bg-background border-gym-border resize-none"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PTClientTraining;