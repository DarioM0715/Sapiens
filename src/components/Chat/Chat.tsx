import { Avatar } from "../Avatar";
import type { Message } from "./Message";
import type { Contact } from "./Contact";
import { SideBarContacts } from "./SideBarContacts";
import { MessageBubble } from "./Message";

//ICONS
import { MoreHorizontal } from "lucide-react";
import { Paperclip } from "lucide-react";
import { Smile } from "lucide-react";

type Props = {
  contacts: Contact[];
  selectedContactId?: string | null;
  messages: Message[];
  composerValue?: string;
  onSelectContact?: (id: string) => void;
  onComposerChange?: (value: string) => void;
  onSend?: () => void;
};

export const Chat = ({ contacts = [], selectedContactId, onSend }: Props) => {
  const messagesSample: Message[] = [
    { id: "m1", from: "them", text: "Hola! ¿Cómo vas con el proyecto?", time: "09:00" },
    { id: "m2", from: "me", text: "Bien, avanzando con la vista de mensajería 💪", time: "09:01", status: "leido" },
    { id: "m3", from: "them", text: "Buenísimo! ¿Ya tienes algo para mostrar?", time: "09:03" },
    { id: "m4", from: "me", text: "Sí, tengo lista la estructura visual con Tailwind.", time: "09:04", status: "entregado" },
    { id: "m5", from: "me", text: "Luego le agrego la lógica con sockets.", time: "09:04", status: "enviado" },
    { id: "m6", from: "them", text: "Perfecto 🔥 Avísame cuando esté listo.", time: "09:06" },
  ];

  return (
    <div className="h-[calc(100vh-2rem)] max-h-[70vh] rounded-xl overflow-hidden grid grid-cols-12 border-default shadow-md">
      <SideBarContacts />

      {/* Main chat area */}
      <main className="col-span-8 md:col-span-9 lg:col-span-9 flex flex-col bg-gradient-to-b from-white to-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <Avatar
              user={{
                id: 0,
                name: contacts.find((c) => c.id === selectedContactId)?.name ?? "Contacto",
                avatar: contacts.find((c) => c.id === selectedContactId)?.avatarUrl,
              }}
              size={10}
            />
            <div>
              <p className="font-medium text-gray-900">{contacts.find((c) => c.id === selectedContactId)?.name ?? "Carlos"}</p>
              <p className="text-xs text-gray-500">En línea • Última vez hace 2h</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-md hover:bg-gray-100" aria-label="Información">
              <MoreHorizontal size={24} />
            </button>
          </div>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4" id="messages-container" role="log" aria-live="polite">
          {/* Example Date Separator */}
          <div className="text-center my-2">
            <span className="inline-block px-3 py-1 text-xs text-gray-500 bg-white rounded-full border border-gray-100">Hoy</span>
          </div>

          <div className="space-y-0.5">
            {messagesSample.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No hay mensajes todavía</div>
            ) : (
              messagesSample.map((m) => <MessageBubble key={m.id} msg={m} />)
            )}
          </div>
        </div>

        {/* Composer (visual only) */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <button type="button" className="p-2 rounded-md hover:bg-gray-100" aria-label="Adjuntar archivo" title="Adjuntar">
              <Paperclip size={24} />
            </button>
            <button type="button" className="p-2 rounded-md hover:bg-gray-100" aria-label="Emojis" title="Emojis">
              <Smile size={24} />
            </button>

            <div className="flex-1">
              <label htmlFor="composer" className="sr-only">
                Escribe un mensaje
              </label>
              <textarea
                id="composer"
                rows={1}
                placeholder="Escribe un mensaje..."
                className="w-full resize-none px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
              />
            </div>

            <button
              type="button"
              onClick={() => onSend && onSend()}
              className="ml-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Enviar mensaje"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-medium">Enviar</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
