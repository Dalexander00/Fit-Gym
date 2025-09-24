import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Dumbbell } from "lucide-react";

const PTNavigation = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/PTHome" },
    { name: "Clienti", path: "/PTClients" },
    { name: "Esercizi", path: "/Exercises" },
  ];

  return (
    <nav className="bg-card border-b border-gym-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/PTHome" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">
              FIT-<span className="text-primary">GYM</span>
              <span className="text-sm text-muted-foreground ml-2">PT</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Profile Button */}
          <div className="flex items-center space-x-4">
            <Link to="/PTProfile">
              <Button variant="outline" size="sm" className="border-gym-border hover:bg-primary hover:text-primary-foreground">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PTNavigation;