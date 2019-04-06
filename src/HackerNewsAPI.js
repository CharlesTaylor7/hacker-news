import { useEffect, useContext } from 'react';
import { UpdateContext } from './components/App';

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

const omit = (prop, { [prop]: _, ...rest }) => rest;

const getCounter = () => {
  let count = 0;
  return () => count++;
};

const nextUpdateVersion = getCounter();

// hook for updates
export const usePendingUpdate = id => {
  const { updates, setUpdates } = useContext(UpdateContext);
  if (updates[id] !== undefined) {
    setUpdates(us => omit(id, us));
    console.log('Update for ' + id);
    return nextUpdateVersion();
  }
  return false;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pollEvery(interval, query, onChange) {
  let previous = {};
  while (true) {
    const latest = await query();
    if (
      latest.length && previous.length
        ? latest.length !== previous.length
        : latest !== previous
    ) {
      console.log(JSON.stringify(latest));
      previous = latest;
      onChange(latest);
    }
    await sleep(interval);
  }
}

export const usePollForMaxItem = onChange => {
  useEffect(() => {
    pollEvery(100000000, getLatestId, onChange);
  }, []);
};

export const usePollForUpdates = onChange => {
  useEffect(() => {
    pollEvery(3000, getUpdates, onChange);
  }, []);
};
