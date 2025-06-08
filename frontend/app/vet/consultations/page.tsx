"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";

interface Animal {
  nom: string;
  espece: string;
  proprietaire: Proprietaire;
}

interface Proprietaire {
  nom: string;
}

interface Rendezvous {
  type: string;
  motif: string;
}

interface Consultation {
  id: number;
  animal: Animal;
  rendezvous?: Rendezvous;
  dateConsultation: string;
  diagnostic: string;
  traitement: string;
  notes: string;
}

export default function VetConsultationsPage() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filtered, setFiltered] = useState<Consultation[]>([]);
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);

  const [editDiagnostic, setEditDiagnostic] = useState("");
  const [editTraitement, setEditTraitement] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultations/vet/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setConsultations(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Failed to fetch consultations:", err));
  }, [user]);

  useEffect(() => {
    let filteredData = consultations;

    if (search) {
      filteredData = filteredData.filter((c) =>
        c.animal.nom.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (ownerFilter) {
      filteredData = filteredData.filter((c) =>
        c.animal.proprietaire.nom.toLowerCase().includes(ownerFilter.toLowerCase())
      );
    }

    if (speciesFilter !== "all") {
      filteredData = filteredData.filter((c) => c.animal.espece === speciesFilter);
    }

    setFiltered(filteredData);
  }, [search, speciesFilter, ownerFilter, consultations]);

  const openEditModal = (consultation: Consultation) => {
    setEditingConsultation(consultation);
    setEditDiagnostic(consultation.diagnostic);
    setEditTraitement(consultation.traitement);
    setEditNotes(consultation.notes);
  };

  const handleUpdate = async () => {
    if (!editingConsultation) return;

    const updatedConsultation = {
      ...editingConsultation,
      diagnostic: editDiagnostic,
      traitement: editTraitement,
      notes: editNotes,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultations/${editingConsultation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedConsultation),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      const updated = await res.json();
    // Merge the updated values with previous consultation object
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === updated.id ? { ...c, ...updated } : c
      )
    );
      setEditingConsultation(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour de la consultation.");
    }
  };
const handleDelete = async (id: number) => {
  const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette consultation ?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultations/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Erreur lors de la suppression");

    // Mise à jour du state local
    setConsultations((prev) => prev.filter((c) => c.id !== id));
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la suppression de la consultation.");
  }
};

  return (
    <div className="p-6 space-y-6 bg-gray-20 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-indigo-500">Mes consultations</h1>
        <Link href="/vet/consultations/add">
          <Button className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
            <PlusCircle className="w-4 h-4" />
            Nouvelle consultation
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Rechercher par nom de l'animal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <Input
          placeholder="Filtrer par nom du propriétaire..."
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          className="w-64"
        />
        <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Filtrer par espèce" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les espèces</SelectItem>
            <SelectItem value="dog">Chien</SelectItem>
            <SelectItem value="cat">Chat</SelectItem>
            <SelectItem value="bird">Oiseau</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-indigo-200 bg-white">
        <table className="min-w-full text-sm text-left bg-white">
          <thead className="bg-indigo-100 text-indigo-900">
            <tr>
              <th className="px-4 py-2">Nom de l'animal</th>
              <th className="px-4 py-2">Espèce</th>
              <th className="px-4 py-2">Propriétaire</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Diagnostic</th>
              <th className="px-4 py-2">Traitement</th>
              <th className="px-4 py-2">Notes</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Motif</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t hover:bg-indigo-50">
                <td className="px-4 py-2 font-medium text-gray-800">{c.animal.nom}</td>
                <td className="px-4 py-2 text-gray-600">{c.animal.espece}</td>
                <td className="px-4 py-2 text-gray-600">{c.animal.proprietaire.nom || "-"}</td>
                <td className="px-4 py-2 text-gray-600">{format(new Date(c.dateConsultation), "PPP")}</td>
                <td className="px-4 py-2 text-gray-600">{c.diagnostic}</td>
                <td className="px-4 py-2 text-gray-600">{c.traitement}</td>
                <td className="px-4 py-2 text-gray-600">{c.notes}</td>
                <td className="px-4 py-2 text-gray-600">{c.rendezvous?.type || "-"}</td>
                <td className="px-4 py-2 text-gray-600">{c.rendezvous?.motif || "-"}</td>
                <td className="px-4 py-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="text-indigo-600 "
                        onClick={() => openEditModal(c)}
                      >
                        Modifier
                      </Button>
                    </DialogTrigger>
                    {editingConsultation?.id === c.id && (
                      <DialogContent className="bg-white">
                        <DialogHeader>
                          <DialogTitle>Modifier la consultation</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 bg-white">
                          <Input
                            value={editDiagnostic}
                            onChange={(e) => setEditDiagnostic(e.target.value)}
                            placeholder="Diagnostic"
                          />
                          <Input
                            value={editTraitement}
                            onChange={(e) => setEditTraitement(e.target.value)}
                            placeholder="Traitement"
                          />
                          <Input
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Notes"
                          />
                          <Button onClick={handleUpdate} className="bg-indigo-600 text-white hover:bg-indigo-700">
                            Enregistrer
                          </Button>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                    <Button
    variant="destructive"
    size="sm"
    className="text-red-600 border-red-300"

    onClick={() => handleDelete(c.id)}
  >
    Supprimer
  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
