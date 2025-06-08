"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle } from 'lucide-react';

const STATUT_COLORS: Record<string, string> = {
  pending: 'bg-yellow-200 text-yellow-900',
  confirmed: 'bg-sky-200 text-sky-900',
  completed: 'bg-emerald-200 text-emerald-900',
  canceled: 'bg-rose-200 text-rose-900',
};

export default function AppointmentsPage() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'pending' | 'confirmed' | 'completed' | 'all'>('pending');

  const fetchAppointments = async () => {
    if (!user?.id || !token) return;
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rendezvous/veterinaire/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous :', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: number) => {
    const confirmAction = window.confirm('Êtes-vous sûr de vouloir confirmer ce rendez-vous ?');
    if (!confirmAction) return;

    try {
      setConfirmingId(id);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rendezvous/${id}/confirm`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchAppointments();
    } catch (err) {
      console.error('Erreur lors de la confirmation :', err);
    } finally {
      setConfirmingId(null);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user?.id]);

  const filteredAppointments =
    filter === 'all' ? appointments : appointments.filter((a: any) => a.statut === filter);

  return (
    <div className="p-6">
      <h1 className="text-4xl  font-bold mb-6 text-center animate-fade-in bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
        Mes Rendez-vous
      </h1>

      <div className="mb-8 flex justify-center flex-wrap gap-4">
        {['pending', 'confirmed', 'completed', 'all'].map((stat) => (
          <Button
            key={stat}
            variant={filter === stat ? 'default' : 'outline'}
            onClick={() => setFilter(stat as any)}
          >
            {stat === 'pending'
              ? 'En attente'
              : stat === 'confirmed'
              ? 'Confirmés'
              : stat === 'completed'
              ? 'Terminés'
              : 'Tous'}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <p className="text-center text-gray-600">Aucun rendez-vous trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAppointments.map((rdv: any) => (
<Card
  key={rdv.id}
  className="border bg-white bg-opacity-90 transition-all duration-300"
>

<CardHeader className="bg-white border-b p-4 rounded-t-lg flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {rdv.date} à {rdv.heure?.slice(0, 5)} —{' '}
                  {rdv.type === 'online' ? 'En ligne' : 'Sur place'}
                </CardTitle>
                <Badge className={`${STATUT_COLORS[rdv.statut] || 'bg-gray-100 text-gray-800'} rounded-full px-3 py-1 text-sm`}>
                  {rdv.statut}
                </Badge>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <p><strong>Motif :</strong> {rdv.motif || 'Non précisé'}</p>
                <p><strong>Notes :</strong> {rdv.notes || 'Aucune'}</p>
                <p><strong>Client :</strong> {rdv.proprietaire?.prenom} {rdv.proprietaire?.nom}</p>
                <p><strong>Animal :</strong> {rdv.animaux?.[0]?.animal?.nom || 'Aucun'}</p>

                {rdv.statut === 'pending' && (
                  <div className="pt-4">
                    <Button
                      onClick={() => handleConfirm(rdv.id)}
                      className="w-full flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700"
                      disabled={confirmingId === rdv.id}
                    >
                      {confirmingId === rdv.id ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          Confirmation...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Confirmer le rendez-vous
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
