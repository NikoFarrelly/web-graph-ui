import type { GraphData } from 'react-force-graph-3d';





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

export enum PlaybackEnum {
  Playing = 'Playing',
  Paused = 'Paused',
  Finished = 'Finished',
}
export type Playback = PlaybackEnum.Playing | PlaybackEnum.Paused | PlaybackEnum.Finished;
export enum OrbitEnum {
  Orbiting = 'Orbiting',
  Stationary = 'Stationary',
}
export type Orbit = OrbitEnum.Orbiting | OrbitEnum.Stationary;

export type FarrellyGraphConfig = {
  width: number;
  height: number;
};

export type VisibilityState =
  | 'controls-visible'
  | 'controls-fading-in'
  | 'controls-fading-out'
  | 'controls-hidden';
