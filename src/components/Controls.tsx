import React, {type RefObject} from 'react';

import PauseIcon from '../assets/Pause.png';
import PlayIcon from '../assets/Play.png';
import RestartIcon from '../assets/Restart.png';
import StopIcon from '../assets/Stop.png';
import {useControls} from '../hooks/useControls.ts';
import {useControlsVisibility} from '../hooks/useControlsVisibility.ts';
import type {VisibilityConfig} from '../stores/createVisibilityStore.ts';
import {type Playback, PlaybackEnum} from '../types.ts';
import './Controls.css';

const VISIBILITY_CONFIG: VisibilityConfig = {
  idleTimeout: 5000,
  fadeOutDuration: 1500,
  fadeInDuration: 250,
  throttleMs: 100,
};

const getPlaybackButton = (
  playbackState: Playback,
): {imgPath: string; altText: string; title: string} => {
  switch (playbackState) {
    // currently paused -> play
    case PlaybackEnum.Paused:
      return {imgPath: PlayIcon, altText: 'Play', title: 'Play'};
    // current restart -> restart
    case PlaybackEnum.Finished:
      return {imgPath: RestartIcon, altText: 'Restart', title: 'Restart'};
    default:
    // currently playing -> pause
    // eslint-disable-next-line no-fallthrough
    case PlaybackEnum.Playing:
      return {imgPath: PauseIcon, altText: 'Pause', title: 'Pause'};
  }
};

export const Controls = ({
  playbackState,
  playbackToggle,
  orbitToggle,
  visibilityRef,
  isOrbiting,
}: {
  playbackState: Playback;
  playbackToggle: () => void;
  orbitToggle: () => void;
  visibilityRef: RefObject<HTMLDivElement | null>;
  isOrbiting: boolean;
}) => {
  const {onPlaybackToggle, onOrbitToggle} = useControls(playbackToggle, orbitToggle);
  const visibilityClass = useControlsVisibility(visibilityRef, VISIBILITY_CONFIG);
  const {imgPath, altText, title} = getPlaybackButton(playbackState);

  const orbitingTitle = isOrbiting ? 'Stop orbit' : 'Start orbit';
  const orbitTitle =
    playbackState === PlaybackEnum.Playing ? 'Orbit disabled during playback' : orbitingTitle;
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
          imgPath={StopIcon}
          altText={'Orbit'}
          className={'controls__orbit'}
          disabled={playbackState === PlaybackEnum.Playing}
          spin={isOrbiting}
          title={orbitTitle}
        />
      </div>
    </div>
  );
};

interface PlaybackButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  imgPath: string;
  altText: string;
  spin?: boolean;
  className?: string;
  disabled?: boolean;
  title?: string;
}

const PlaybackButton = ({
  onClick,
  imgPath,
  altText,
  spin = false,
  className,
  disabled = false,
  title,
}: PlaybackButtonProps) => {
  return (
    <button className={'playback-button'} onClick={onClick} title={title} disabled={disabled}>
      <div className={`playback-button__inner ${disabled ? '' : 'playback-button__enabled'}`}>
        <img
          className={`playback-button__img ${className ?? ''} ${spin ? 'play-button__spin' : ''}`}
          src={imgPath}
          alt={altText}
        />
      </div>
    </button>
  );
};
