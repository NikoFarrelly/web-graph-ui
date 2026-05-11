/**
 * Combines all components into an exportable graph.
 */
import {useEffect, useRef} from 'react';
import type {ForceGraphMethods, GraphData, NodeObject} from 'react-force-graph-3d';

import {ADD_NODE_SPEED, FADE_TIME} from '../constants.ts';
import {useGraph} from '../hooks/useGraph.ts';
import {usePlaybackVisibility} from '../hooks/usePlaybackVisibility.ts';
import {useWindowSize} from '../hooks/useWindowSize.ts';
import {
  type FarrellyGraphConfig,
  type GraphQueue,
  type LinkNode,
  PlaybackEnum,
  type WCWebNode,
  type WebNode,
} from '../types.ts';
import {buildGraphQueue} from '../utils.ts';
import {Controls} from './Controls.tsx';
import {Graph} from './Graph.tsx';
import {InfoPanel} from './InfoPanel.tsx';

export interface FarrellyGraphProps {
  graphData: GraphData<WebNode, LinkNode>;
  beginPlayback: boolean;
  playbackFrom: 'start' | 'end';
  config?: FarrellyGraphConfig;
  onReady?: () => void;
}

const NODE_SPEED_MS = ADD_NODE_SPEED + FADE_TIME;
let isReady = false;

export const FarrellyGraph = ({
  graphData,
  beginPlayback = false,
  playbackFrom,
  config = {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  onReady,
}: FarrellyGraphProps) => {
  const graphQueue: GraphQueue = buildGraphQueue(graphData, {start: '#FF99DD', stop: '#9AD7FD'});

  const maxDimensions =
    config?.height && config?.width ? {height: config.height, width: config.width} : undefined;
  const dimensions = useWindowSize({horizontal: 32, vertical: 16}, maxDimensions);

  const graphRef = useRef<ForceGraphMethods>(undefined);
  const {controlsState, controlsProps} = usePlaybackVisibility();
  const {currGraphData, currGraphIndex, orbitToggle, playbackState, playbackToggle, isOrbiting} =
    useGraph(graphQueue, graphRef, NODE_SPEED_MS, beginPlayback, playbackFrom);
  const currNode: NodeObject<WCWebNode> | undefined =
    currGraphData?.nodes?.[currGraphIndex - 1] ?? undefined;
  const currDepth = currGraphData?.depth ? currGraphData.depth + 1 : 1;

  useEffect(() => {
    if (currNode && !isReady && onReady) {
      onReady();
      isReady = true;
    }
  }, [currNode, onReady]);

  return (
    <div {...controlsProps}>
      {beginPlayback && (
        <InfoPanel
          node={currNode}
          depth={currDepth}
          index={currGraphIndex}
          nodeSpeed={NODE_SPEED_MS}
        />
      )}
      {dimensions && (
        <Graph
          graphData={beginPlayback ? currGraphData : undefined}
          ref={graphRef}
          isPaused={playbackState === PlaybackEnum.Paused}
          config={dimensions}
        />
      )}
      <Controls
        orbitToggle={orbitToggle}
        playbackState={playbackState}
        playbackToggle={playbackToggle}
        isOrbiting={isOrbiting}
        controlsState={controlsState}
      />
    </div>
  );
};
