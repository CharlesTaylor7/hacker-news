import React, { useState, useEffect } from 'react';
import './App.css';
import * as HN from '../HackerNewsAPI';
import useReducerOverStream from '../hooks/useReducerOverStream';
import stream from 'xstream';
import Item from './Item';

const topStoriesLimit = 20;

export const App = () => {
  const [latestId, setLatestId] = useState(null);
  const [stopped, setStopped] = useState(false);
  HN.usePollForMaxItem(setLatestId);

  const produceLatest = {
    start: () => ({}),
    stop: () => setStopped(true)
  };

  const items = useReducerOverStream(
    stream.create(produceLatest),
    new Set(),
    (set, item) => {
      const element = <Item key={item.id} item={item} />;
      if (set.size >= topStoriesLimit) return set;
      const copy = Set(set);
      copy.add(element);
      return copy;
    }
  );

  return (
    <div className='App'>
      <header className='App-header'>{items}</header>
    </div>
  );
};
