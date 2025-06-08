"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";

type Disponibilite = {
  id?: number;
  jourSemaine: string;
  heureDebut: string;
  heureFin: string;
  disponible: boolean;
  mode: string;
  estExceptionnelle: boolean;
  dateExceptionnelle: string;
  veterinaireId?: number;
};

const jours = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];

const DisponibilitePage = () => {
  const { user, token } = useAuth();
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    heureDebut: "",
    heureFin: "",
    mode: "",
    disponible: true,
    estExceptionnelle: false,
    dateExceptionnelle: "",
  });

  const fetchDisponibilites = async () => {
    if (!user || user.role !== "VETERINAIRE") return;

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/disponibilites/veterinaire/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Erreur de chargement des disponibilités");

      const data = await response.json();
      setDisponibilites(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (day: string) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({
      heureDebut: "",
      heureFin: "",
      mode: "",
      disponible: true,
      estExceptionnelle: false,
      dateExceptionnelle: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !user || user.role !== "VETERINAIRE") return;

    const newDisponibilite: Disponibilite = {
      jourSemaine: selectedDay,
      heureDebut: form.heureDebut,
      heureFin: form.heureFin,
      disponible: form.disponible,
      mode: form.mode,
      estExceptionnelle: form.estExceptionnelle,
      dateExceptionnelle: form.dateExceptionnelle || "1899-11-30",
      veterinaireId: user.id,
    };

try {
  const res = await fetch("http://localhost:3001/disponibilites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newDisponibilite),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erreur lors de l’ajout");
  }

  fetchDisponibilites(); // refresh
  handleCloseModal();
} catch (err) {
  console.error(err);
  alert(err); // Or use your own modal / toast system
}

  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette disponibilité ?"))
      return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/disponibilites/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      fetchDisponibilites();
    } catch (err) {
      console.error(err);
    }
  };

  const getDisponibilitesForDay = (day: string) =>
    disponibilites.filter(
      (d) => d.jourSemaine.toLowerCase() === day.toLowerCase()
    );

  useEffect(() => {
    fetchDisponibilites();
  }, [user]);

  if (!user || user.role !== "VETERINAIRE") {
    return (
      <div className="p-6 text-red-600 font-semibold">
        Accès restreint : cette page est réservée aux vétérinaires.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-indigo-500">Mes disponibilités</h1>
{loading ? (
  <p>Chargement des disponibilités...</p>
) : (
  <div className="overflow-x-auto">
   <table className="min-w-full bg-white border border-gray-200 shadow rounded-xl">
  <thead className="bg-gradient-to-r from-purple-50 to-indigo-100 text-blue-800">
    <tr>
      <th className="text-left px-4 py-3 border font-semibold">Jour</th>
      <th className="text-left px-4 py-3 border font-semibold">Disponible</th>
      <th className="text-left px-4 py-3 border font-semibold">Heures</th>
      <th className="text-left px-4 py-3 border font-semibold">Mode</th>
      <th className="text-left px-4 py-3 border font-semibold">Exceptionnelle</th>
      <th className="text-left px-4 py-3 border font-semibold">Date</th>
      <th className="text-left px-4 py-3 border font-semibold">Supprimer</th>
      <th className="text-left px-4 py-3 border font-semibold">Actions</th>
    </tr>
  </thead>
  <tbody>
    {jours.map((day, index) => {
      const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-50";
      const dispos = getDisponibilitesForDay(day);
      return dispos.length > 0 ? (
        dispos.map((dispo, idx) => (
          <tr key={`${day}-${idx}`} className={`${rowBg} border-t`}>
            {idx === 0 && (
              <td
                rowSpan={dispos.length}
                className="px-4 py-3 border font-semibold capitalize  align-top"
              >
                {day}
              </td>
            )}
            <td className="px-4 py-3 border">
              <span className={`text-sm font-semibold px-2 py-1 rounded-full ${dispo.disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {dispo.disponible ? "Oui" : "Non"}
              </span>
            </td>
            <td className="px-4 py-3 border text-gray-800">
              {dispo.heureDebut} – {dispo.heureFin}
            </td>
            <td className="px-4 py-3 border text-gray-700 capitalize">{dispo.mode || "—"}</td>
            <td className="px-4 py-3 border">
              <span className={`text-xs px-2 py-1 rounded-full ${dispo.estExceptionnelle ? "bg-yellow-100 text-yellow-800" : "text-gray-500"}`}>
                {dispo.estExceptionnelle ? "Oui" : "—"}
              </span>
            </td>
            <td className="px-4 py-3 border">
              {dispo.dateExceptionnelle !== "1899-11-30"
                ? dispo.dateExceptionnelle
                : "—"}
            </td>
            <td className="px-4 py-3 border">
              <button
                className="text-red-500 hover:text-red-700 transition text-sm"
                onClick={() => handleDelete(dispo.id)}
              >
                🗑 Supprimer
              </button>
            </td>
            {idx === 0 && (
              <td rowSpan={dispos.length} className="px-4 py-3 border align-top">
                <button
                  className="text-blue-600 hover:underline text-sm hover:text-blue-800 transition"
                  onClick={() => handleOpenModal(day)}
                >
                  ➕ Ajouter
                </button>
              </td>
            )}
          </tr>
        ))
      ) : (
        <tr key={`${day}-none`} className={`${rowBg} border-t`}>
          <td className="px-4 py-3 border capitalize ">{day}</td>
          <td colSpan={5} className="px-4 py-3 border text-gray-400 italic">
            Aucune disponibilité
          </td>
          <td className="px-4 py-3 border"></td>
          <td className="px-4 py-3 border">
            <button
              className="text-blue-600 hover:underline text-sm"
              onClick={() => handleOpenModal(day)}
            >
              ➕ Ajouter
            </button>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>

  </div>
)}


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
  <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md border border-blue-100">
  <h2 className="text-xl font-semibold mb-4 text-blue-800">
    Ajouter une disponibilité – <span className="capitalize">{selectedDay}</span>
  </h2>
  <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
    <div>
      <label className="block text-sm font-medium mb-1">Heure début</label>
      <input
        type="time"
        required
        value={form.heureDebut}
        onChange={(e) => setForm({ ...form, heureDebut: e.target.value })}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Heure fin</label>
      <input
        type="time"
        required
        value={form.heureFin}
        onChange={(e) => setForm({ ...form, heureFin: e.target.value })}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Mode</label>
      <select
        value={form.mode}
        onChange={(e) => setForm({ ...form, mode: e.target.value })}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
      >
        <option value="">—</option>
        <option value="online">En ligne</option>
        <option value="inplace">Présentiel</option>
        <option value="both">Les deux</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Date exceptionnelle</label>
      <input
        type="date"
        value={form.dateExceptionnelle}
        onChange={(e) =>
          setForm({ ...form, dateExceptionnelle: e.target.value })
        }
        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
      />
    </div>
    <div className="flex justify-end gap-3 pt-4">
      <button
        type="button"
        onClick={handleCloseModal}
        className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 transition"
      >
        Annuler
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Sauvegarder
      </button>
    </div>
  </form>
</div>

        </div>
      )}
    </div>
  );
};

export default DisponibilitePage;
