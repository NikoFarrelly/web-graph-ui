import {useEffect, useState} from 'react';
import type {NodeObject} from 'react-force-graph-3d';

import NotificationsEnabled from "../assets/Notifications.png?inline";
import NotificationsDisabled from '../assets/WhiteNotifications.png?inline';
import {FADE_TIME_CSS} from '../constants.ts';
import type {WCWebNode} from '../types.ts';
import './InfoPanel.css';

export const InfoPanel = ({
  node,
  index,
  depth,
  nodeSpeed,
}: {
  index: number;
  depth: number;
  node: NodeObject<WCWebNode> | undefined;
  nodeSpeed: number;
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!node) {
    console.log('No node, no info');
    return null;
  }

  const onHide = () => setIsVisible(prev => !prev);

  return (
    <div className={'info'}>
      <div className="info-controls">
        {index >= 0 && depth >= 0 && (
          <div className={'info-controls__info'}>
            <div className="info-controls__item" title={`Node count: ${index + 1}`}>
              <p className={'info-controls__text'}>Nodes: {index + 1}</p>
            </div>
            <div className="info-controls__item" title={`Graph depth: ${depth}`}>
              <p className={'info-controls__text'}>Depth: {depth}</p>
            </div>
          </div>
        )}

        <button
          onClick={onHide}
          className={'info-controls__button'}
          title={isVisible ? 'Hide notifications' : 'Show notifications'}
        >
          <div className={'info-controls__inner'}>
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

      <NodeInfoPanel node={node} nodeSpeed={nodeSpeed} key={index} isVisible={isVisible} />
    </div>
  );
};

const NodeInfoPanel = ({
  node,
  nodeSpeed,
  isVisible,
}: {
  node: NodeObject<{}>;
  nodeSpeed: number;
  isVisible: boolean;
}) => {
  const [phase, setPhase] = useState<'enter' | 'exit' | 'hidden'>('enter');

  useEffect(() => {
    if (!isVisible) return setPhase('hidden');

    const exitTimer = setTimeout(() => setPhase('exit'), nodeSpeed - FADE_TIME_CSS);
    return () => clearTimeout(exitTimer);
  }, [isVisible]);

  if (phase === 'hidden') return null;

  return (
    <div className={`info-panel ${phase}`} style={{borderLeftColor: node.color}}>
      <div className={'info-panel__node'}>
        <div className={'node'} style={{backgroundColor: node.color}} />
      </div>

      <div className={'info-panel__text'}>
        <p className={'title'}>{node.url}</p>
      </div>
    </div>
  );
};
