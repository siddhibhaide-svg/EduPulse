const DATA_CHANGED_EVENT = 'edupulse:data-changed';

export function notifyDataChanged() {
  window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
}

export function subscribeToDataChanges(listener: () => void) {
  window.addEventListener(DATA_CHANGED_EVENT, listener);
  return () => window.removeEventListener(DATA_CHANGED_EVENT, listener);
}
