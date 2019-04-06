import React, { useState, useEffect } from 'react';
import './App.css';
import * as HN from '../HackerNewsAPI';
import useReducerOverStream from '../hooks/useReducerOverStream';
import stream from 'xstream';
import Item from './Item';
import { SortedMap } from 'immutable-sorted';

const topStoriesLimit = 20;

export const App = () => {
  const [latestId, setLatestId] = useState(null);
  HN.usePollForMaxItem(setLatestId);

  const produceLatest = {
    start: async function(listener) {
      if (latestId === null) return;
      this.continue = true;
      this.limit = topStoriesLimit;
      for (let i = 0; this.continue && this.limit > 0; i++) {
        const item = await HN.getRoot(latestId - i);
        if (item != null && !item.deleted) {
          listener.next(item);
          this.limit--;
        }
      }
    },
    stop: function() {
      this.continue = false;
    }
  };

  const elements = useReducerOverStream(
    stream.create(produceLatest),
    SortedMap([], (a, b) => b - a),
    (elements, item) => {
      const element = <Item key={item.id} item={item} />;
      return elements.set(item.id, element);
    },
    [latestId]
  );

  return (
    <div className='App'>
      <header className='App-header'>{elements.valueSeq()}</header>
    </div>
  );
};
