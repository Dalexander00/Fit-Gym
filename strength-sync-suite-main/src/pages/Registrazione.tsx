import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Pagina di registrazione utente
const Registrazione = () => {
  // Stati per gestire i valori dei campi del form
  const [email, setEmail] = useState(""); 
  const [pass, setPass] = useState(""); 
  const [pass2, setPass2] = useState(""); 
  const [ruolo, setRuolo] = useState(""); 
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (pass2.length === pass.length && pass !== pass2) {
      setError("Le password non corrispondono");
    } else {
      setError("");
    }
  }, [pass, pass2]);

  // Funzione che gestisce l'invio del form
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (pass !== pass2) {
      setError("Le password non corrispondono");
      return;
    }

    // Invia i dati al backend
    const res = await fetch("http://localhost/endopoints/register.php", {
      method: "POST",
      body: new FormData(e.currentTarget),
      credentials: "include"
    });
    const data = await res.json();

    if (data.success) {
      if (ruolo === "cliente") {
        navigate("/completaProfilo");
      } else if (ruolo === "PT") {
        navigate("/completaProfiloPT");
      } else {
        navigate("/"); // fallback
      }
    } else {
      setError(data.error || "Si è verificato un errore");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo in alto */}
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
              REGISTRAZIONE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Inserisci la tua email"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Inserisci la password"
                  required
                />
              </div>

              {/* Conferma Password */}
              <div className="space-y-2">
                <Label htmlFor="password2">Conferma Password</Label>
                <Input
                  id="password2"
                  name="password2"
                  type="password"
                  value={pass2}
                  onChange={(e) => setPass2(e.target.value)}
                  placeholder="Ripeti la password"
                  required
                />
              </div>

              {/* Ruolo */}
              <div className="space-y-2">
                <Label htmlFor="ruolo">Ruolo</Label>
                <Select
                  value={ruolo}
                  name="user_type"
                  onValueChange={(val) => setRuolo(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="PT">Personal Trainer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bottone */}
              <Button className="w-full bg-primary hover:bg-primary/90" type="submit">
                REGISTRATI
              </Button>

              {error && (
                <p className="text-red-500 text-sm font-medium text-center">{error}</p>
              )}
            </form>

            {/* Link login */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                hai già un account?{" "}
              </span>
              <Link to="/login" className="text-primary hover:underline">
                Accedi
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registrazione;
