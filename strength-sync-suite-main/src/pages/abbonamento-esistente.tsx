import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_PATH = "http://localhost/findMyPt/Images/";

interface Trainer {
  pt_id: number;
  Nome: string;
  file: string;
  AnniDiEsperienza: number;
  rating: number;
  TitoloDiStudio: string;
  certifications?: string[];
  Tariffa: string;
  Recapito: string;
  availability: string;
  Email: string;
}

export default function AbbonamentoEsistente() {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/endopoints/get_abbonamento.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.trainer) {
          setTrainer(data.trainer);
        } else {
          // nessun abbonamento → torna alla pagina trainers
          navigate("/trainers");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleDisdici = async () => {
    if (!confirm("Sei sicuro di voler disdire l'abbonamento?")) return;

    try {
      const res = await fetch(
        "http://localhost/endopoints/disdiciAbbonamento.php",
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Abbonamento disdetto con successo");
        navigate("/trainers", { replace: true });
      } else {
        alert("Errore: " + (data.error || "Errore server"));
      }
    } catch (err) {
      console.error(err);
      alert("Errore di rete: " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-20">Caricamento...</p>;
  if (!trainer) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Questo è il tuo trainer attuale
        </h1>

        <Card className="mb-6">
          <CardContent className="p-8 flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary">
              <AvatarImage src={IMAGE_BASE_PATH + trainer.file} alt={trainer.Nome} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                {trainer.Nome.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{trainer.Nome}</h2>
              <p><strong>Esperienza:</strong> {trainer.AnniDiEsperienza} anni</p>
              <p><strong>Tariffa:</strong> {trainer.Tariffa}</p>
              <p><strong>Email:</strong> {trainer.Email}</p>
              <p><strong>Telefono:</strong> {trainer.Recapito}</p>
              <p><strong>Disponibilità:</strong> {trainer.availability}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-6 mt-8">
          <Button className="bg-red-600 hover:bg-red-700" onClick={handleDisdici}>
            Disdici abbonamento
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => navigate("/trainers")}>
            Mantieni abbonamento
          </Button>
        </div>
      </div>
    </div>
  );
}