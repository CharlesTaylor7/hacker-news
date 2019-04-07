import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import * as HN from '../HackerNewsAPI';
import useReducerOverStream from '../hooks/useReducerOverStream';
import stream from 'xstream';
import Item from './Item';
import { SortedMap } from 'immutable-sorted';

export const App = () => {
  const [latestId, setLatestId] = useState(null);
  const previousId = useRef(null);

  HN.usePollForMaxItem(newId => {
    previousId.current = latestId;
    setLatestId(newId);
  });

  const produceLatest = {
    start: async function(listener) {
      if (latestId === null) return;
      const lowerBound = previousId.current || latestId - 20;
      this.continue = true;
      for (let i = latestId; this.continue && i > lowerBound; i--) {
        const item = await HN.getRoot(i);
        if (item != null && !item.deleted) {
          listener.next(item);
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
