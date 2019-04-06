import React, { useState, useEffect } from 'react';
import './App.css';
import * as HN from '../HackerNewsAPI';
import AscendItemParents from './AscendItemParents';

export const UpdateContext = React.createContext({});

const topStoriesLimit = 2;
export const App = () => {
  const [latestId, setLatestId] = useState(null);
  const [ids, setIds] = useState([]);
  const [updates, setUpdates] = useState({});

  HN.usePollForMaxItem(setLatestId);
  HN.usePollForUpdates(updates => {
    setUpdates(us => ({ ...updates.items, ...us }));
  });

  useEffect(() => {
    if (latestId === null) return;
    const ids = [];
    for (let i = 0; i < topStoriesLimit; i++) {
      ids.push(latestId - i);
    }
    setIds(ids);
  }, [latestId]);

  return (
    <div className='App'>
      <UpdateContext.Provider value={{ updates, setUpdates }}>
        <header className='App-header'>
          {ids.map(id => (
            <AscendItemParents key={id} initialId={id} />
          ))}
        </header>
      </UpdateContext.Provider>
    </div>
  );
};
