import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, Utensils, Dumbbell, Trophy } from "lucide-react";
import Navigation from "@/components/Navigation";
import gymHeroImage from "@/assets/gym-hero.jpg";

const Home = () => {
  const features = [
    {
      icon: Users,
      title: "Trainers Esperti",
      description: "Collegati con allenatori personali",
      link: "/trainers"
    },
    {
      icon: Dumbbell,
      title: "Allenamenti Personalizzati",
      description: "Ricevi piani di allenamento personalizzati in base ai tuoi obiettivi",
      link: "/training"
    },
    {
      icon: Utensils,
      title: "Piani Nutrizionali",
      description: "Ricevi piani pasto dettagliati progettati per il tuo stile di vita",
      link: "/nutrition"
    },
    {
      icon: Trophy,
      title: "Biblioteca degli Esercizi",
      description: "Impara la forma e la tecnica corrette per ogni esercizio",
      link: "/exercises"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative py-32 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(33, 37, 41, 0.8), rgba(33, 37, 41, 0.8)), url(${gymHeroImage})`,
        }}
      >
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Trasforma il tuo corpo
          </h1>
          <p className="text-xl text-foreground mb-8 max-w-2xl mx-auto">
            Unisciti a FIT-GYM e accedi a formatori professionisti, nutrizionisti e piani di allenamento personalizzati per raggiungere i tuoi obiettivi di fitness.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gym-darker/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Tutto ciò di cui hai bisogno per avere successo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 bg-gym-card border-gym-border group">
                  <feature.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;