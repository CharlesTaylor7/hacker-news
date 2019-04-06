import React, { useState, useEffect } from 'react';
import * as HN from './HackerNewsAPI';

const Item = ({ itemId }) => {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState({});

  // Load content
  useEffect(() => {
    HN.getItem(itemId).then(setItem);
  }, [itemId]);

  return (
    <li style={{ display: 'block' }}>
      <button
        style={{
          marginRight: '10px',
          background: 'grey',
          border: 'none',
          borderRadius: '50%',
          outline: 'none'
        }}
        onClick={() => setOpen(status => !status)}
      >
        {item && item.kids ? (open ? '-' : '+') : null}
      </button>
      {item.url ? (
        <a href={item.url}>{item.title}</a>
      ) : item ? (
        item.title || item.text
      ) : null}
      <ul
        style={{
          listStyleType: 'none',
          margin: '0',
          display: open ? 'block' : 'none'
        }}
      >
        {item && item.kids
          ? item.kids.map(child => <Item key={child} itemId={child} />)
          : null}
      </ul>
    </li>
  );
};

export default Item;
