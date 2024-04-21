import React, { memo, useState, useEffect } from 'react';
import * as HN from '../HackerNewsAPI';
import PollOption from './PollOption';
import ReactLogo from './ReactLogo';
import { parse } from 'html5parser';


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
      { item.kids || item.parts ? <ExpandButton open={open} setOpen={setOpen} /> : <ReactLogo />}
      {item.url ? <a className="underline decoration-sky-300 visited:decoration-violet-400" href={item.url} target='_blank' rel='no-referrer' >{item.title}</a> : item.title || item.text}
      <br />
      {open && item.title && item.text ? (
        <CommentHtml html={item.text} />
      ) : null}
      <div
        className={`ml-2 ${open ? '' : 'hidden'} flex flex-col gap-1`}
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
    className='btn btn-primary rounded-full h-8 w-8 mx-2 min-h-revert'
    onClick={() => setOpen(status => !status)}
  >
    {open ? '-' : '+'}
  </button>
);


const CommentHtml = memo (function({ html }) {
  console.log(parse(html));
  return (
    <>
      {parse(html).map(html => (
          <div dangerouslySetInnerHTML={{ __html: html.value }} />
      ))}
    </>
  )
});
