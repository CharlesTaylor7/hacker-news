import React, { useState, useRef, useEffect } from "react";
import * as HN from "../HackerNewsAPI";
import Item from "./Item";
import { SortedMap } from "immutable-sorted";
import { getDatabase } from "../storage";
export function App() {
  return (
    <>
      <WatchItems />
      <RecentItems />
    </>
  );
}

function WatchItems() {
  const [items, setItems] = useState([]);
  useEffect(() => {

    (async function () {
      const db = await getDatabase();
      const request = db
        .transaction(["items"], "readonly")
        .objectStore("items")
        .index("watch")
        //.getKey()
       .getAll(IDBKeyRange.only(1));

      request.addEventListener("success", () => {
        setItems(request.result)
      });
      request.addEventListener("error", (event) => console.error(event));
    })();
    function bookmark(event) {
      console.log(event);
      setItems(items => [event.detail, ...items]);
    }
    document.addEventListener("bookmark", bookmark);
    return () => document.removeEventListener("bookmark", bookmark);
  }, []);

  return (
    <>
      <h2>Saved</h2>
      <div className="p-0 flex flex-col gap-2">
        {items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
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
      let start = previousId.current || end - 20;
      previousId.current = end;

      if (start !== null) {
        for (let i = end; i > start; i--) {
          HN.getRoot(i).then((item) => {
            if (!item || item.dead || item.deleted) return;
            setItems((elements) => elements.set(item.id, item));
          });
        }
      }
    });
  }, []);

  return (
    <>
      <h2>Recent</h2>
      <div className="p-0 flex flex-col gap-2">
        {items.toArray().map(([_, item]) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
