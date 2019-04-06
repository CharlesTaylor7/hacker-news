import React, { useState, useEffect } from 'react';
import './App.css';
import Item from './Item';
import * as HN from './HackerNewsAPI';

const topStoriesLimit = 10;
export default () => {
  const [latestId, setLatestId] = useState(null);
  const [ids, setIds] = useState([]);

  useEffect(() => {
    HN.getLatestId().then(setLatestId);
  }, []);

  useEffect(() => {
    if (latestId === null) return;
    async function Me() {
      if (ids.length >= topStoriesLimit) return;
      for (let id = latestId; ; id--) {
        const item = await HN.getItem(id);
        console.log('item ' + id + ' ' + JSON.stringify(item));
        if (item.type === 'story') {
          setIds(ids => [...ids, id]);
          setLatestId(id - 1);
          return;
        }
      }
    }
    Me();
  }, [latestId]);
  return (
    <div className='App'>
      <header className='App-header'>
        {ids.map(itemId => (
          <Item key={itemId} itemId={itemId} />
        ))}
      </header>
    </div>
  );
};
