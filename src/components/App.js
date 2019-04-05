import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import './App.css';
import Folder from './Folder';

export default () => {
  return (
    <div className='App'>
      <header className='App-header'>
        {/* <img src={logo} className='App-logo' alt='logo' /> */}
        <Folder folder={{ name: 'Project', id: 'root' }} />
      </header>
    </div>
  );
};
