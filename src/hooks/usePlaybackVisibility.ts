import {useState, useRef, useCallback, useMemo, useEffect} from 'react';

import type {VisibilityState} from '../types.ts';

interface UsePlaybackControlsReturn {
  controlsState: VisibilityState;
  controlsProps: {
    onMouseEnter: () => void;
    onTouchStart: () => void;
    onMouseLeave: () => void;
    onTouchEnd: () => void;
  };
}

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

interface VisibilityConfig {
  idleTimeout?: number;
  fadeOutDuration?: number;
  fadeInDuration?: number;
  throttleMs?: number;
}
const VISIBILITY_CONFIG: VisibilityConfig = {
  idleTimeout: 5000,
  fadeOutDuration: 1500,
  fadeInDuration: 250,
  throttleMs: 100,
};

let hasRun = false;

export function usePlaybackVisibility(): UsePlaybackControlsReturn {
  const [controlsState, setControlsState] = useState<VisibilityState>('controls-visible');
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOverControlsRef = useRef(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setControlsState(STATES.FADING_OUT);

      fadeTimer.current = setTimeout(() => {
        setControlsState(STATES.HIDDEN);
      }, VISIBILITY_CONFIG.fadeOutDuration);
    }, VISIBILITY_CONFIG.idleTimeout);
  }, [clearHideTimer]);

  const handleControlsMouseEnter = useCallback(() => {
    isOverControlsRef.current = true;
    clearHideTimer();
    if (controlsState !== STATES.VISIBLE) setControlsState(STATES.FADING_IN);
  }, [clearHideTimer, controlsState]);

  const handleControlsMouseLeave = useCallback(() => {
    isOverControlsRef.current = false;
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    if (!hasRun) {
      scheduleHide();
      hasRun = true;
    }
  }, [scheduleHide]);

  return useMemo(
    () => ({
      controlsState,
      controlsProps: {
        onMouseEnter: handleControlsMouseEnter,
        onTouchStart: handleControlsMouseEnter,
        onMouseLeave: handleControlsMouseLeave,
        onTouchEnd: handleControlsMouseLeave,
        onMouseMove: handleControlsMouseEnter,
      },
    }),
    [controlsState, handleControlsMouseEnter, handleControlsMouseLeave],
  );
}
