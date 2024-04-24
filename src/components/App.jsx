import React, { useState, useRef, useEffect } from "react";
import * as HN from "../HackerNewsAPI";
import Item from "./Item";
import { SortedMap } from "immutable-sorted";
import { getDatabase, getWatchedItems } from "../storage";
export function App() {
  return (
    <>
      <WatchItems />
      <RecentItems />
    </>
  );
}

function WatchItems() {
  const [items, setItems] = useState(null);
  useEffect(() => {
    (async function () {
      const db = await getDatabase();
      const items = await getWatchedItems(db);
      setItems(
        SortedMap(
          items.map((item) => [item.id, item]),
          (a, b) => b - a,
        ),
      );
    })();
    function bookmark(event) {
      setItems((items) => items.set(event.detail.id, event.detail));
    }
    document.addEventListener("bookmark", bookmark);
    return () => document.removeEventListener("bookmark", bookmark);
  }, []);

  return (
    <>
      <h2>Pinned</h2>
      <div className="p-0 flex flex-col gap-2">
        {items &&
          items
            .toArray()
            .toSorted((a, b) => b.descendants - a.descendants)
            .map(([_, item]) =>
              item ? <Item key={item.id} item={item} /> : null,
            )}
      </div>
    </>
  );
}

function RecentItems() {
  const previousId = useRef(null);
  const [items, setItems] = useState(SortedMap([], (a, b) => b - a));

  useEffect(() => {
    const source = new EventSource(
      "https://hacker-news.firebaseio.com/v0/maxitem.json",
    );

    source.addEventListener("put", (event) => {
      const json = JSON.parse(event.data);
      let end = json.data;
      let start = previousId.current || end - 3;
      previousId.current = end;

      if (start !== null) {
        for (let i = end; i > start; i--) {
          HN.getRoot(i).then((item) => {
            if (!item || item.dead || item.deleted || item.watch) return;
            setItems((elements) => elements.set(item.id, item));
          });
        }
      }
    });

    function unbookmark(event) {
      setItems((items) => items.set(event.detail.id, event.detail));
    }
    document.addEventListener("unbookmark", unbookmark);
    return () => {
      document.removeEventListener("unbookmark", unbookmark);
      source.close();
    }
  }, []);

  return (
    <>
      <h2>Recent</h2>
      <div className="p-0 flex flex-col gap-2">
        {items
          .toArray()
          .toSorted((a, b) => b.descendants - a.descendants)
          .map(([_, item]) => (
            <Item key={item.id} item={item} />
          ))}
      </div>
    </>
  );
}
