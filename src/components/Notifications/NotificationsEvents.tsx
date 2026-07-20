import React from "react";
import { ChevronRight, Settings, Trash2 } from "lucide-react";
import type { Notification } from "@/types/system";
import { formatearFechaShort } from "@/shared/utils/utilsfunctions";
import { useIsDesktop } from "@/shared/ui/useIsDesktop";
import { AsidePost } from "../AsidePost";

const EventCard: React.FC<{ event: Notification }> = ({ event }) => {
  const { title, description, time } = event;

  return (
    <article className="bg-surface p-3 rounded-2xl border-default flex flex-col gap-3" aria-label={`Evento: ${title}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-primary">{title}</h3>
          <p className="text-sm text-muted mt-1">{description}</p>
        </div>

        <button type="button" aria-label={`Eliminar evento ${title}`} className="p-2 rounded-md hover-surface-2 transition flex items-center justify-center">
          <Trash2 size={18} className="text-muted" />
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-muted">
        <time dateTime={time}>{formatearFechaShort({ fecha: time })}</time>

        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-[var(--color-primary-600)] transition"
          aria-label={`Ver post de ${title}`}
        >
          <span>Haz clic para continuar</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </article>
  );
};

const NotificationsEvents: React.FC = () => {
  const isDesktop = useIsDesktop(1024);

  const notifications: Notification[] = [
    {
      id: 1,
      user_id: 1,
      type: "event",
      time: "2025-11-01T09:30:00Z",
      email: "dario@gmail.com",
      title: "Evento de prueba",
      description: "Este es un evento de prueba",
    },
    {
      id: 2,
      user_id: 1,
      type: "event",
      time: "2025-11-02T11:00:00Z",
      email: "dario@gmail.com",
      title: "Charla: Nanomedicina",
      description: "Una charla sobre avances en nanomedicina",
    },
    {
      id: 3,
      user_id: 1,
      type: "event",
      time: "2025-11-05T14:00:00Z",
      email: "dario@gmail.com",
      title: "Mesa redonda",
      description: "Mesa redonda con expertos internacionales",
    },
  ];

  return (
    <div className="flex gap-8 items-start w-full">
      <section className="w-full max-w-[420px] flex-none md:flex-shrink-0" aria-labelledby="events-heading">
        <div className="md:sticky md:top-20" style={{ maxHeight: "calc(100vh - 5rem)" }}>
          <div className="bg-surface-2 border-default rounded-2xl overflow-hidden shadow-sm">
            {isDesktop && (
              <nav className="bg-surface-2 border-b border-[var(--color-border)] px-4">
                <div className="h-16 flex items-center justify-between">
                  <p id="events-heading" className="font-bold text-lg text-primary">
                    Eventos
                  </p>
                  <button aria-label="Ajustes de eventos" className="p-2 rounded-md hover:bg-surface transition">
                    <Settings size={18} className="text-primary" />
                  </button>
                </div>
              </nav>
            )}

            <div className="p-4 flex flex-col gap-4">
              {notifications.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex-1">{isDesktop && <AsidePost />}</div>
    </div>
  );
};

export default NotificationsEvents;
