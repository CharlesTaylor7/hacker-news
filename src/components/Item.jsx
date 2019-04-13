import React, { useState, useEffect } from 'react';
import SanitizeHtml from './SanitizeHtml';
import * as HN from '../HackerNewsAPI';
import PollOption from './PollOption';
import ReactLogo from './ReactLogo';

const Item = ({ item }) => {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState([]);
  const [pollOpts, setPollOpts] = useState([]);
  const kids = item.kids || [];

  useEffect(() => {
    // if item has poll options, get all the poll options simultaneously.
    if (item.parts) {
      Promise.all(item.parts.map(HN.getItem)).then(allParts => {
        const totalPollScore = allParts.reduce(
          (total, next) => total + next.score,
          0
        );
        setPollOpts(
          allParts.map(pollOpt => (
            <PollOption
              key={pollOpt.id}
              item={pollOpt}
              totalPollScore={totalPollScore}
            />
          ))
        );
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
  const icon = <ReactLogo />;

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
        {pollOpts}
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
