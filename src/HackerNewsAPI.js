import { useEffect } from 'react';

const rootURL = 'https://hacker-news.firebaseio.com/v0';
const suffix = '.json';

export const getLatestId = () =>
  fetch(`${rootURL}/maxitem${suffix}`).then(response => response.json());

export const getItem = itemId =>
  fetch(`${rootURL}/item/${itemId}${suffix}`).then(response => response.json());

export const getUpdates = () =>
  fetch(`${rootURL}/updates${suffix}`)
    .then(response => response.json())
    .then(json => json.items);

export const getRoot = async id => {
  while (true) {
    const item = await getItem(id);
    if (item === null) {
      return null;
    }
    if (item.parent === undefined) {
      return item;
    }
    id = item.parent;
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pollEvery(interval, query, onChange) {
  let previous = {};
  while (true) {
    const latest = await query();
    if (latest !== previous) {
      previous = latest;
      onChange(latest);
    }
    await sleep(interval);
  }
}

export const usePollForMaxItem = onChange => {
  useEffect(() => {
    pollEvery(3000, getLatestId, onChange);
  }, []);
};
