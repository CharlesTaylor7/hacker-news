import React from 'react';
import reactLogo from '../assets/logo.svg';

export default ({ file }) => {
  return (
    <li style={{ display: 'block' }}>
      <img
        src={reactLogo}
        style={{ height: '17px', marginRight: '10px' }}
        alt='Logo'
      />
      {file.name}
    </li>
  );
};
