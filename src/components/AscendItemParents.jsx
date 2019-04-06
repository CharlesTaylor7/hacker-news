import React, { useState, useEffect } from 'react';
import * as HN from '../HackerNewsAPI';
import ItemById from './ItemById';

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

  return <ItemById itemId={id} item={item} />;
};
export default AscendItemParents;
