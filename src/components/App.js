import React, { useState, useEffect } from 'react';
import './App.css';
import * as HN from '../HackerNewsAPI';
import useReducerOverStream from '../hooks/useReducerOverStream';
import stream from 'xstream';
import Item from './Item';
import { SortedMap } from 'immutable-sorted';

let count = 0;

export const App = () => {
  const [latestId, setLatestId] = useState(16809398);
  // const previousId = useRef(null);

  // useEffect(() => {
  //   HN.getLatestId().then(setLatestId);
  // }, []);
  // HN.usePollForMaxItem(newId => {
  //   previousId.current = latestId;
  //   setLatestId(newId);
  // });

  const produceLatest = {
    start: async function(listener) {
      if (latestId === null) return;
      this.version = ++count;
      // const lowerBound = previousId.current || latestId - 20;
      this.continue = true;
      for (let i = latestId; this.continue; i--) {
        const item = await HN.getRoot(i);
        if (item != null && !item.deleted) {
          console.log(
            'Item ' +
              item.id +
              ' from stream ' +
              this.version +
              ' type of ' +
              item.type
          );
          if (item.type === 'poll') {
            listener.next(item);
            break;
          }
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
