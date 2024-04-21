const rootURL = 'https://hacker-news.firebaseio.com/v0';
const suffix = '.json';

export async function getItem(itemId) {
  return fetch(`${rootURL}/item/${itemId}${suffix}`).then(response => response.json());
}

export async function getRoot(id) {
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

