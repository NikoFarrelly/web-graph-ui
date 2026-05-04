import type {GraphData} from 'react-force-graph-3d';

import type {GraphQueue, GraphQueueItem, LinkNode, WebNode} from './types.ts';

type GradientStartStop = {
  start: string;
  stop: string;
};

export function buildGraphQueue(
  {nodes, links}: GraphData<WebNode, LinkNode>,
  {start, stop}: GradientStartStop,
): GraphQueue {
  const result: GraphQueue = [];
  let accumulated: GraphQueueItem = {nodes: [], links: [], depth: 0};
  const totalNodeLength = nodes.length - 1;

  const node: WebNode = nodes[0];
  if (!node?.url) throw new Error('No Nodes provided');

  const depthMap = {[node.id]: 0};
  for (const link of links) {
    depthMap[link.target] = (depthMap[link.source] ?? 0) + 1;
  }

  const getColours = createGradient(start, stop, depthMap[totalNodeLength] + 1);
  for (let i = 0; i < nodes.length; i++) {
    const depth = depthMap[nodes[i].id] ?? 0;
    const depthColour = getColours(depth);
    const updatedNode = {...nodes[i], color: depthColour};

    accumulated = {
      nodes: [...accumulated.nodes, updatedNode],
      links: links[i - 1] ? [...accumulated.links, links[i - 1]] : [...accumulated.links],
      depth,
    };
    result.push(accumulated);
  }

  return result;
}

type GradientRGB = {
  r: number;
  g: number;
  b: number;
};

/**
 * Given two hex colours (start/stop), a linear gradient is made across steps.
 *
 * @param start
 * @param stop
 * @param steps
 */
export function createGradient(
  start: string,
  stop: string,
  steps: number,
): (step: number) => string {
  const parseColor = (hex: string): GradientRGB => {
    const clean = hex.replace('#', '');
    const full =
      clean.length === 3
        ? clean
            .split('')
            .map(c => c + c)
            .join('')
        : clean;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
    };
  };

  const toHex = ({r, g, b}: GradientRGB) =>
    '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');

  const a = parseColor(start);
  const b = parseColor(stop);

  const gradient: string[] = Array.from({length: steps}, (_, i) => {
    const t = steps === 1 ? 0 : i / (steps - 1);
    return toHex({
      r: Math.round(a.r + (b.r - a.r) * t),
      g: Math.round(a.g + (b.g - a.g) * t),
      b: Math.round(a.b + (b.b - a.b) * t),
    });
  });

  return (step: number) => gradient[Math.min(Math.max(step, 0), steps - 1)];
}
