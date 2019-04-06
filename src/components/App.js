import React from 'react';
import './App.css';
import Story from './Story';

export default () => {
  return (
    <div className='App'>
      <header className='App-header'>
        <Story story={{ title: 'An Article' }} />
      </header>
    </div>
  );
};
