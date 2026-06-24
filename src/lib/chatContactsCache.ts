/**
 * Cache local dos contatos com quem o usuário já iniciou conversa.
 * Necessário porque GET /messages/inbox só retorna mensagens recebidas —
 * contatos para quem você enviou mas que ainda não responderam não aparecem.
 *
 * Chave: `chat_contacts:{userId}`
 * Valor: array de { id, name, username, avatar }
 */

const PREFIX = "chat_contacts:";

export type CachedContact = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
};

function getKey(userId: string) {
  return `${PREFIX}${userId}`;
}

export function getContacts(userId: string): CachedContact[] {
  try {
    const raw = localStorage.getItem(getKey(userId));
    if (!raw) return [];
    return JSON.parse(raw) as CachedContact[];
  } catch {
    return [];
  }
}

export function addContact(userId: string, contact: CachedContact) {
  try {
    const contacts = getContacts(userId);
    // atualiza se já existe, senão adiciona
    const existing = contacts.findIndex((c) => c.id === contact.id);
    if (existing >= 0) {
      contacts[existing] = contact;
    } else {
      contacts.push(contact);
    }
    localStorage.setItem(getKey(userId), JSON.stringify(contacts));
  } catch {/* quota exceeded — ignora */}
}
