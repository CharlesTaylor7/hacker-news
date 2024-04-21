import React, { useState, useEffect } from 'react';
import SanitizeHtml from './SanitizeHtml';
import * as HN from '../HackerNewsAPI';
import PollOption from './PollOption';
import ReactLogo from './ReactLogo';

export default function Item({ item }) {
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

  if (item.deleted || item.dead) return null;

  return (
    <div data-id={item.id} data-item={JSON.stringify(item)}>
      <ExpandButton open={open} setOpen={setOpen} />
      {item.url ? <a className="underline decoration-sky-300 visited:decoration-violet-400" href={item.url} target='_blank' rel='no-referrer' >{item.title}</a> : item.title || item.text}
      <br />
      {open && item.title && item.text ? (
        <SanitizeHtml html={item.text} />
      ) : null}
      <div
        className={`ml-2 ${open ? '' : 'hidden'}`}
      >
        {pollOpts}
        {children.map(child => (
          <Item key={child.id} item={child} />
        ))}
      </div>
    </div>
  );
};


const ExpandButton = ({ open, setOpen }) => (
  <button
    className='btn btn-primary rounded-full h-8 w-8 m-2 min-h-revert'
    onClick={() => setOpen(status => !status)}
  >
    {open ? '-' : '+'}
  </button>
);
