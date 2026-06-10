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
      <div className={'start_modal'} onClick={onBeginPlayback} />
      <FarrellyGraph
        graphData={graphData}
        beginPlayback={beginPlayback}
        playbackFrom={'end'}
        config={{width: 800, height: 600}}
      />
    </div>
  );
};

export default App;
