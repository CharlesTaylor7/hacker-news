import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import './App.css';
import Folder from './Folder';
import File from './File';

export default () => {
  return (
    <div className='App'>
      <header className='App-header'>
        <Folder folder={{ name: 'Project', id: 'root' }} />
      </header>
    </div>
  );
};
