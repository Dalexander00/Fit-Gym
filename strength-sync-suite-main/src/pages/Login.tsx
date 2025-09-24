import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { useState } from "react";

const Login = () => {
  //const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
  e.preventDefault();
  const res = await fetch("http://localhost/endopoints/login.php", {
    method: "POST",
    body: new FormData(e.target),
    credentials: 'include'
  });
  const data = await res.json();
  
  if (data.success) {
    if (data.user_type === "cliente") {
      navigate("/profile");
    } else if (data.user_type === "PT") {
      navigate("/PTHome");
    } else {
      setError("Tipo di utente non riconosciuto");
    }
  } else {
    setError(data.error);
  }
};

  return (
    <form onSubmit={handleLogin}>
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

        <Card className="bg-gym-card border-gym-border shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-primary">LOGIN</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  className="bg-background border-gym-border focus:border-primary focus:ring-primary"
                  placeholder="Inserisci la tua email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  className="bg-background border-gym-border focus:border-primary focus:ring-primary"
                  placeholder="Inserisci la password"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
              size="lg"
              type="submit"
            >
              LOGIN
            </Button>

            {error && (
                <p className="text-red-500 text-sm font-medium text-center">
                  {error}
                </p>
              )}

            <div className="text-center space-y-2 text-sm">
              <div className="text-muted-foreground">
                non hai un account?{" "}
                <Link to="/registrazione" className="text-primary hover:underline">
                  Registrati
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </form>
  );
};

export default Login;