import React, { useState, useEffect } from 'react';
import * as HN from '../HackerNewsAPI';
import ItemById from './ItemById';

const getRoot = async id => {
  while (true) {
    const item = await HN.getItem(id);
    if (item.parent === undefined) {
      return item;
    }
    id = item.parent;
  }
};

const AscendItemParents = ({ initialId }) => {
  const [item, setItem] = useState(null);

  useEffect(() => {
    getRoot(initialId).then(setItem);
  }, []);

  return item != null ? <ItemById itemId={item.id} initialItem={item} /> : null;
};

export default AscendItemParents;
