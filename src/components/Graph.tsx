import {type RefObject, useEffect} from 'react';
import ForceGraph3D, {
  type ForceGraphMethods,
  type GraphData,
  type NodeObject,
} from 'react-force-graph-3d';

import type {FarrellyGraphConfig, WebNode} from '../types.ts';
import './Graph.css';

const onNodeClick = (
  node: NodeObject<WebNode>,
  ref: RefObject<NodeObject<WebNode>>,
  onClick?: () => void,
): void => {
  // TODO provide a camera 'reset' if node clicked.
  if (!ref.current || !node.x || !node.y || !node.z) return;
  // setIsOrbiting(false);
  if (onClick) onClick();
  // Aim at node from outside it
  const distance = 40;
  const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

  ref.current.cameraPosition(
    {x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio}, // new position
    node, // lookAt ({ x, y, z })
    5000, // ms transition duration
  );
};

const graphNodeConfig = {
  // TODO (need ref passed)
  onNodeClick: onNodeClick,
  nodeLabel: (node: NodeObject<WebNode>) => (
    <div style={{borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
      <p>{node.url}</p>
      {/*<p>{node.name}</p>*/}
    </div>
  ),
  // nodeVal: (node: NodeObject<WebNode>) => node.val,
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
  controlType: 'trackball',
  dagMode: 'td',
  dagLevelDistance: 100,
  // d3AlphaDecay={0.01}
  // d3VelocityDecay={0.25}
  // d3AlphaMin={0.001}
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
  graphData: GraphData | undefined;
  ref: RefObject<ForceGraphMethods | undefined>;
  isPaused: boolean;
  config: FarrellyGraphConfig;
}) => {
  const graphConfig = getGraphConfig(isPaused, config);
  // TODO non-reactive code, move out of useEffect.
  useEffect(() => {
    if (ref?.current) {
      const controls = ref.current.controls();
      // @ts-ignore prop exists, type for it doesn't.
      controls.noPan = true;
    }
  }, []);

  return (
    <div className={'graph'}>
      <ForceGraph3D
        // @ts-ignore TODO
        graphData={graphData}
        className={'graph'}
        // @ts-ignore TODO
        ref={ref}
        {...graphConfig}
      />
    </div>
  );
};
