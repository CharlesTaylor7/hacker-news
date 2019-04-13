import { Observable, interval, range } from 'rxjs';
import {
  distinctUntilChanged,
  flatMap,
  filter,
  take,
  map,
  debounceTime,
  throttleTime
} from 'rxjs/operators';
import { Item } from './types';
import { SortedMap } from 'immutable-sorted';

const rootURL = 'https://hacker-news.firebaseio.com/v0';
const suffix = '.json';

export const getLatestId = (): Promise<number> =>
  fetch(`${rootURL}/maxitem${suffix}`).then(response => response.json());

export const getItem = (itemId: number) =>
  fetch(`${rootURL}/item/${itemId}${suffix}`).then(response => response.json());

export const getUpdates = () =>
  fetch(`${rootURL}/updates${suffix}`)
    .then(response => response.json())
    .then(json => json.items);

export const getRoot = async (id: number) => {
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

export const latestItemId$: Observable<number> = interval(3000).pipe(
  flatMap(getLatestId),
  distinctUntilChanged()
);

const tap = map((x: any) => {
  console.log(x);
  return x;
});

export class LatestItems {
  idCache = new Set();
  latestId = null;
  static defaultStreamSize = 60;
  streamFromToPrevious$ = (latestId: number): Observable<Item> => {
    const previous = this.latestId;
    if (previous !== null && latestId <= previous) throw new Error();
    const count =
      previous !== null ? latestId - previous : LatestItems.defaultStreamSize;
    return range(0, count).pipe(
      flatMap(i => getRoot(latestId - i)),
      filter(item => {
        if (item === null || item.deleted || this.idCache.has(item)) {
          return false;
        }
        this.idCache.add(item.id);
        return true;
      }),
      throttleTime(2000)
    );
  };
}
