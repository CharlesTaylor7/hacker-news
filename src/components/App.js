import React, { useState, useEffect } from 'react';
import './App.css';
import * as HN from '../HackerNewsAPI';
import useReducerOverStream from '../hooks/useReducerOverStream';

const topStoriesLimit = 20;
export const App = () => {
  const [latestId, setLatestId] = useState(null);

  HN.usePollForMaxItem(setLatestId);

  const items = useReducerOverStream(stream$, new Set(), (set, item) => {
    if (set.size >= topStoriesLimit) return set;
    const copy = Set(set);
    copy.add(item);
    return copy;
  });

  return (
    <div className='App'>
      <header className='App-header'>{items}</header>
    </div>
  );
};
