const SESSION_KEY = 'lovely_session_id';

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};
