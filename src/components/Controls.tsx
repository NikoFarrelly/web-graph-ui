import {type RefObject} from 'react';

import {useControls} from '../hooks/useControls.ts';
import {useControlsVisibility} from '../hooks/useControlsVisibility.ts';
import type {VisibilityConfig} from '../stores/createVisibilityStore.ts';
import type {PlaybackState} from '../types.ts';
import './Controls.css';

const VISIBILITY_CONFIG: VisibilityConfig = {
  idleTimeout: 5000,
  fadeOutDuration: 1500,
  fadeInDuration: 250,
  throttleMs: 100,
};

const getPlaybackButton = (
  playbackState: PlaybackState,
): {imgPath: string; altText: string; title: string} => {
  switch (playbackState) {
    // currently paused -> play
    case 'Pause':
      return {imgPath: '/Play.png', altText: 'Play', title: 'Play'};
    // current restart -> restart
    case 'Restart':
      return {imgPath: '/Restart.png', altText: 'Restart', title: 'Restart'};
    default:
    // currently playing -> pause
    case 'Play':
      return {imgPath: '/Pause.png', altText: 'Pause', title: 'Pause'};
  }
};

export const Controls = ({
  playbackState,
  playbackToggle,
  orbitToggle,
  visibilityRef,
  isOrbiting,
}: {
  playbackState: PlaybackState;
  playbackToggle: () => void;
  orbitToggle: () => void;
  visibilityRef: RefObject<HTMLDivElement | null>;
  isOrbiting: boolean;
}) => {
  const {onPlaybackToggle, onOrbitToggle} = useControls(playbackToggle, orbitToggle);
  const visibilityClass = useControlsVisibility(visibilityRef, VISIBILITY_CONFIG);
  const {imgPath, altText, title} = getPlaybackButton(playbackState);

  const orbitingTitle = isOrbiting ? 'Stop orbit' : 'Start orbit';
  const orbitTitle = playbackState === 'Play' ? 'Orbit disabled during playback' : orbitingTitle;

  return (
    <div className={`controls ${visibilityClass}`} ref={visibilityRef} tabIndex={0}>
      <div className={'controls__button-groups'}>
        <PlaybackButton
          onClick={onPlaybackToggle}
          imgPath={imgPath}
          altText={altText}
          title={title}
        />

        <PlaybackButton
          onClick={onOrbitToggle}
          imgPath={'/Stop.png'}
          altText={'Orbit'}
          className={'controls__orbit'}
          disabled={playbackState === 'Play'}
          spin={isOrbiting}
          title={orbitTitle}
        />
      </div>
    </div>
  );
};

interface PlaybackButtonProps {
  onClick: (e: any) => void;
  imgPath: string;
  altText: string;
  spin?: boolean;
  className?: string;
  disabled?: boolean;
  title?: string;
  dimensions?: {width: number; height: number};
}

const PlaybackButton = ({
  onClick,
  imgPath,
  altText,
  spin = false,
  className,
  disabled = false,
  title,
  dimensions = {width: 30, height: 30},
}: PlaybackButtonProps) => {
  return (
    <button className={'playback-button'} onClick={onClick} title={title} disabled={disabled}>
      <div className={`playback-button__inner ${disabled ? '' : 'playback-button__enabled'}`}>
        <img
          className={`playback-button__img ${className ?? ''} ${spin ? 'play-button__spin' : ''}`}
          src={imgPath}
          alt={altText}
          {...dimensions}
        />
      </div>
    </button>
  );
};
