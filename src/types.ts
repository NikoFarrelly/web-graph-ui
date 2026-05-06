import type {GraphData} from 'react-force-graph-3d';

export type GraphQueueItem = {
  depth: number;
} & WCGraphData;

export type GraphQueue = GraphQueueItem[];

export type WCGraphData = GraphData<WCWebNode, LinkNode>;

export interface LinkNode {
  target: number;
  source: number;
}

export interface WebNode {
  id: number;
  name: string;
  url: string;
}

export interface WCWebNode extends WebNode {
  color: string;
}

export type PlayPause = 'Pause' | 'Play';
export type PlaybackState = PlayPause | 'Restart';

export type FarrellyGraphConfig = {
  width: number;
  height: number;
}
