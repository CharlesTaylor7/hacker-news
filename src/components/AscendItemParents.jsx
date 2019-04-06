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
      console.log('got ' + JSON.stringify(item));
      if (item.parent !== undefined) {
        console.log('ascending to parent ' + item.parent);
        setId(item.parent);
      }
    });
  }, [id]);

  return item !== null ? <Item item={item} /> : null;
};
export default AscendItemParents;
