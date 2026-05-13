import {type RefObject, useCallback} from 'react';
import ForceGraph3D, {
  type ForceGraphMethods,
  type GraphData,
  type NodeObject,
} from 'react-force-graph-3d';

import type {FarrellyGraphConfig, LinkNode, WebNode} from '../types.ts';
import './Graph.css';

const graphNodeConfig = {
  nodeLabel: (node: NodeObject<WebNode>) => (
    <div
      style={{
        minWidth: '50px',
        width: '100%',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        padding: '4px',
        opacity: '0.75',
      }}
    >
      <p style={{color: 'white', wordBreak: 'break-all'}}>{node.url}</p>
    </div>
  ),
  nodeVal: 10,
  nodeColor: (node: NodeObject<WebNode>) => node.color,
  nodeResolution: 20,
  nodeRelSize: 4,
  nodeOpacity: 1,
  nodeAutoColorBy: 'user',
  enableNodeDrag: false,
};

const graphLinkConfig = (isPaused: boolean) => ({
  linkDirectionalParticleSpeed: isPaused ? 0.001 : 0.01, // stops the particles from node to node
  linkDirectionalParticles: 5,
  linkDirectionalParticleColor: () => '#FF99DD',
  linkDirectionalParticleWidth: 4,
  linkWidth: 5,
  linkColor: () => '#9AD7FD99',
  linkCurvature: 0.05,
  linkOpacity: 0.5,
});

const reactForceConfig = (config: FarrellyGraphConfig) => ({
  // dimensions
  width: config.width,
  height: config.height,
  // style
  backgroundColor: '#FF99DD66',
  // graph look
  numDimensions: 3,
  // UI & interaction
  showNavInfo: false,
  enableNavigationControls: true,
});

const getGraphConfig = (isPaused: boolean, config: FarrellyGraphConfig) => ({
  ...graphNodeConfig,
  ...graphLinkConfig(isPaused),
  ...reactForceConfig(config),
});

export const Graph = ({
  graphData,
  ref,
  isPaused,
  config,
}: {
  graphData: GraphData<WebNode, LinkNode> | undefined;
  ref: RefObject<ForceGraphMethods | undefined>;
  isPaused: boolean;
  config: FarrellyGraphConfig;
}) => {
  const graphConfig = getGraphConfig(isPaused, config);

  const noPanRef = useCallback(
    (graph: ForceGraphMethods) => {
      if (graph) {
        const controls = graph.controls();
        // react-force-graph type def for 'controls()' is just 'object' but, it's actually the ThreeJS controls object.
        // @ts-expect-error requires upstream type fix.
        controls.noPan = true;
        ref.current = graph; // keep the ref in sync
      }
    },
    [ref],
  );

  return (
    <div className={'graph'}>
      <ForceGraph3D
        graphData={graphData}
        className={'graph'}
        // @ts-expect-error react-force-graph defines ref as (deprecated) MutableRef which doesn't cover a callback, should be using React.Ref
        ref={noPanRef}
        {...graphConfig}
      />
    </div>
  );
};
