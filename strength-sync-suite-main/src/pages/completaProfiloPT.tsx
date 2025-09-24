import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";

// Pagina di completamento profilo per PT
const CompletaProfiloPT = () => {
  const [nome, setNome] = useState("");
  const [anniEsperienza, setAnniEsperienza] = useState("");
  const [tariffa, setTariffa] = useState("");
  const [recapito, setRecapito] = useState("");
  const [titoloStudio, setTitoloStudio] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("http://localhost/endopoints/completa_profilo_pt.php", {
      method: "POST",
      body: new FormData(e.currentTarget),
      credentials: "include"
    });
    const data = await res.json();
    if (data.success) {
      navigate("/PTHome");
    } else {
      setError(data.error || "Si è verificato un errore");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/PTHome" className="flex items-center justify-center space-x-2">
            <Dumbbell className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold">
              FIT-<span className="text-primary">GYM</span>
            </span>
          </Link>
        </div>

        {/* Card centrale */}
        <Card className="bg-gym-card border-gym-border shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-primary">
              COMPLETA PROFILO PT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Inserisci il nome completo"
                  required
                />
              </div>

              {/* Anni di esperienza */}
              <div className="space-y-2">
                <Label htmlFor="anniEsperienza">Anni di esperienza</Label>
                <Input
                  id="anniEsperienza"
                  name="anniEsperienza"
                  type="number"
                  value={anniEsperienza}
                  onChange={(e) => setAnniEsperienza(e.target.value)}
                  placeholder="Inserisci gli anni di esperienza"
                  required
                />
              </div>

              {/* Tariffa */}
              <div className="space-y-2">
                <Label htmlFor="tariffa">Tariffa (€/mese)</Label>
                <Input
                  id="tariffa"
                  name="tariffa"
                  type="number"
                  step="0.01"
                  value={tariffa}
                  onChange={(e) => setTariffa(e.target.value)}
                  placeholder="Inserisci la tariffa oraria"
                  required
                />
              </div>

              {/* Recapito */}
              <div className="space-y-2">
                <Label htmlFor="recapito">Recapito</Label>
                <Input
                  id="recapito"
                  name="recapito"
                  type="text"
                  value={recapito}
                  onChange={(e) => setRecapito(e.target.value)}
                  placeholder="Inserisci recapito (telefono/email)"
                  required
                />
              </div>

              {/* Titolo di studio */}
              <div className="space-y-2">
                <Label htmlFor="titoloStudio">Titolo di studio</Label>
                <Input
                  id="titoloStudio"
                  name="titoloStudio"
                  type="text"
                  value={titoloStudio}
                  onChange={(e) => setTitoloStudio(e.target.value)}
                  placeholder="Inserisci il titolo di studio"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium text-center">
                  {error}
                </p>
              )}

              {/* Bottone invio */}
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                size="lg"
                type="submit"
              >
                INVIA
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompletaProfiloPT;
