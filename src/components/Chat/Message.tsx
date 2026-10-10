import React from "react";
import { Avatar } from "../Avatar";

export type Message = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  avatarUrl?: string;
  status?: "enviando" | "enviado" | "entregado" | "leido";
};

export const MessageBubble: React.FC<{ msg: Message }> = ({ msg }) => {
  const isMe = msg.from === "me";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3 px-3`}>
      <div className={`max-w-[70%] flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
        {!isMe && (
          <div className="flex-shrink-0">
            <Avatar user={{ id: 0, name: "Contacto", avatar: msg.avatarUrl }} size={8} />
          </div>
        )}

        <div>
          <div
            className={`px-4 py-2 rounded-2xl leading-relaxed break-words ${
              isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-gray-100 text-gray-900 rounded-bl-none"
            } shadow-sm`}
            role="article"
            aria-label={isMe ? "Mensaje enviado" : "Mensaje recibido"}
          >
            <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
          </div>

          <div className={`text-xs mt-1 ${isMe ? "text-right text-gray-300" : "text-left text-gray-400"}`}>
            <span>{msg.time}</span>
            {isMe && msg.status ? <span className="ml-2">· {msg.status}</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
};
