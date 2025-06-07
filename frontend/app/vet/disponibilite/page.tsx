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
      <h1 className="text-2xl font-bold mb-6">Mes disponibilités</h1>
{loading ? (
  <p>Chargement des disponibilités...</p>
) : (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
      <thead className="bg-gray-100">
        <tr>
          <th className="text-left px-4 py-2 border">Jour</th>
          <th className="text-left px-4 py-2 border">Disponible</th>
          <th className="text-left px-4 py-2 border">Heures</th>
          <th className="text-left px-4 py-2 border">Mode</th>
          <th className="text-left px-4 py-2 border">Exceptionnelle</th>
          <th className="text-left px-4 py-2 border">Date Exceptionnelle</th>
          <th className="text-left px-4 py-2 border">Supprimer</th>
          <th className="text-left px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {jours.map((day) => {
          const dispos = getDisponibilitesForDay(day);
          return dispos.length > 0 ? (
            dispos.map((dispo, idx) => (
              <tr key={`${day}-${idx}`} className="border-t">
                {/* Jour column */}
                {idx === 0 && (
                  <td
                    rowSpan={dispos.length}
                    className="px-4 py-2 border font-semibold capitalize align-top"
                  >
                    {day}
                  </td>
                )}

                <td className="px-4 py-2 border">
                  {dispo.disponible ? (
                    <span className="text-green-600 font-medium">Oui</span>
                  ) : (
                    <span className="text-red-600 font-medium">Non</span>
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {dispo.heureDebut} - {dispo.heureFin}
                </td>
                <td className="px-4 py-2 border">{dispo.mode || "—"}</td>
                <td className="px-4 py-2 border">
                  {dispo.estExceptionnelle ? "Oui" : "Non"}
                </td>
                <td className="px-4 py-2 border">
                  {dispo.dateExceptionnelle !== "1899-11-30"
                    ? dispo.dateExceptionnelle
                    : "—"}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={() => handleDelete(dispo.id)}
                  >
                    🗑 Supprimer
                  </button>
                </td>

                {/* Actions column */}
                {idx === 0 && (
                  <td
                    rowSpan={dispos.length}
                    className="px-4 py-2 border align-top"
                  >
                    <button
                      className="text-blue-600 hover:underline text-sm mb-2 block"
                      onClick={() => handleOpenModal(day)}
                    >
                      ➕ Ajouter disponibilité
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr key={`${day}-none`} className="border-t">
              <td className="px-4 py-2 border capitalize">{day}</td>
              <td colSpan={5} className="px-4 py-2 border text-gray-500">
                Aucune disponibilité
              </td>
              <td className="px-4 py-2 border"></td>
              <td className="px-4 py-2 border">
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => handleOpenModal(day)}
                >
                  ➕ Ajouter disponibilité
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
          <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Ajouter disponibilité pour{" "}
              <span className="capitalize">{selectedDay}</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Heure début
                </label>
                <input
                  type="time"
                  required
                  value={form.heureDebut}
                  onChange={(e) =>
                    setForm({ ...form, heureDebut: e.target.value })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Heure fin
                </label>
                <input
                  type="time"
                  required
                  value={form.heureFin}
                  onChange={(e) =>
                    setForm({ ...form, heureFin: e.target.value })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mode</label>
                <select
                  value={form.mode}
                  onChange={(e) => setForm({ ...form, mode: e.target.value })}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="">—</option>
                  <option value="online">En ligne</option>
                  <option value="inplace">Présentiel</option>
                  <option value="both">Les deux</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date exceptionnelle (optionnelle)
                </label>
                <input
                  type="date"
                  value={form.dateExceptionnelle}
                  onChange={(e) =>
                    setForm({ ...form, dateExceptionnelle: e.target.value })
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-1 border rounded text-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-blue-600 text-white rounded"
                >
                  Ajouter
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
