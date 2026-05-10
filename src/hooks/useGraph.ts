import {type RefObject, useCallback, useEffect, useRef, useState} from 'react';
import type {ForceGraphMethods} from 'react-force-graph-3d';

import {
  type GraphQueue,
  type GraphQueueItem,
  type Orbit,
  OrbitEnum,
  type Playback,
  PlaybackEnum,
} from '../types.ts';

const SCREEN_HEIGHT = window.innerHeight;
const SCREEN_WIDTH = window.innerWidth;
const isLandscape = SCREEN_HEIGHT > SCREEN_WIDTH;
// const isPortrait = SCREEN_WIDTH > SCREEN_HEIGHT;

// Distance from graph
const DISTANCE = isLandscape ? SCREEN_HEIGHT / 2.3 : SCREEN_WIDTH / 5; //450;
// Delay for orbit to be called & then begin
const ORBIT_DELAY = 500;

let count: number = 0;
let hasMounted: boolean = false;
let shouldPlay: boolean = true;

export const useGraph = (
  graphQueue: GraphQueue,
  graphRef: RefObject<ForceGraphMethods | undefined>,
  nodeInterval: number,
  beginPlayback: boolean,
  playbackFrom: 'start' | 'end',
) => {
  // ref + setup
  const intervalRef = useRef<number>(0);
  const orbitRef = useRef<number>(0);
  const angleOrbitRef = useRef<number>(0);
  // data
  const [graphData, setGraphData] = useState<GraphQueueItem>(
    playbackFrom === 'end' ? graphQueue[graphQueue.length - 1] : graphQueue[0],
  );
  const countMax = graphQueue.length - 1;
  const currGraphIndex = graphData?.nodes ? graphData.nodes.length : 0;
  const [playback, setPlayback] = useState<Playback>(PlaybackEnum.Paused);
  const [orbit, setOrbit] = useState<Orbit>(OrbitEnum.Stationary);

  const orbiting = useCallback(() => {
    if (!graphRef.current) return;

    // if the graph has been moved, grab it's updated pos & translate for x/z
    const currentPos = graphRef.current.camera().position;
    angleOrbitRef.current = Math.atan2(currentPos.x, currentPos.z);

    // @ts-expect-error TODO resolve tsconfig error
    orbitRef.current = setInterval(() => {
      if (graphRef.current) {
        graphRef.current.cameraPosition({
          x: DISTANCE * Math.sin(angleOrbitRef.current),
          z: DISTANCE * Math.cos(angleOrbitRef.current),
        });
        angleOrbitRef.current += Math.PI / 300;
      }
    }, 10);
    setOrbit(OrbitEnum.Orbiting);
  }, [graphRef]);

  const orbitStationary = () => {
    if (orbitRef.current) clearInterval(orbitRef.current);
    setOrbit(OrbitEnum.Stationary);
  };

  const delayedOrbiting = useCallback(() => {
    if (!graphRef.current) return;
    graphRef.current.cameraPosition({z: DISTANCE, y: -50}, undefined, ORBIT_DELAY * 4);
    setTimeout(() => orbiting(), ORBIT_DELAY * 4);
  }, [graphRef, orbiting]);

  const finished = useCallback(() => {
    clearInterval(intervalRef.current);
    setPlayback(PlaybackEnum.Finished);
    shouldPlay = true;
    count = 0;
    delayedOrbiting();
  }, [delayedOrbiting]);

  const playing = useCallback(() => {
    orbitStationary();
    setPlayback(PlaybackEnum.Playing);

    if (!shouldPlay) return;
    // @ts-expect-error TODO resolve this
    intervalRef.current = setInterval(() => {
      // adding to graph
      if (count < countMax) {
        setGraphData(graphQueue[count]);
        count++;
        // finished graph
      } else if (count === countMax) {
        finished();
      }
    }, nodeInterval);
    shouldPlay = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paused = useCallback(() => {
    clearInterval(intervalRef.current);
    delayedOrbiting();
    setPlayback(PlaybackEnum.Paused);
    shouldPlay = true;
  }, [delayedOrbiting]);

  const restarting = useCallback(() => {
    clearInterval(angleOrbitRef.current);
    clearInterval(orbitRef.current);
    playing();
  }, [playing]);

  /**
   * Provides playback toggle between playback states.
   */
  const playbackToggle = useCallback(() => {
    // if playing -> paused, paused -> playing, finished -> restart.
    switch (playback) {
      case PlaybackEnum.Playing:
        return paused();
      case PlaybackEnum.Finished:
        return restarting();
      case PlaybackEnum.Paused:
      default:
        return playing();
    }
  }, [paused, playback, playing, restarting]);

  const orbitToggle = useCallback(() => {
    switch (orbit) {
      case OrbitEnum.Orbiting:
        return orbitStationary();
      default:
      case OrbitEnum.Stationary:
        return orbiting();
    }
  }, [orbit, orbiting]);

  /**
   * Handles beginning playback.
   */
  useEffect(() => {
    if (!hasMounted && beginPlayback) {
      if (playbackFrom === 'start') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        playing();
      } else if (playbackFrom === 'end') {
        finished();
      }
      hasMounted = true;
    }
  }, [beginPlayback, finished, playbackFrom, playing]);

  return {
    currGraphData: graphData,
    currGraphIndex,
    orbitToggle,
    playbackToggle,
    playbackState: playback,
    isOrbiting: orbit === OrbitEnum.Orbiting,
  };
};
