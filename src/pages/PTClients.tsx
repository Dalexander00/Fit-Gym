import { useEffect, useState } from "react";
import PTNavigation from "@/components/PTNavigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, User } from "lucide-react";
import { Link } from "react-router-dom";

// Tipizzazione dei dati ricevuti dal backend
interface Client {
  idCliente: number;
  Nome: string;
  Eta: number;
  Altezza: number;
  Peso: number;
  Sesso: string;
  Attivita: string;
  Obbiettivo: string;
}

const PTClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          "http://localhost/endopoints/getClients.php",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Errore: ${response.statusText}`);
        }

        // Tipo corretto per la risposta JSON
        const data: Client[] = await response.json();
        setClients(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Errore sconosciuto");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <div className="p-6">Caricamento clienti...</div>;
  if (error) return <div className="p-6 text-red-500">Errore: {error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <PTNavigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Clients</h1>
          <p className="text-xl text-muted-foreground">
            Gestisci i tuoi clienti e i loro programmi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card
              key={client.idCliente}
              className="bg-gradient-to-br from-card to-card/50 border-gym-border hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg" alt={client.Nome} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {client.Nome.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{client.Nome}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {client.Eta} anni
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Obiettivo</span>
                    <Badge>{client.Obbiettivo}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Peso</span>
                    <span className="font-medium">{client.Peso} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Altezza</span>
                    <span className="font-medium">{client.Altezza} m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Attività</span>
                    <span className="font-medium">{client.Attivita}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link to={`/PTClientTraining/${client.idCliente}`} className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Training
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PTClients;
