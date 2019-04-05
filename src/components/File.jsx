import React, { useState } from 'react';

export default ({ file }) => {
  return (
    <li key={file.id} style={{ flex: 'inline' }}>
      {file.name}
    </li>
  );
};
