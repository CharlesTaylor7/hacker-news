import React, { useState, useEffect } from 'react';
import './App.css';
import Item from './Item';
import ItemById from './ItemById';
import * as HN from '../HackerNewsAPI';

export const UpdateContext = React.createContext({});

const topStoriesLimit = 10;
export const App = () => {
  const [latestId, setLatestId] = useState(null);
  const [ids, setIds] = useState([]);
  const [updates, setUpdates] = useState({});

  useEffect(() => {
    HN.getLatestId().then(setLatestId);
  }, []);

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
            <ItemById key={id} itemId={id} />
          ))}
        </header>
      </UpdateContext.Provider>
    </div>
  );
};
