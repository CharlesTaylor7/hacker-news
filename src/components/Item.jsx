import React, { useState, useEffect } from 'react';
import SanitizeHtml from './SanitizeHtml';
import reactLogo from '../assets/logo.svg';
import * as HN from '../HackerNewsAPI';

const Item = ({ item }) => {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState([]);
  const [pollOpts, setPollOpts] = useState([]);
  const kids = item.kids || [];

  useEffect(() => {
    // if item has poll options, get all the poll options simulataneously.
    if (item.parts) {
      Promise.all(
        item.parts.map(part =>
          HN.getItem(part).then(part => {
            console.log('part retrieved ' + JSON.stringify(part));
            return part;
          })
        )
      ).then(allParts => {
        console.log('All Parts received');
        setPollOpts(allParts);
      });
    }

    // if item has children, load them in one at a time.
    for (const childId of kids) {
      HN.getItem(childId).then(item => {
        if (!item || item.deleted) return;
        setChildren(children => [...children, item]);
      });
    }
  }, []);

  if (item.deleted) return null;

  const expandChildrenButton = <ExpandButton open={open} setOpen={setOpen} />;
  const icon = <img src={reactLogo} height='17px' alt='logo' />;

  return (
    <li style={{ display: 'block' }}>
      {item.kids || item.parts ? expandChildrenButton : icon}
      {item.url ? <a href={item.url}>{item.title}</a> : item.title || item.text}
      <br />
      {open && item.title && item.text ? (
        <SanitizeHtml html={item.text} />
      ) : null}
      <ul
        style={{
          listStyleType: 'none',
          margin: '0',
          display: open ? 'block' : 'none'
        }}
      >
        {pollOpts.map(pollOpt => (
          <Item key={pollOpt.id} item={pollOpt} />
        ))}
        {children.map(child => (
          <Item key={child.id} item={child} />
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
