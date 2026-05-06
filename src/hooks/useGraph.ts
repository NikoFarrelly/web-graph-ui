import {type RefObject, useCallback, useEffect, useRef, useState} from 'react';
import type {ForceGraphMethods} from 'react-force-graph-3d';

import type {GraphQueue, GraphQueueItem, PlaybackState, PlayPause} from '../types.ts';
import {useIsMounted} from './useIsMounted.ts';

const SCREEN_HEIGHT = window.innerHeight;
const SCREEN_WIDTH = window.innerWidth;
const isLandscape = SCREEN_HEIGHT > SCREEN_WIDTH;
// const isPortrait = SCREEN_WIDTH > SCREEN_HEIGHT;

// Distance from graph
const DISTANCE = isLandscape ? SCREEN_HEIGHT / 2.3 : SCREEN_WIDTH / 5; //450;
// Delay for orbit to be called & then begin
const ORBIT_DELAY = 500;

let count: number = 0;

export const useGraph = (
  graphQueue: GraphQueue,
  graphRef: RefObject<ForceGraphMethods | undefined>,
  nodeInterval: number,
  beginPlayback: boolean,
  playbackFrom: 'start' | 'end',
) => {
  // ref + setup
  const isMounted = useIsMounted();
  const intervalRef = useRef<number>(0);
  const orbitRef = useRef<number>(0);
  const angleOrbitRef = useRef<number>(0);
  // data
  const [graphData, setGraphData] = useState<GraphQueueItem | undefined>(
    playbackFrom === 'end' ? graphQueue[graphQueue.length - 1] : undefined,
  );
  const countMax = graphQueue.length - 1;
  const currGraphIndex = !!graphData?.nodes ? graphData.nodes.length - 1 : 0;
  // playback
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timesFinished, setTimesFinished] = useState(0);
  // playback: derived state
  const playPauseState: PlayPause = isPaused ? 'Pause' : 'Play';
  const playbackState: PlaybackState = isFinished ? 'Restart' : playPauseState;
  // behaviour
  const [isOrbiting, setIsOrbiting] = useState(false);

  // init & kickoff
  useEffect(() => {
    if (isMounted) setIsRunning(true);
  }, [isMounted]);

  // handle running
  useEffect(() => {
    if (!beginPlayback || !isRunning) return;
    // playbackFrom doesn't change, but we'll want to restart if they've finished. Hence times finished
    if (playbackFrom === 'start' || (playbackFrom === 'end' && timesFinished > 0)) {
      return handleStart();
    } else if (playbackFrom === 'end') {
      setIsFinished(true);
    }
  }, [isRunning, beginPlayback, playbackFrom]);

  // when paused
  useEffect(() => {
    if (isPaused) {
      handlePause();
    } else if (!isPaused) {
      handleOrbitStop();
    }
  }, [isPaused]);

  // when finished
  useEffect(() => {
    if (isFinished) {
      setIsPaused(true);
      setTimesFinished(prev => prev + 1);
      delayedOrbit();
      // if 'stopped', check index then push to end.
      if (count !== currGraphIndex) {
        setGraphData(graphQueue[currGraphIndex]);
        count = currGraphIndex;
      }
    }
  }, [isFinished]);

  const handleStart = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isOrbiting) handleOrbitStop();
    if (isPaused) setIsPaused(false);
    if (isFinished) setIsFinished(false);
    // starting fresh, set initial data. Restart does this itself.
    if (!graphData) {
      setTimeout(() => setGraphData(graphQueue[count]), nodeInterval / 2);
    }

    // @ts-ignore TODO resolve tsconfig.build.json error
    intervalRef.current = setInterval(() => {
      // finished graph
      if (count === countMax) {
        setIsFinished(true);
      } else if (count < countMax) {
        setGraphData(graphQueue[count]);
        count++;
      }
    }, nodeInterval);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    if (isRunning) setIsRunning(false);
  };

  const handleOrbitStart = () => {
    orbit();
  };

  const orbit = () => {
    if (!isOrbiting) setIsOrbiting(true);
    if (!graphRef.current) return;

    // if the graph has been moved, grab it's updated pos & translate for x/z
    const currentPos = graphRef.current.camera().position;
    angleOrbitRef.current = Math.atan2(currentPos.x, currentPos.z);

    // @ts-ignore TODO resolve tsconfig.build.json error
    orbitRef.current = setInterval(() => {
      if (graphRef.current) {
        graphRef.current.cameraPosition({
          x: DISTANCE * Math.sin(angleOrbitRef.current),
          z: DISTANCE * Math.cos(angleOrbitRef.current),
        });
        angleOrbitRef.current += Math.PI / 300;
      }
    }, 10);
  };

  const delayedOrbit = () => {
    if (!graphRef.current) return;
    graphRef.current.cameraPosition({z: DISTANCE, y: -50}, undefined, ORBIT_DELAY * 4);
    setTimeout(() => orbit(), ORBIT_DELAY * 4);
  };

  const handleOrbitStop = () => {
    clearInterval(orbitRef.current);
    if (isOrbiting) setIsOrbiting(false);
  };

  const handleRestart = () => {
    count = 0;
    setGraphData(graphQueue[0]);
    setIsFinished(false);
    handleOrbitStop();
    setIsPaused(false);
    setIsRunning(true);
  };

  const orbitToggle = useCallback(
    () => (isOrbiting ? handleOrbitStop() : handleOrbitStart()),
    [isOrbiting],
  );

  /**
   * Provides playback toggle between playback states.
   */
  const playbackToggle = useCallback(() => {
    if (isFinished) return handleRestart();
    if (isPaused) {
      setIsRunning(true);
      setIsPaused(false);
      return;
    }
    // play by default
    setIsRunning(false);
    setIsPaused(true);
    return;
  }, [isFinished, isPaused]);

  return {
    currGraphData: graphData,
    currGraphIndex,
    orbitToggle,
    playbackToggle,
    playbackState,
    isOrbiting,
  };
};
