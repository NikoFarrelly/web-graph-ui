import React, {memo} from 'react';

import PauseIcon from '../assets/Pause.png';
import PlayIcon from '../assets/Play.png';
import RestartIcon from '../assets/Restart.png';
import StopIcon from '../assets/Stop.png';
import {useControls} from '../hooks/useControls.ts';
import type {VisibilityState} from '../hooks/usePlaybackVisibility.ts';
import {type Playback, PlaybackEnum} from '../types.ts';
import './Controls.css';

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

export const Controls = memo(
  ({
    playbackState,
    playbackToggle,
    orbitToggle,
    isOrbiting,
    controlsState,
  }: {
    playbackState: Playback;
    playbackToggle: () => void;
    orbitToggle: () => void;
    isOrbiting: boolean;
    controlsState: VisibilityState;
  }) => {
    const {onPlaybackToggle, onOrbitToggle} = useControls(playbackToggle, orbitToggle);
    const {imgPath, altText, title} = getPlaybackButton(playbackState);

    const orbitingTitle = isOrbiting ? 'Stop orbit' : 'Start orbit';
    const orbitTitle =
      playbackState === PlaybackEnum.Playing ? 'Orbit disabled during playback' : orbitingTitle;

    return (
      <div className={`controls ${controlsState}`} tabIndex={-1}>
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
  },
);

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
