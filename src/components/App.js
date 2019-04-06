import React, { useState, useEffect } from 'react';
import './App.css';
import * as HN from '../HackerNewsAPI';
import ItemById from './ItemById';

export const UpdateContext = React.createContext({});

const topStoriesLimit = 20;
export const App = () => {
  const [latestId, setLatestId] = useState(null);
  const [items, setItems] = useState(new Set());

  HN.usePollForMaxItem(setLatestId);

  useEffect(() => {
    if (latestId === null) return;
    Promise.all(addNextStory());
    function* addNextStory() {
      for (let i = 0; ; i++) {
        yield HN.getRoot(latestId - i).then(item =>
          setItems(items => {
            if (items.size >= topStoriesLimit) return items;
            const copy = Set(items);
            copy.add(item);
            return copy;
          })
        );
      }
    }
  }, [latestId]);

  return (
    <div className='App'>
      {/* <UpdateContext.Provider value={{ updates, setUpdates }}> */}
      <header className='App-header'>{items}</header>
      {/* </UpdateContext.Provider> */}
    </div>
  );
};
