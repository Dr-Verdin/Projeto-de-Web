/**
 * Cache local do estado de like para community posts.
 * O backend não retorna `likedByMe` na listagem nem expõe GET /community-posts/:id,
 * então persistimos o estado no localStorage para sobreviver a reloads.
 *
 * Chave: `community_likes:{userId}`
 * Valor: Set de postIds que o usuário curtiu
 */

const PREFIX = "community_likes:";

function getKey(userId: string) {
  return `${PREFIX}${userId}`;
}

function loadSet(userId: string): Set<string> {
  try {
    const raw = localStorage.getItem(getKey(userId));
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveSet(userId: string, set: Set<string>) {
  try {
    localStorage.setItem(getKey(userId), JSON.stringify([...set]));
  } catch {
    // quota exceeded — ignora silenciosamente
  }
}

export function isLiked(userId: string, postId: string): boolean {
  return loadSet(userId).has(postId);
}

export function setLiked(userId: string, postId: string, liked: boolean) {
  const set = loadSet(userId);
  if (liked) {
    set.add(postId);
  } else {
    set.delete(postId);
  }
  saveSet(userId, set);
}
