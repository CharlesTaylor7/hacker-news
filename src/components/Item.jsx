import React, { useState } from 'react';
import ItemById from './ItemById';
import SanitizeHtml from './SanitizeHtml';
import reactLogo from '../assets/logo.svg';

const Item = ({ item }) => {
  const [open, setOpen] = useState(false);

  const expandChildrenButton = <ExpandButton open={open} setOpen={setOpen} />;
  const icon = <img src={reactLogo} height='17px' alt='logo' />;

  const kids = item.kids || [];
  return (
    <li style={{ display: 'block' }}>
      {item.kids ? expandChildrenButton : icon}
      {item.url ? (
        <a href={item.url}>{item.title}</a>
      ) : item ? (
        item.title || <SanitizeHtml html={item.text} />
      ) : null}
      <ul
        style={{
          listStyleType: 'none',
          margin: '0',
          display: open ? 'block' : 'none'
        }}
      >
        {kids.map(child => (
          <ItemById key={child} itemId={child} />
        ))}
      </ul>
    </li>
  );
};

export default Item;

const ExpandButton = ({ open, setOpen }) => (
  <button
    style={{
      marginRight: '10px',
      background: 'grey',
      borderRadius: '50%',
      outline: 'none',
      border: '0'
    }}
    onClick={() => setOpen(status => !status)}
  >
    {open ? '-' : '+'}
  </button>
);
