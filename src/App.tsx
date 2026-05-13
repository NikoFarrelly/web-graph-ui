'use client';

import {useState} from 'react';

import graphData from '../webGraph.json';
import './App.css';
import {FarrellyGraph} from './components/FarrellyGraph.tsx';

/**
 * Used for dev/testing only. FarrellyGraph is the only export from this pkg.
 */

const App = () => {
  const [beginPlayback, setBeginPlayback] = useState(true);
  const onBeginPlayback = () => {
    if (!beginPlayback) setBeginPlayback(true);
  };

  return (
    <div className={'screen'}>
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          width: '100px',
          height: '100px',
          backgroundColor: 'red',
          zIndex: 9999,
        }}
        onClick={onBeginPlayback}
      />
      <FarrellyGraph
        graphData={graphData}
        beginPlayback={beginPlayback}
        playbackFrom={'start'}
        config={{width: 800, height: 600}}
      />
    </div>
  );
};

export default App;
