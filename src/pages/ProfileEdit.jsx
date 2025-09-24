import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import { Edit, Save, X } from "lucide-react";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetch("http://localhost/endopoints/profilo.php", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setFormData(data); // inizializza form con i dati
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore fetch profilo:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSave = async () => {
    try {
      const formDataObj = new FormData();
      formDataObj.append("Email", formData.Email);
      formDataObj.append("Nome", formData.Nome);
      formDataObj.append("Peso", formData.Peso);
      formDataObj.append("Altezza", formData.Altezza);
      formDataObj.append("Eta", formData.Eta);
      formDataObj.append("Sesso", formData.Sesso);
      formDataObj.append("Obbiettivo", formData.Obbiettivo);
      formDataObj.append("Attivita", formData.Attivita);

      if (formData.file instanceof File) {
        formDataObj.append("file", formData.file);
      }

      const res = await fetch(
        "http://localhost/endopoints/profilo_update.php",
        {
          method: "POST",
          credentials: "include",
          body: formDataObj,
        }
      );

      const data = await res.json();
      if (data.success) {
        setUserData({
          ...formData,
          file: data.file || userData.file,
        });
        setEditing(false);
        alert("Profilo aggiornato con successo!");
      } else {
        alert("Errore: " + data.error);
      }
    } catch (err) {
      console.error("Errore aggiornamento profilo:", err);
    }
  };

  if (loading)
    return <p className="text-center py-8">Caricamento profilo...</p>;
  if (!userData)
    return <p className="text-center py-8">Nessun dato disponibile</p>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gym-card border-gym-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-primary">
              DATI PROFILO
            </CardTitle>
            {!editing ? (
              <Button
                onClick={() => setEditing(true)}
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                MODIFICA
              </Button>
            ) : (
              <div className="space-x-2">
                <Button
                  onClick={handleSave}
                  className="bg-primary text-white"
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  SALVA
                </Button>
                <Button
                  onClick={() => setEditing(false)}
                  variant="destructive"
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  ANNULLA
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {!editing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <p>
                  <strong>Nome:</strong> {userData.Nome}
                </p>
                <p>
                  <strong>Email:</strong> {userData.Email}
                </p>
                <p>
                  <strong>Peso:</strong> {userData.Peso}
                </p>
                <p>
                  <strong>Altezza:</strong> {userData.Altezza}
                </p>
                <p>
                  <strong>Età:</strong> {userData.Eta}
                </p>
                <p>
                  <strong>Genere:</strong> {userData.Sesso}
                </p>
                <p>
                  <strong>Obbiettivo:</strong> {userData.Obbiettivo || "N/D"}
                </p>
                <p>
                  <strong>Livello di Attività:</strong> {userData.Attivita || "N/D"}
                </p>
                <p>
                  <strong>Foto Profilo:</strong>
                </p>
                <img
                  src={`http://localhost/findMyPT/Images/${userData.file}`}
                  alt="Foto profilo"
                  className="w-24 h-24 rounded-full border mt-2"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium">Nome</label>
                  <Input
                    name="Nome"
                    value={formData.Nome || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <Input
                    name="Email"
                    value={formData.Email || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Peso (kg)</label>
                  <Input
                    name="Peso"
                    value={formData.Peso || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Altezza (cm)
                  </label>
                  <Input
                    name="Altezza"
                    value={formData.Altezza || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Età</label>
                  <Input
                    name="Eta"
                    value={formData.Eta || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Genere</label>
                  <select
                    name="Sesso"
                    value={formData.Sesso || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Seleziona...</option>
                    <option value="Uomo">Uomo</option>
                    <option value="Donna">Donna</option>
                  </select>
                </div>

                {/* Nuovi campi */}
                <div>
                  <label className="block text-sm font-medium">Obbiettivo</label>
                  <select
                    name="Obbiettivo"
                    value={formData.Obbiettivo || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Seleziona...</option>
                    <option value="Dimagrimento">Dimagrimento</option>
                    <option value="Massa Muscolare">Massa Muscolare</option>
                    <option value="Mantenimento">Mantenimento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Livello di Attività</label>
                  <select
                    name="Attivita"
                    value={formData.Attivita || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Seleziona...</option>
                    <option value="Sedentario">Sedentario</option>
                    <option value="Leggero">Leggero</option>
                    <option value="Moderato">Moderato</option>
                    <option value="Intenso">Intenso</option>
                    <option value="Molto Intenso">Molto Intenso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Foto Profilo</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
