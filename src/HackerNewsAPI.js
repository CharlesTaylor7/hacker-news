import * as parser from 'html5parser';
import * as he from 'he';

const rootURL = 'https://hacker-news.firebaseio.com/v0';
const suffix = '.json';

export async function getItem(itemId) {
  const item = await fetch(`${rootURL}/item/${itemId}${suffix}`).then(response => response.json());
  if (!item) return item;

  const ast = parser.parse(item.text);
  item.text = '';
  parser.walk(ast, { 
    enter(node) {
      if (node.type === 'Text') {
        item.text += he.decode(node.value);
      }
      if (node.name === 'p') {
        item.text += '\n'
      }
    }
  });

  return item;
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

