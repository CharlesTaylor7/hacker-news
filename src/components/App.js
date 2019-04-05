import React from 'react';
import './App.css';
import Folder from './Folder';

export default () => {
  return (
    <div className='App'>
      <header className='App-header'>
        <Folder folder={{ name: 'Project', id: 'root' }} />
      </header>
    </div>
  );
};
