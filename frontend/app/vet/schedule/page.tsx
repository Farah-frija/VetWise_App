"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAuth } from "@/components/auth-provider";

type RendezVous = {
  id: number;
  date: string;
  heure: string;
  motif: string;
  type: string;
  proprietaire: {
    nom: string;
    prenom: string;
  };
};

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  color: string;
  extendedProps: {
    motif: string;
    type: string;
    proprietaire: string;
    heure: string;
    date: string;
  };
};

const typeColors: Record<string, string> = {
  inplace: "#6e70c5",     // orange-500
    online: "#eeb549",       // blue-500

};


export default function SchedulePage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/rendezvous/confirmed/veterinaire/${user.id}`)
      .then((res) => res.json())
      .then((data: RendezVous[]) => {
        const calendarEvents = data.map((rdv) => {
          const start = new Date(`${rdv.date}T${rdv.heure}`);
          const type = rdv.type.toLowerCase();
          return {
            id: String(rdv.id),
            title: `${rdv.proprietaire.prenom} ${rdv.proprietaire.nom} (${rdv.heure})`,
            start,
            color: typeColors[type] || "#E5E7EB",
            extendedProps: {
              motif: rdv.motif,
              type: rdv.type,
              proprietaire: `${rdv.proprietaire.prenom} ${rdv.proprietaire.nom}`,
              heure: rdv.heure,
              date: rdv.date,
            },
          };
        });
        setEvents(calendarEvents);
      });
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-500">
        Planning des Rendez-vous
      </h1>

      <FullCalendar
        timeZone="local"
        slotMinTime="08:00:00"

        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        events={events}
        eventClick={(info) => {
          const props = info.event.extendedProps;
          setSelectedEvent({
            id: info.event.id,
            title: info.event.title,
            start: info.event.start!,
            color: info.event.backgroundColor,
            extendedProps: {
              motif: props.motif,
              type: props.type,
              proprietaire: props.proprietaire,
              heure: props.heure,
              date: props.date,
            },
          });
        }}
        eventDidMount={(info) => {
          // applique la couleur en fond, pour qu’elle soit visible
          info.el.style.backgroundColor = info.event.backgroundColor;
          info.el.style.color = "white";
          info.el.style.border = "none";
          info.el.style.borderRadius = "6px";
          info.el.style.padding = "4px";
        }}
        height="auto"
      />

      {/* MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setSelectedEvent(null)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-indigo-500 mb-2">Détails du Rendez-vous</h2>
            <p><strong>Propriétaire :</strong> {selectedEvent.extendedProps.proprietaire}</p>
            <p><strong>Type :</strong> {selectedEvent.extendedProps.type}</p>
            <p><strong>Motif :</strong> {selectedEvent.extendedProps.motif}</p>
            <p><strong>Date :</strong> {selectedEvent.extendedProps.date}</p>
            <p><strong>Heure :</strong> {selectedEvent.extendedProps.heure}</p>
          </div>
        </div>
      )}
    </div>
  );
}
