import React, {useCallback} from 'react';

export const useControls = (playbackToggle: () => void, orbitToggle: () => void) => {
  const onPlaybackToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (e) e.preventDefault();
      playbackToggle();
    },
    [playbackToggle],
  );

  const onOrbitToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    orbitToggle();
  };

  return {
    onPlaybackToggle,
    onOrbitToggle,
  };
};
