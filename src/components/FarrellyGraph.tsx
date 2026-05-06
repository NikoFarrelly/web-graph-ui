/**
 * Combines all components into an exportable graph.
 */
import {useRef} from 'react';
import type {ForceGraphMethods, GraphData, NodeObject} from 'react-force-graph-3d';

import {ADD_NODE_SPEED, FADE_TIME} from '../constants.ts';
import {useGraph} from '../hooks/useGraph.ts';
import type {FarrellyGraphConfig, GraphQueue, LinkNode, WCWebNode, WebNode} from '../types.ts';
import {buildGraphQueue} from '../utils.ts';
import {Controls} from './Controls.tsx';
import {Graph} from './Graph.tsx';
import {InfoPanel} from './InfoPanel.tsx';

export interface FarrellyGraphProps {
  graphData: GraphData<WebNode, LinkNode>;
  beginPlayback: boolean;
  playbackFrom: 'start' | 'end';
  config?: FarrellyGraphConfig;
}

export const FarrellyGraph = ({
  graphData,
  beginPlayback = false,
  playbackFrom,
  config = {
    width: window.innerWidth,
    height: window.innerHeight,
  },
}: FarrellyGraphProps) => {
  const graphQueue: GraphQueue = buildGraphQueue(graphData, {start: '#FF99DD', stop: '#9AD7FD'});
  const visibilityRef = useRef<HTMLDivElement | null>(null);

  const graphRef = useRef<ForceGraphMethods>(undefined);
  const nodeSpeedMS = ADD_NODE_SPEED + FADE_TIME;
  const {currGraphData, currGraphIndex, orbitToggle, playbackState, playbackToggle, isOrbiting} =
    useGraph(graphQueue, graphRef, nodeSpeedMS, beginPlayback, playbackFrom);
  const currNode: NodeObject<WCWebNode> | undefined =
    currGraphData?.nodes?.[currGraphIndex] ?? undefined;
  const currDepth = currGraphData?.depth ? currGraphData.depth + 1 : 1;

  return (
    <div ref={visibilityRef}>
      <InfoPanel node={currNode} depth={currDepth} index={currGraphIndex} nodeSpeed={nodeSpeedMS} />
      <Graph
        graphData={beginPlayback ? currGraphData : undefined}
        ref={graphRef}
        isPaused={playbackState === 'Pause'}
        config={config}
      />
      <Controls
        orbitToggle={orbitToggle}
        visibilityRef={visibilityRef}
        playbackState={playbackState}
        playbackToggle={playbackToggle}
        isOrbiting={isOrbiting}
      />
    </div>
  );
};
