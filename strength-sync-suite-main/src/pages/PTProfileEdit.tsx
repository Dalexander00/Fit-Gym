import { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PTNavigation from "@/components/PTNavigation";
import { Save, X } from "lucide-react";

interface PTData {
  Nome: string;
  Email: string;
  AnniDiEsperienza: string;
  Tariffa: string;
  Recapito: string;
  TitoloDiStudio: string;
  file?: string | File;
}

const EditProfilePT = () => {
  const [formData, setFormData] = useState<PTData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/endopoints/getPTProfile.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFormData(data.data);
        } else {
          alert("Errore: " + data.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore fetch profilo PT:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      const formBody = new FormData();
      formBody.append("Nome", formData.Nome);
      formBody.append("Email", formData.Email);
      formBody.append("AnniDiEsperienza", formData.AnniDiEsperienza);
      formBody.append("Tariffa", formData.Tariffa);
      formBody.append("Recapito", formData.Recapito);
      formBody.append("TitoloDiStudio", formData.TitoloDiStudio);

      if (formData.file instanceof File) {
        formBody.append("file", formData.file);
      }

      const res = await fetch("http://localhost/endopoints/profiloPT_update.php", {
        method: "POST",
        credentials: "include",
        body: formBody,
      });

      const data = await res.json();
      if (data.success) {
        alert("Profilo aggiornato con successo!");
        if (data.file) {
          setFormData({ ...formData, file: data.file });
        }
      } else {
        alert("Errore: " + data.error);
      }
    } catch (err) {
      console.error("Errore aggiornamento profilo PT:", err);
    }
  };

  if (loading) return <p className="text-center py-8">Caricamento profilo...</p>;
  if (!formData) return <p className="text-center py-8">Nessun dato disponibile</p>;

  return (
    <div className="min-h-screen bg-background">
      <PTNavigation />

      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gym-card border-gym-border shadow-lg">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-primary">Modifica Profilo PT</CardTitle>
            <div className="space-x-2">
              <Button onClick={handleSave} className="bg-primary text-white" size="sm">
                <Save className="h-4 w-4 mr-2" /> Salva
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium">Nome</label>
                <Input name="Nome" value={formData.Nome} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <Input name="Email" value={formData.Email} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium">Anni di Esperienza</label>
                <Input name="AnniDiEsperienza" value={formData.AnniDiEsperienza} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium">Tariffa ($/mese)</label>
                <Input name="Tariffa" value={formData.Tariffa} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium">Recapito</label>
                <Input name="Recapito" value={formData.Recapito} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium">Titolo di Studio</label>
                <Input name="TitoloDiStudio" value={formData.TitoloDiStudio} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium">Foto Profilo</label>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
                {typeof formData.file === "string" && (
                  <img
                    src={`http://localhost/findMyPT/Images/${formData.file}`}
                    alt="Foto profilo PT"
                    className="w-24 h-24 rounded-full border mt-2"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfilePT;
