//COMPONENTS
import { Avatar } from "../Avatar";

//TYPES
import type { Contact } from "@/types/system";

export const ContactItem: React.FC<{ contact: Contact; selected?: boolean; onClick?: () => void }> = ({ contact, selected, onClick }) => {
  const { user, read, last_message, last_time } = contact;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 flex items-center gap-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400
        ${selected ? "bg-indigo-50" : "hover:bg-gray-50"}`}
    >
      <div className="flex-shrink-0">
        <Avatar user={user} size={10} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
          <p className="text-xs text-gray-400 ml-2">{contact.lastTime ?? ""}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500 truncate">{contact.lastMessage ?? "..."}</p>
          {contact.unread ? (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-600 text-white">
              {contact.unread}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
};
