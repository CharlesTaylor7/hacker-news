import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ExpandFolderButton from './components/ExpandFolderButton';
import Folder from './components/Folder';
import File from './components/File';

const initialFolder = { name: 'Groceries', type: 'Folder' };
const initialFile = { name: 'Eggs', type: 'File' };
const defaultStore = { items: { 0: { name: 'Groceries', type: 'Folder' } } };

// root folder id = 'root'
// Store: folder id -> [item]
const StoreContext = React.createContext();

const style = {};
export default () => {
  return (
    <div className='App'>
      <ul>
        <File item={{ name: 'stuff' }} />
        <Folder item={{ name: 'Groceries' }} />
        <li>
          <ul>
            <File item={{ name: 'Eggs' }} />
            <File item={{ name: 'Bacon' }} />
          </ul>
        </li>
      </ul>
    </div>
  );
};
