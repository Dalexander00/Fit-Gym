import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import PTNavigation from "@/components/PTNavigation";
import { Search, Play, Clock, Target } from "lucide-react";

type Exercise = {
  idEsercizio: number;
  Nome: string;
  Tipo: string;
  Muscolo: string;
  Difficolta: string;
  Descrizione: string;
  Serie: string;
  Equipaggiamento: string;
  Video: string;
};

const Exercises = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [userType, setUserType] = useState<string | null>(null);

  // recupero tipo utente dalla sessione
  useEffect(() => {
    fetch("http://localhost/endopoints/getUserType.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user_type) {
          setUserType(data.user_type);
        }
      })
      .catch((err) => console.error("Errore recupero user_type:", err));
  }, []);

  // recupero lista esercizi
  useEffect(() => {
    fetch("http://localhost/endopoints/exercises.php")
      .then((res) => res.json())
      .then((data) => setExercises(data))
      .catch((err) => console.error("Errore caricamento esercizi:", err));
  }, []);

  const categories = ["all", "PUSH", "PULL", "GAMBE", "PETTO", "SCHIENA", "SPALLE"];

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.Nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.Muscolo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      exercise.Tipo === selectedCategory ||
      exercise.Muscolo === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Base":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Intermedio":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "Avanzato":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation dinamica */}
      {userType === "PT" ? <PTNavigation /> : <Navigation />}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            LIBRERIA <span className="text-primary">ESERCIZI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Esplora la nostra libreria completa di esercizi. Impara la tecnica
            corretta e guarda i video dimostrativi.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca esercizi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gym-card border-gym-border"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "border-gym-border hover:bg-primary hover:text-primary-foreground"
                }
              >
                {category === "all" ? "Tutti" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <Card
              key={exercise.idEsercizio}
              className="bg-gym-card border-gym-border shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {exercise.Nome}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className="bg-primary text-primary-foreground">
                        {exercise.Tipo}
                      </Badge>
                      <Badge variant="outline" className="border-gym-border">
                        {exercise.Muscolo}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(exercise.Difficolta)}>
                    {exercise.Difficolta}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {exercise.Descrizione}
                </p>

                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 text-primary mr-2" />
                  <span className="text-muted-foreground">Serie/Reps:</span>
                  <span className="ml-2 font-semibold">{exercise.Serie}</span>
                </div>

                <div className="flex items-center text-sm">
                  <Target className="h-4 w-4 text-primary mr-2" />
                  <span className="text-muted-foreground">
                    Equipaggiamento:
                  </span>
                  <span className="ml-2 font-semibold">
                    {exercise.Equipaggiamento}
                  </span>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="sm"
                    asChild
                  >
                    <a
                      href={exercise.Video}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Video Tutorial
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nessun esercizio trovato con i criteri di ricerca attuali.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-gym-border hover:bg-primary hover:text-primary-foreground"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              Resetta Filtri
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises;
