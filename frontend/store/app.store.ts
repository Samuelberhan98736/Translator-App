export interface AppStoreState {
  sidebarOpen: boolean;
}

type Listener = (state: AppStoreState) => void;

const state: AppStoreState = {
  sidebarOpen: true
};

const listeners = new Set<Listener>();

export function getAppStoreState() {
  return state;
}

export function setSidebarOpen(sidebarOpen: boolean) {
  state.sidebarOpen = sidebarOpen;
  const snapshot = { ...state };
  listeners.forEach((listener) => listener(snapshot));
}

export function subscribeAppStore(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
