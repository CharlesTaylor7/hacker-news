import React, { useState, useEffect } from 'react';
import './App.css';
import * as HN from '../HackerNewsAPI';
import Item from './Item';

const toReactElement = item => <Item key={item.id} item={item} />;

export const App = () => {
  const [latestId, setLatestId] = useState(null);
  const [items, setItems] = useState([]);
  const [myLatestItems, _] = useState(() => new HN.LatestItems());
  useEffect(() => {
    HN.latestItemId$.subscribe(setLatestId);
  }, []);

  useEffect(() => {
    if (latestId === null) return;
    myLatestItems
      .streamFromToPrevious$(latestId)
      .subscribe(newItem =>
        setItems(items => [...items, toReactElement(newItem)])
      );
  }, [latestId]);

  return (
    <div className='App'>
      <header className='App-header'>{items}</header>
    </div>
  );
};
