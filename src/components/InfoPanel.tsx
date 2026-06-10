import {useEffect, useState} from 'react';
import type {NodeObject} from 'react-force-graph-3d';

import NotificationsEnabled from '../assets/Notifications.png';
import NotificationsDisabled from '../assets/WhiteNotifications.png';
import {ADD_NODE_AND_FADE, FADE_TIME_CSS} from '../constants.ts';
import {type Dimensions, type Playback, PlaybackEnum, type WCWebNode} from '../types.ts';
import './InfoPanel.css';

export const InfoPanel = ({
  node,
  index,
  depth,
  dimensions,
  playbackState,
}: {
  index: number;
  depth: number;
  node: NodeObject<WCWebNode> | undefined;
  dimensions?: Dimensions;
  playbackState: Playback;
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!node) {
    console.log('No node, no info');
    return null;
  }

  const onHide = () => setIsVisible(prev => !prev);

  return (
    <div className={'info'} style={{width: dimensions?.width ?? '100%'}}>
      <div className={'info__container'}>
        <div className="info__controls">
          {index >= 0 && depth >= 0 && (
            <div className={'info__controls-container'}>
              <div className="info__item" title={`Node count: ${index}`}>
                <p className={'info__text'}>Nodes:</p>
                <p className={'info__text'}>{index}</p>
              </div>
              <div className="info__item" title={`Graph depth: ${depth}`}>
                <p className={'info__text'}>Depth:</p>
                <p className={'info__text'}>{depth}</p>
              </div>
            </div>
          )}

          <button
            onClick={onHide}
            className={'info__button'}
            title={isVisible ? 'Hide notifications' : 'Show notifications'}
          >
            <div className={'info__button-container'}>
              <img
                src={isVisible ? NotificationsEnabled : NotificationsDisabled}
                alt={'Notifications'}
                width={30}
                height={30}
                style={{opacity: isVisible ? 1 : 0.5}}
              />
            </div>
          </button>
        </div>

        <NodeInfoPanel
          node={node}
          key={index}
          isVisible={isVisible && playbackState === PlaybackEnum.Playing}
        />
      </div>
    </div>
  );
};

const NodeInfoPanel = ({node, isVisible}: {node: NodeObject; isVisible: boolean}) => {
  const [phase, setPhase] = useState<'enter' | 'exit' | 'hidden'>(isVisible ? 'enter' : 'hidden');

  useEffect(() => {
    if (phase === 'hidden') return;
    const exitTimer = setTimeout(() => setPhase('exit'), ADD_NODE_AND_FADE - FADE_TIME_CSS);
    return () => clearTimeout(exitTimer);
  }, [isVisible, phase]);

  if (phase === 'hidden') return null;

  return (
    <div className={`info-panel ${phase}`} style={{borderLeftColor: node.color}}>
      <div className={'info-panel__node'}>
        <div className={'node'} style={{backgroundColor: node.color}} />
      </div>

      <div className={'info-panel__text'}>
        <p className={'info-panel__title'}>{node.url}</p>
      </div>
    </div>
  );
};
