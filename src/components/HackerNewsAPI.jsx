import React from 'react';

const rootURL = 'https://hacker-news.firebaseio.com/v0';
const suffix = '.json';

export const getMaxItem = () =>
  fetch(`${rootURL}/maxitem${suffix}`).then(response => response.json());

const getItem = itemId => {
  console.log(`Requesting item: ${itemId}`);
  return fetch(`${rootURL}/item/${itemId}${suffix}`).then(response =>
    response.json()
  );
};

export const getLatestStory = () =>
  getMaxItem().then(itemId => {
    return first(requestItems(), item => item.type === 'story');

    function* requestItems() {
      for (; ; itemId--) {
        yield getItem(itemId);
      }
    }
  });

const first = async (promises, predicate) => {
  for await (const result of promises) {
    if (predicate(result)) return result;
  }
  // TODO handle resolve with value of "false"?
  // TODO handle rejection?
};
