"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const IMAGE_BASE_PATH = "http://localhost/Images/";

export default function PurchasePage() {
  const [ptId, setPtId] = useState(null);
  const [idNutrizionista, setIdNutrizionista] = useState(null);
  const [serviceType, setServiceType] = useState(null); // "trainer" o "nutritionist"
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ptIdParam = params.get("pt_id");
    const idNutrizionistaParam = params.get("idNutrizionista");
    
    if (ptIdParam) {
      setPtId(Number(ptIdParam));
      setServiceType("trainer");
    } else if (idNutrizionistaParam) {
      setIdNutrizionista(Number(idNutrizionistaParam));
      setServiceType("nutritionist");
    }
  }, []);

  useEffect(() => {
    if (!ptId && !idNutrizionista) return;
    
    setLoading(true);
    setError(null);
    
    // Determina quale endpoint chiamare
    const endpoint = serviceType === "trainer" 
      ? "http://localhost/endopoints/trainers.php"
      : "http://localhost/endopoints/nutrizionisti.php";
    
    const targetId = serviceType === "trainer" ? ptId : idNutrizionista;
    const idField = serviceType === "trainer" ? "pt_id" : "idNutrizionista";

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        const professional = data.find((x) => Number(x[idField]) === Number(targetId));
        if (professional) {
          setProfessional(professional);
        } else {
          setError(
            serviceType === "trainer" 
              ? "Trainer non trovato" 
              : "Nutrizionista non trovato"
          );
        }
      })
      .catch((err) => 
        setError(
          `Errore nel caricamento del ${serviceType === "trainer" ? "trainer" : "nutrizionista"}: ${err.message}`
        )
      )
      .finally(() => setLoading(false));
  }, [ptId, idNutrizionista, serviceType]);

  const handleFakePayment = async (e) => {
  e.preventDefault();
  setProcessing(true);
  setError(null);

  try {
    // Simula pagamento
    await new Promise((r) => setTimeout(r, 1200));

    // Chiama endpoint abbonamento.php
    const endpoint = serviceType === "trainer" 
      ? "http://localhost/endopoints/abbonamento.php"
      : "http://localhost/endopoints/abbonamento_nutritionist.php";

    const bodyData = serviceType === "trainer"
      ? { idPT: Number(ptId) }
      : { idNutritionist: Number(idNutrizionista) };

    const res = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      alert(`Acquisto effettuato con successo! Ora hai accesso ai servizi del ${serviceType === "trainer" ? "trainer" : "nutrizionista"}.`);
      window.location.href = serviceType === "trainer" ? "/trainers" : "/nutritionists";
    } else {
      setError(data.error || "Errore nel processare l'acquisto");
    }
  } catch (err) {
    setError("Errore di rete: " + err.message);
  } finally {
    setProcessing(false);
  }
};


  const getProfessionalDisplayName = () => {
    if (!professional) return "";
    return professional.Nome || professional.name || "Professionista";
  };

  const getProfessionalRate = () => {
    if (!professional) return "N/D";
    return professional.Tariffa || professional.tariffa || professional.rate || "N/D";
  };

  const getProfessionalAvailability = () => {
    if (!professional) return "N/D";
    return professional.availability || professional.disponibilita || "Lun-Sab 09:00-19:00";
  };

  const getProfessionalSpecialization = () => {
    if (!professional) return null;
    return professional.specialization || professional.specializzazione || null;
  };

  const getServiceTypeDisplay = () => {
    return serviceType === "trainer" ? "Personal Trainer" : "Nutrizionista";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">
          Pagamento - Conferma abbonamento {getServiceTypeDisplay()}
        </h1>

        <Card className="mb-6">
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Caricamento...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : professional ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20 border-4 border-primary">
                    <AvatarImage 
                      src={IMAGE_BASE_PATH + (professional.file || professional.image)} 
                      alt={getProfessionalDisplayName()} 
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                      {getProfessionalDisplayName().split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold">{getProfessionalDisplayName()}</h2>
                      <Badge variant="secondary">
                        {getServiceTypeDisplay()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><span className="font-medium">Tariffa:</span> {getProfessionalRate()}</p>
                      <p><span className="font-medium">Disponibilità:</span> {getProfessionalAvailability()}</p>
                      {getProfessionalSpecialization() && (
                        <p><span className="font-medium">Specializzazione:</span> {getProfessionalSpecialization()}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informazioni aggiuntive sul servizio */}
                <div className="bg-muted/50 rounded-lg p-4 mt-4">
                  <h3 className="font-medium mb-2">Cosa include il servizio:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {serviceType === "trainer" ? (
                      <>
                        <li>• Programmi di allenamento personalizzati</li>
                        <li>• Sessioni di coaching individuale</li>
                        <li>• Monitoraggio dei progressi</li>
                        <li>• Supporto continuo via chat</li>
                      </>
                    ) : (
                      <>
                        <li>• Piani nutrizionali personalizzati</li>
                        <li>• Consulenze individuali</li>
                        <li>• Monitoraggio dell'alimentazione</li>
                        <li>• Supporto continuo via chat</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">
                  Seleziona un {serviceType === "trainer" ? "trainer" : "nutrizionista"} dalla lista per procedere al pagamento.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {professional && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Dettagli di pagamento</h3>
              
              <form onSubmit={handleFakePayment} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-foreground">
                      Numero carta (fittizio)
                    </span>
                    <input 
                      required 
                      type="text" 
                      placeholder="4242 4242 4242 4242" 
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2" 
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <label>
                      <span className="text-sm font-medium text-foreground">Scadenza</span>
                      <input 
                        required 
                        type="text" 
                        placeholder="MM/AA" 
                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2" 
                      />
                    </label>

                    <label>
                      <span className="text-sm font-medium text-foreground">CVC</span>
                      <input 
                        required 
                        type="text" 
                        placeholder="123" 
                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2" 
                      />
                    </label>
                  </div>

                  <label>
                    <span className="text-sm font-medium text-foreground">Nome sul conto</span>
                    <input 
                      required 
                      type="text" 
                      placeholder="Mario Rossi" 
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2" 
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90" 
                    disabled={processing || !professional}
                    size="lg"
                  >
                    {processing ? "Elaborazione..." : `PAGA ${getProfessionalRate()}`}
                  </Button>

                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => window.history.back()}
                    size="lg"
                  >
                    Annulla
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            ⚠️ Questa è una pagina di pagamento fittizia per scopi dimostrativi. 
            Nessuna transazione reale viene effettuata e nessun dato di pagamento viene memorizzato.
          </p>
        </div>
      </div>
    </div>
  );
}