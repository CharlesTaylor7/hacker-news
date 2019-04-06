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

export const getLatestStories = n =>
  getLatestId().then(itemId => {
    return take(requestItems(), item => item.type === 'story', n);

    function* requestItems() {
      for (; ; itemId--) {
        yield getItem(itemId);
      }
    }
  });

const take = async (promises, predicate, n) => {
  for await (const result of promises) {
    if (predicate(result)) return result;
  }
  // TODO handle resolve with value of "false"?
  // TODO handle rejection?
};
