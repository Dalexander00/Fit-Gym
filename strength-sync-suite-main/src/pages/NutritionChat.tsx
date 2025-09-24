import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";

interface Message {
  role: "user" | "bot";
  content: string;
}

const NutritionChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // Messaggio iniziale del bot
  useEffect(() => {
    const welcomeMessage: Message = {
      role: "bot",
      content: "Ciao! Vuoi calcolare il tuo BMI stimato?",
    };
    setMessages([welcomeMessage]);
  }, []);

  const getCategoryMessage = (category: string, bmi: number, obeseClass?: string) => {
    switch (category.toLowerCase()) {
      case "underweight":
        return `Il tuo BMI è ${bmi.toFixed(
          2
        )}. Risulti **Sottopeso** 🟡.\nPotresti aver bisogno di aumentare l’apporto calorico e valutare una dieta più nutriente.`;
      case "normal weight":
        return `Il tuo BMI è ${bmi.toFixed(
          2
        )}. Sei in un intervallo **Normale** 🟢.\nOttimo! Mantieni uno stile di vita equilibrato con attività fisica regolare.`;
      case "overweight":
        return `Il tuo BMI è ${bmi.toFixed(
          2
        )}. Risulti **Sovrappeso** 🟠.\nConsidera di monitorare l’alimentazione e aumentare l’attività fisica.`;
      case "obese":
        return `Il tuo BMI è ${bmi.toFixed(2)}. Risulti in **Obesità** 🔴${
          obeseClass ? ` (${obeseClass})` : ""
        }.\nSarebbe consigliabile rivolgersi a un nutrizionista o medico per un piano personalizzato.`;
      default:
        return `Il tuo BMI è ${bmi.toFixed(
          2
        )}. Categoria non specificata ⚪.`;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("http://localhost/endopoints/chatbot_nutrition.php", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success && data.bmi) {
        const botMessage: Message = {
          role: "bot",
          content: getCategoryMessage(data.weightCategory, data.bmi, data.obeseClass),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const botMessage: Message = {
          role: "bot",
          content: `Si è verificato un errore durante il calcolo: ${data.error || ""}`,
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (err) {
      const botMessage: Message = {
        role: "bot",
        content: "Errore di connessione al server.",
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 flex flex-col h-[80vh]">
        {/* Box della chat bianco */}
        <div className="flex-1 overflow-y-auto flex flex-col space-y-3 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-xs break-words whitespace-pre-line ${
                m.role === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-black self-start"
              }`}
            >
              {m.content}
            </div>
          ))}
        </div>

        <div className="flex mt-4 space-x-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Scrivi qui la tua domanda..."
            className="flex-1 border border-gray-300 rounded-lg p-2"
          />
          <Button onClick={handleSend} className="bg-blue-500 hover:bg-blue-600 text-white">
            Invia
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NutritionChat;
