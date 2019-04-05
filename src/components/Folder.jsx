import React, { useState } from 'react';
import File from './File';

const Folder = ({ folder }) => {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState([]);

  const addItemToFolder = newItem => {
    setOpen(true);
    setChildren(children => [...children, getItemElement(newItem)]);
  };

  return (
    <li style={{ display: 'block' }}>
      <button
        style={{
          marginRight: '10px',
          background: 'grey',
          border: 'none',
          borderRadius: '50%',
          outline: 'none'
        }}
        onClick={() => setOpen(status => !status)}
      >
        {open ? '-' : '+'}
      </button>
      {folder.name}
      <InputItem addItemToFolder={addItemToFolder} />

      <ul
        style={{
          listStyleType: 'none',
          margin: '0',
          display: open ? 'block' : 'none'
        }}
      >
        {children}
      </ul>
    </li>
  );
};

export default Folder;

const getCounter = () => {
  let count = 0;
  return () => count++;
};

const nextItemId = getCounter();

const getItemElement = item =>
  item.type === 'FOLDER' ? (
    <Folder key={item.id} folder={item} />
  ) : (
    <File key={item.id} file={item} />
  );

const InputItem = ({ addItemToFolder }) => {
  const [mode, setMode] = useState('VIEW');

  const buttonStyle = {
    marginLeft: '10px',
    background: 'grey',
    border: 'none',
    outline: 'none'
  };

  const addItem = newItem => {
    setMode('VIEW');
    addItemToFolder(newItem);
  };

  return mode === 'VIEW' ? (
    <>
      <button style={buttonStyle} onClick={() => setMode('FILE')}>
        + New File
      </button>
      <button style={buttonStyle} onClick={() => setMode('FOLDER')}>
        + New Folder
      </button>
    </>
  ) : (
    <ItemTextInput type={mode} addItem={addItem} />
  );
};

const ItemTextInput = ({ addItem, type }) => {
  const [input, setInput] = useState('');

  const onKeyPress = event => {
    if (event.key === 'Enter') onSubmit();
  };

  const onSubmit = () => {
    const name = input;
    const id = nextItemId();
    addItem({ id, name, type });
  };

  return (
    <input
      type='text'
      style={{ marginLeft: '10px', border: 'none' }}
      value={input}
      placeholder={`Enter ${type.toLowerCase()} name`}
      autoFocus
      onChange={event => setInput(event.target.value)}
      onKeyPress={onKeyPress}
      onBlur={onSubmit}
    />
  );
};
