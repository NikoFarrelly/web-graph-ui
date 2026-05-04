import {useEffect, useRef, useSyncExternalStore} from 'react';

import {
  type VisibilityConfig,
  type VisibilityState,
  createVisibilityStore,
} from '../stores/createVisibilityStore.ts';

export function useControlsVisibility(
  wrapperRef: React.RefObject<HTMLElement | null>,
  config: VisibilityConfig,
): VisibilityState {
  const storeRef = useRef<ReturnType<typeof createVisibilityStore> | null>(null);
  storeRef.current ??= createVisibilityStore(config);

  const store = storeRef.current;

  const visibilityClass = useSyncExternalStore<VisibilityState>(
    store.subscribe,
    store.getSnapshot,
    () => 'controls-visible',
  );

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    store.attachListeners(el);
    return () => {
      return store.detachListeners(el);
    };
  }, []);

  return visibilityClass;
}
