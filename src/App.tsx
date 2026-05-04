'use client';

import {useState} from 'react';

import './App.css';
import {FarrellyGraph} from './components/FarrellyGraph.tsx';
import {dataset} from './dataset.ts';

const App = () => {
  const [beginPlayback, setBeginPlayback] = useState(false);
  const onBeginPlayback = () => {
    if (!beginPlayback) setBeginPlayback(true);
  };

  return (
    <div className={'screen'}>
      {/* Config for data, playback, startPos*/}
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
      <FarrellyGraph graphData={dataset} beginPlayback={beginPlayback} playbackFrom={'start'} />
    </div>
  );
};

export default App;
