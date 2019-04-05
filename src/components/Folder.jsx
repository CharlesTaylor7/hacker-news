import React, { useState } from 'react';
import File from './File';

const getCounter = () => {
  let count = 0;
  return () => count++;
};

const nextItemId = getCounter();

const getItemElement = item => {
  return item.type === 'FOLDER' ? (
    <Folder folder={item} />
  ) : (
    <File file={item} />
  );
};

const Folder = ({ folder }) => {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState([]);
  const [addingItem, setAddingItem] = useState(false);

  const newItemButton = (
    <button
      style={{
        margin: '10px',
        background: 'grey',
        border: 'none',
        outline: 'none'
      }}
      onClick={() => setAddingItem(true)}
    >
      + New Item
    </button>
  );

  const itemInput = (
    <ItemInput
      onSubmit={newItem => {
        setAddingItem(false);
        setOpen(true);
        setChildren(children => [...children, getItemElement(newItem)]);
      }}
    />
  );

  return (
    <li key={folder.id} style={{ display: 'inline' }}>
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
      {addingItem ? itemInput : newItemButton}
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

const ItemInput = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [isFolder, setIsFolder] = useState(false);

  const onKeyPress = event => {
    if (event.key === 'Enter') {
      const name = input;
      const type = isFolder ? 'FOLDER' : 'FILE';
      const id = nextItemId();
      onSubmit({ id, name, type });
    }
  };

  return (
    <div style={{ display: 'inline' }}>
      <input
        type='text'
        style={{ margin: '10px' }}
        value={input}
        placeholder={'Enter file/folder name'}
        autoFocus
        onChange={event => setInput(event.target.value)}
        onKeyPress={onKeyPress}
      />
      <input
        type='checkbox'
        checked={isFolder}
        onChange={event => setIsFolder(event.target.checked)}
        onKeyPress={onKeyPress}
      />
      Is Folder?
    </div>
  );
};
