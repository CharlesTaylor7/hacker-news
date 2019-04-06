import { useEffect, useContext } from 'react';
import { UpdateContext } from './components/App';

const rootURL = 'https://hacker-news.firebaseio.com/v0';
const suffix = '.json';

export const getLatestId = () =>
  fetch(`${rootURL}/maxitem${suffix}`).then(response => response.json());

export const getItem = itemId => {
  console.log(`Requesting item: ${itemId}`);
  return fetch(`${rootURL}/item/${itemId}${suffix}`).then(response =>
    response.json()
  );
};

export const getUpdates = () =>
  fetch(`${rootURL}/updates${suffix}`).then(response => response.json());

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
    return nextUpdateVersion();
  }
  return false;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pollEvery(interval, onChange) {
  let previous;
  while (true) {
    const latest = await getLatestId();
    if (latest !== previous) {
      console.log('latest id changed to: ' + latest);
      onChange(latest);
      previous = latest;
    }
    await sleep(interval);
  }
}

export const usePollForMaxItem = onChange => {
  useEffect(() => {
    pollEvery(3000, onChange);
  }, []);
};
