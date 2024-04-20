import React, { useState, useRef, useEffect } from 'react';
import * as HN from '../HackerNewsAPI';
import useReducerOverStream from '../hooks/useReducerOverStream';
import stream from 'xstream';
import Item from './Item';
import { SortedMap } from 'immutable-sorted';

let count = 0;

export const App = () => {
  const [latestId, setLatestId] = useState(null);
  const previousId = useRef(null);

  useEffect(() => {
    const source = new EventSource('https://hacker-news.firebaseio.com/v0/maxitem.json');

    source.addEventListener("put", (event) => {
      previousId.current = latestId;
      const json = JSON.parse(event.data);
      setLatestId(json.data);
    });
  }, []);

  const produceLatest = {
    start: async function(listener) {
      if (latestId === null) return;
      this.version = ++count;
      const lowerBound = previousId.current || latestId - 20;
      this.continue = true;
      for (let i = latestId; this.continue && i > lowerBound; i--) {
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
    <div>
      <header className='App-header'>{elements.valueSeq()}</header>
    </div>
  );
};
