'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';

export default function AjouterConsultation() {
  const { token, user } = useAuth();
  const veterinaireId = user?.id;
  const router = useRouter();

  const [rendezvous, setRendezvous] = useState<any[]>([]);
  const [selectedRdvId, setSelectedRdvId] = useState('');
  const [animaux, setAnimaux] = useState<any[]>([]);
  const [proprietaire, setProprietaire] = useState('');

  const [formData, setFormData] = useState({
    animalId: '',
    rendezvousId: '',
    dateConsultation: new Date().toISOString().split('T')[0],
    type: '',
    diagnostic: '',
    traitement: '',
    notes: '',
  });

  useEffect(() => {
      setFormData({
    animalId: '',
    rendezvousId: '',
    dateConsultation: new Date().toISOString().split('T')[0],
    type: '',
    diagnostic: '',
    traitement: '',
    notes: '',
  });
    if (!token || !veterinaireId) return;

const fetchRendezvous = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rendezvous/confirmed/today/veterinaire/${veterinaireId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0]?.proprietaire) {
      setRendezvous(data);
      const detail0 = data[0]; // Get the first rendezvous detail
      setProprietaire(`${detail0.proprietaire.prenom} ${detail0.proprietaire.nom}`);

    } else {
      console.log("Unexpected rendezvous response:", data);
      setRendezvous([]); // fallback to empty array
    }
  } catch (err) {
    console.error("Failed to fetch rendezvous:", err);
    setRendezvous([]); // fallback to empty array
  }
};


    fetchRendezvous();
  }, [token, veterinaireId]);

  const handleRdvChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rdvId = e.target.value;
    setSelectedRdvId(rdvId);
    setFormData({ ...formData, rendezvousId: rdvId });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rendezvous/${rdvId}/unconsulted-animals`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAnimaux(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      console.log("FormData soumis:", formData);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        rendezvousId: parseInt(formData.rendezvousId),
        animalId: parseInt(formData.animalId),
        veterinaireId,
      }),
    });

    if (res.ok) {
      alert('Consultation ajoutée !');
      router.push('/vet/consultations');
    } else {
      const error = await res.json();
      alert('Erreur : ' + error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white border mt-6">
      <h1 className="text-3xl font-extrabold text-indigo-500 mb-6">Ajouter une consultation</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection rendez-vous */}
{/* Sélection rendez-vous */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Rendez-vous du jour</label>

  {rendezvous.length === 0 && (
    <p className="text-red-600 mb-2 text-sm">Pas de rendez-vous programmé pour aujourd’hui.</p>
  )}

  <select
    name="rendezvousId"
    value={formData.rendezvousId}
    onChange={handleRdvChange}
    required
    className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
    disabled={rendezvous.length === 0}
  >
    <option value="">-- Sélectionner un rendez-vous --</option>
    
    {rendezvous.map(rdv => (
      <option key={rdv.id} value={rdv.id}>
        {rdv.date} {rdv.heure} - {rdv.proprietaire.prenom} {rdv.proprietaire.nom}
      </option>
    ))}
  </select>
</div>


        {selectedRdvId && (
          <>
            {/* Sélection animal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Animal</label>
              <select
                name="animalId"
                value={formData.animalId}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">-- Sélectionner un animal --</option>
                {animaux.map(animal => (
                  <option key={animal.id} value={animal.id}>
                    {animal.nom} ({animal.espece})
                  </option>
                ))}
              </select>
            </div>

            {/* Propriétaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Propriétaire</label>
              <input
                type="text"
                value={proprietaire}
                disabled
                className="w-full p-3 bg-gray-100 border rounded-lg"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de consultation</label>
              <input
                type="date"
                name="dateConsultation"
                value={formData.dateConsultation}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Type : présentiel / en ligne */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de consultation</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">-- Choisir le type --</option>
                <option value="Consultation">Présentiel</option>
                <option value="ConsultationEnLigne">En ligne</option>
              </select>
            </div>

            {/* Diagnostic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostic</label>
              <textarea
                name="diagnostic"
                value={formData.diagnostic}
                onChange={handleChange}
                required
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Traitement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Traitement</label>
              <textarea
                name="traitement"
                value={formData.traitement}
                onChange={handleChange}
                required
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (facultatif)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Enregistrer la consultation
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
