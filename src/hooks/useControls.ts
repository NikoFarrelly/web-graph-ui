import {useCallback} from 'react';

export const useControls = (playbackToggle: () => void, orbitToggle: () => void) => {
  const onPlaybackToggle = useCallback(
    (e: any) => {
      if (e) e.preventDefault();
      playbackToggle();
    },
    [playbackToggle],
  );

  const onOrbitToggle = (e: any) => {
    if (e) e.preventDefault();
    orbitToggle();
  };

  return {
    onPlaybackToggle,
    onOrbitToggle,
  };
};
