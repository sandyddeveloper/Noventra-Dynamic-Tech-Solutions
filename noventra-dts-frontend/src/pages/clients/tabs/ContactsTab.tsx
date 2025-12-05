// src/pages/clients/tabs/ContactsTab.tsx
import React, { useState } from "react";
import { Plus, Phone, Mail, Trash2, Pencil, UserCircle } from "lucide-react";
import type { Client } from "../../../types/client.types";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "Decision Maker" | "Finance" | "Tech Lead" | "Support";
}

interface Props {
  client: Client;
}

const mockContacts: Record<string, Contact[]> = {
  [ "CLT-NOVENTRA" ]: [
    {
      id: "cnt1",
      name: "Vimal Jain",
      email: "vimal@noventra.com",
      role: "Decision Maker",
      phone: "+91 98989 12121"
    },
    {
      id: "cnt2",
      name: "Roshni Iyer",
      email: "roshni@noventra.com",
      role: "Tech Lead",
    }
  ],
};

const ContactsTab: React.FC<Props> = ({ client }) => {
  const [contacts, setContacts] = useState<Contact[]>(
    mockContacts[client.code] ?? []
  );

  const deleteContact = (id: string) =>
    setContacts((c) => c.filter((x) => x.id !== id));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4 text-xs text-slate-200">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
          Key Contacts
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500"
        >
          <Plus size={13} /> Add contact
        </button>
      </div>

      {contacts.length === 0 ? (
        <p className="text-slate-400 text-center py-6">
          No contacts added yet for {client.name}.
        </p>
      ) : (
        <div className="space-y-2">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="flex justify-between items-center rounded-xl bg-slate-900 px-4 py-2"
            >
              <div className="flex items-center gap-3">
                <UserCircle size={24} className="text-slate-400" />
                <div>
                  <div className="text-sm text-slate-100 font-medium">
                    {c.name}
                  </div>
                  <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
                    <span className="inline-flex gap-1">
                      <Mail size={10} /> {c.email}
                    </span>
                    {c.phone && (
                      <span className="inline-flex gap-1">
                        <Phone size={10} /> {c.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="h-6 w-6 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700">
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => deleteContact(c.id)}
                  className="h-6 w-6 flex items-center justify-center rounded-full bg-red-900/60 hover:bg-red-800"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactsTab;
