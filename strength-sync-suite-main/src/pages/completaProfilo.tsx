import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";

// Pagina di registrazione utente
const CompletaProfilo = () => {
  // Stati per gestire i valori dei campi del form
  const [nome, setNome] = useState(""); 
  const [eta, setEta] = useState(""); 
  const [peso, setPeso] = useState(""); 
  const [altezza, setAltezza] = useState(""); 
  const [sesso, setSesso] = useState(""); 
  const [attivita, setAttivita] = useState(""); 
  const [obbiettivo, setObbiettivo] = useState(""); 
  const [error, setError] = useState(""); 

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost/endopoints/completa_profilo.php", {
      method: "POST",
      body: new FormData(e.target),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      navigate("/profile");
    } else {
      setError(data.error || "Si è verificato un errore");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2">
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
              COMPLETA PROFILO
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

              {/* Età */}
              <div className="space-y-2">
                <Label htmlFor="eta">Età</Label>
                <Input
                  id="eta"
                  name="eta"
                  type="number"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  placeholder="Inserisci l'età"
                  required
                />
              </div>

              {/* Peso */}
              <div className="space-y-2">
                <Label htmlFor="peso">Peso</Label>
                <Input
                  id="peso"
                  name="peso"
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  placeholder="Inserisci il peso"
                  required
                />
              </div>

              {/* Altezza */}
              <div className="space-y-2">
                <Label htmlFor="altezza">Altezza</Label>
                <Input
                  id="altezza"
                  name="altezza"
                  type="number"
                  step="0.01"
                  value={altezza}
                  onChange={(e) => setAltezza(e.target.value)}
                  placeholder="Inserisci l'altezza in metri"
                  required
                />
              </div>

              {/* Sesso */}
              <div className="space-y-2">
                <Label htmlFor="sesso">Sesso</Label>
                <select
                  id="sesso"
                  name="sesso"
                  value={sesso}
                  onChange={(e) => setSesso(e.target.value)}
                  className="w-full bg-background border border-gym-border p-2 rounded"
                  required
                >
                  <option value="">Seleziona</option>
                  <option value="Uomo">Uomo</option>
                  <option value="Donna">Donna</option>
                </select>
              </div>

              {/* Attività */}
              <div className="space-y-2">
                <Label htmlFor="attivita">Attività</Label>
                <select
                  id="attivita"
                  name="attivita"
                  value={attivita}
                  onChange={(e) => setAttivita(e.target.value)}
                  className="w-full bg-background border border-gym-border p-2 rounded"
                  required
                >
                  <option value="">Seleziona</option>
                  <option value="Sedentario">Sedentario</option>
                  <option value="Leggero">Leggero</option>
                  <option value="Moderato">Moderato</option>
                  <option value="Intenso">Intenso</option>
                  <option value="Molto Intenso">Molto Intenso</option>
                </select>
              </div>

              {/* Obiettivo */}
              <div className="space-y-2">
                <Label htmlFor="obbiettivo">Obiettivo</Label>
                <select
                  id="obbiettivo"
                  name="obbiettivo"
                  value={obbiettivo}
                  onChange={(e) => setObbiettivo(e.target.value)}
                  className="w-full bg-background border border-gym-border p-2 rounded"
                  required
                >
                  <option value="">Seleziona</option>
                  <option value="Dimagrimento">Dimagrimento</option>
                  <option value="Massa Muscolare">Massa Muscolare</option>
                  <option value="Mantenimento">Mantenimento</option>
                </select>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium text-center">
                  {error}
                </p>
              )}

              {/* Bottone invio */}
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3" size="lg" type="submit">
                INVIA
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompletaProfilo;
