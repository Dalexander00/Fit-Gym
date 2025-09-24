import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, Utensils, Dumbbell, Trophy } from "lucide-react";
import gymHeroImage from "@/assets/gym-hero.jpg";
import PTNavigation from "@/components/PTNavigation";

const PTHome = () => {
  const features = [
    {
      icon: Users,
      title: "Gestione Clienti",
      description: "Crea una scheda personalizzata per ogni singolo cliente",
      link: "/PTclients"
    },
    {
      icon: Trophy,
      title: "Biblioteca degli Esercizi",
      description: "Visualizza in maniera semplice e veloce tutti gli esercizi a disposizione",
      link: "/PTExercises"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PTNavigation />
      
      {/* Hero Section */}
      <section 
        className="relative py-32 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(33, 37, 41, 0.8), rgba(33, 37, 41, 0.8)), url(${gymHeroImage})`,
        }}
      >
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Fai crescere il tuo business da Personal Trainer
          </h1>
          <p className="text-xl text-foreground mb-8 max-w-2xl mx-auto">
            Gestisci i tuoi clienti, crea programmi di allenamento personalizzati e offri un servizio professionale con strumenti semplici e potenti.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gym-darker/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Un’unica piattaforma per organizzare i tuoi clienti, monitorare i progressi e condividere piani di allenamento e nutrizione in modo professionale.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="lg:col-span-2 flex justify-center">
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 bg-gym-card border-gym-border group w-full max-w-sm">
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

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Create your profile and get matched with the perfect trainer today.
          </p>
          <Link to="/profile">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PTHome;