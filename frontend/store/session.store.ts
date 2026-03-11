export interface SessionUser {
  id: string;
  email: string;
}

export interface SessionState {
  user: SessionUser | null;
  isAuthenticated: boolean;
}

type SessionListener = (state: SessionState) => void;

const sessionState: SessionState = {
  user: null,
  isAuthenticated: false
};

const sessionListeners = new Set<SessionListener>();

export function getSessionState() {
  return sessionState;
}

export function setSessionUser(user: SessionUser | null) {
  sessionState.user = user;
  sessionState.isAuthenticated = Boolean(user);
  const snapshot = { ...sessionState };
  sessionListeners.forEach((listener) => listener(snapshot));
}

export function subscribeSession(listener: SessionListener) {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
}
