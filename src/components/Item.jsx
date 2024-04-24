import React, { useState, useEffect, useRef } from "react";
import * as HN from "../HackerNewsAPI";
import PollOption from "./PollOption";
import { SortedMap } from "immutable-sorted";
import { getDatabase, saveItem } from "../storage";

export default function Item(props) {
  const ref = useRef();
  const [item, setItem] = useState(props.item);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (item && item.watch) {
      const source = new EventSource(
        `https://hacker-news.firebaseio.com/v0/item/${item.id}.json`,
      );
      ref.current = source;

      source.addEventListener("put", (event) => {
        const json = JSON.parse(event.data);
        setItem((item) => ({ ...item, ...json }));
        console.log("refresh", item.id);
      });
    }
  }, []);

  if (!item) return null;
  const ignoreButton = (
    <button
      className="btn btn-sm px-2 btn-error"
      onClick={() => {
        item.ignore = 1;
        setItem(null);
        document.dispatchEvent(new CustomEvent("ignore", { detail: item }));
        getDatabase().then((db) => saveItem(db, item));
        ref.current.close();
      }}
    >
      <span className="material-symbols-outlined">block</span>
    </button>
  );

  return (
    <div id={item.id} data-item={JSON.stringify(item)}>
      <span className="flex flex-row gap-2"></span>
      <div className="flex">
        {item.parent ? null : item.watch ? (
          <button
            className="btn btn-sm px-2 btn-warning"
            onClick={() => {
              delete item.watch;
              setItem(null);
              document.dispatchEvent(
                new CustomEvent("unbookmark", { detail: item }),
              );
              getDatabase().then((db) => saveItem(db, item));
              ref.current.close();
            }}
          >
            <span className="material-symbols-outlined">bookmark_remove</span>
          </button>
        ) : (
          <button
            className="btn btn-sm px-2 btn-success"
            onClick={() => {
              item.watch = 1;
              setItem(null);
              document.dispatchEvent(
                new CustomEvent("bookmark", { detail: item }),
              );
              getDatabase().then((db) => saveItem(db, item));
              ref.current.close();
            }}
          >
            <span className="material-symbols-outlined">bookmark_add</span>
          </button>
        )}
        <ExpandButton open={open} setOpen={setOpen} />
        {item.url ? (
          <a
            className="truncate grow shrink underline decoration-sky-300 visited:decoration-violet-400"
            href={item.url}
            target="_blank"
            rel="no-referrer"
          >
            {item.title}
          </a>
        ) : open ? (
          <span className="grow whitespace-pre-wrap">
            {item.title ? item.title + "\n" : null}
            {item.text}
          </span>
        ) : (
          <span className="truncate grow">{item.title || item.text}</span>
        )}
        {!item.parent && ignoreButton}
      </div>

      {open ? <ItemChildren item={item} /> : null}
    </div>
  );
}

function ItemChildren({ item }) {
  const [children, setChildren] = useState(SortedMap([], (a, b) => b - a));
  const [pollOpts, setPollOpts] = useState([]);

  useEffect(() => {
    // if item has poll options, get all the poll options simultaneously.
    if (item && item.parts) {
      Promise.all(item.parts.map(HN.getItem)).then((allParts) => {
        const totalPollScore = allParts.reduce(
          (total, next) => total + next.score,
          0,
        );
        setPollOpts(
          allParts.map((pollOpt) => (
            <PollOption
              key={pollOpt.id}
              item={pollOpt}
              totalPollScore={totalPollScore}
            />
          )),
        );
      });
    }

    // if item has children, load them in one at a time.
    if (item && item.kids) {
      for (const childId of item.kids) {
        HN.getItem(childId).then((item) => {
          if (!item) return;
          setChildren((children) => children.set(item.id, item));
        });
      }
    }
  }, []);

  return (
    <div className="ml-2 flex flex-col gap-1">
      {pollOpts}
      {children.toArray().map(([_, child]) => (
        <Item key={child.id} item={child} />
      ))}
    </div>
  );
}

const ExpandButton = ({ open, setOpen }) => (
  <button
    className="btn btn-primary rounded-full h-8 w-8 mx-2 min-h-revert"
    onClick={() => setOpen((status) => !status)}
  >
    {open ? "-" : "+"}
  </button>
);
