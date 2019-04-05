import React from 'react';
import ExpandFolderButton from './ExpandFolderButton';

export default ({ item }) => {
  return (
    <li>
      <ExpandFolderButton />
      {item.name}
    </li>
  );
};
