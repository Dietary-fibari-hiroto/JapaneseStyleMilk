// シンプルにメモリ管理。DBを使う場合はORM・DB接続処理をここに入れる
type RoundSession = {
  id: string;
  active: boolean;
  messages: { speaker: string; text: string }[];
};

const roundSessions = new Map<string, RoundSession>();

export function createRoundSession(): string {
  const id = generateUniqueId(); // UUIDなど
  roundSessions.set(id, { id, active: true, messages: [] });
  return id;
}

export function addMessageToRound(sessionId: string, speaker: string, text: string): boolean {
  const session = roundSessions.get(sessionId);
  if (!session || !session.active) return false;
  session.messages.push({ speaker, text });
  return true;
}

export function endRoundSession(sessionId: string): boolean {
  const session = roundSessions.get(sessionId);
  if (!session) return false;
  session.active = false;
  return true;
}

export function getRoundSession(sessionId: string): RoundSession | undefined {
  return roundSessions.get(sessionId);
}

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9); //簡易UUID
}
