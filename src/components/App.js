import React, { useState, useEffect } from 'react';
import './App.css';
import Item from './Item';
import * as HN from './HackerNewsAPI';

export default () => {
  const [rootId, setRootId] = useState();

  useEffect(() => {
    HN.getMaxItem().then(setRootId);
  }, []);
  return (
    <div className='App'>
      <header className='App-header'>
        {rootId !== null ? <Item itemId={rootId} /> : null}
      </header>
    </div>
  );
};
