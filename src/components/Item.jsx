import React, { useState } from 'react';
import ItemById from './ItemById';

const Item = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <li style={{ display: 'block' }}>
      <button
        style={{
          marginRight: '10px',
          background: 'grey',
          borderRadius: '50%',
          outline: 'none',
          border: '0',
          padding: '0'
        }}
        onClick={() => setOpen(status => !status)}
      >
        {item.kids ? (open ? '-' : '+') : null}
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
        {item.kids
          ? item.kids.map(child => <ItemById key={child} itemId={child} />)
          : null}
      </ul>
    </li>
  );
};

export default Item;
