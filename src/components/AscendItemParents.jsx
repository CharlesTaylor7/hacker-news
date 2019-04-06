import React, { useState, useEffect } from 'react';
import * as HN from '../HackerNewsAPI';
import ItemById from './ItemById';
import Item from './Item';

const AscendItemParents = ({ initialId }) => {
  const [item, setItem] = useState(null);
  const [id, setId] = useState(initialId);

  useEffect(() => {
    HN.getItem(id).then(item => {
      setItem(item);
      if (item.parent !== undefined) {
        setId(item.parent);
      }
    });
  }, [id]);

  return item !== null ? <Item item={item} /> : null;
};
export default AscendItemParents;
