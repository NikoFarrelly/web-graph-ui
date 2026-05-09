export type VisibilityState =
  | 'controls-visible'
  | 'controls-fading-in'
  | 'controls-fading-out'
  | 'controls-hidden';

type VisibilityStates = {
  VISIBLE: VisibilityState;
  FADING_IN: VisibilityState;
  FADING_OUT: VisibilityState;
  HIDDEN: VisibilityState;
};
const STATES: VisibilityStates = {
  VISIBLE: 'controls-visible',
  FADING_IN: 'controls-fading-in',
  FADING_OUT: 'controls-fading-out',
  HIDDEN: 'controls-hidden',
};

export interface VisibilityConfig {
  /** ms of inactivity before fade-out begins. Default: 5000 */
  idleTimeout?: number;
  /** ms for the fade-out transition. Default: 1500 */
  fadeOutDuration?: number;
  /** ms for the fade-in transition. Default: 250 */
  fadeInDuration?: number;
  /** min ms between interaction handler calls. Default: 100 */
  throttleMs?: number;
}

export interface VisibilityStore {
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => VisibilityState;
  attachListeners: (el: HTMLElement) => void;
  detachListeners: (el: HTMLElement) => void;
}

export function createVisibilityStore(props: VisibilityConfig): VisibilityStore {
  const {
    idleTimeout = 5000,
    fadeInDuration = 1500,
    fadeOutDuration = 250,
    throttleMs = 100,
  } = props;
  let currentState: VisibilityState = STATES.VISIBLE;

  const listeners: Set<() => void> = new Set();
  let idleTimer: ReturnType<typeof setTimeout> | undefined = undefined;
  let fadeTimer: ReturnType<typeof setTimeout> | undefined = undefined;
  let lastInteraction: number = 0;

  function notify() {
    listeners.forEach(l => l());
  }

  function setState(next: VisibilityState): void {
    if (next === currentState) return;
    currentState = next;
    notify();
  }

  function clearTimers() {
    clearTimeout(idleTimer);
    clearTimeout(fadeTimer);
  }

  function startIdleTimer() {
    clearTimers();
    idleTimer = setTimeout(() => {
      setState(STATES.FADING_OUT);
      fadeTimer = setTimeout(() => {
        setState(STATES.HIDDEN);
      }, fadeOutDuration);
    }, idleTimeout);
  }

  /** Throttled — ignores calls within throttleMs of the last one. */
  function handleInteraction() {
    const now = Date.now();
    if (now - lastInteraction < throttleMs) return;
    lastInteraction = now;

    clearTimers();
    setState(STATES.FADING_IN);
    fadeTimer = setTimeout(() => {
      setState(STATES.VISIBLE);
    }, fadeInDuration);
    startIdleTimer();
  }

  /** useSyncExternalStore — subscribe */
  function subscribe(onStoreChange: () => void): () => void {
    listeners.add(onStoreChange);
    return () => listeners.delete(onStoreChange);
  }

  /** useSyncExternalStore — getSnapshot */
  function getSnapshot() {
    return currentState;
  }

  /** Called once when the wrapper element is ready. */
  function attachListeners(el: HTMLElement): void {
    el.addEventListener('mousemove', handleInteraction);
    el.addEventListener('touchstart', handleInteraction, {passive: true});
    el.addEventListener('keydown', handleInteraction);
    startIdleTimer();
  }

  function detachListeners(el: HTMLElement): void {
    el.removeEventListener('mousemove', handleInteraction);
    el.removeEventListener('touchstart', handleInteraction);
    el.removeEventListener('keydown', handleInteraction);
    clearTimers();
  }

  return {subscribe, getSnapshot, attachListeners, detachListeners};
}
