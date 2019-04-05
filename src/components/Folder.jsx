import React, { useState } from 'react';
import File from './File';

export default ({ folder }) => {
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
      onSubmit={input => {
        setAddingItem(false);
        setOpen(true);
        setChildren(children => [...children, <File file={{ name: input }} />]);
      }}
    />
  );

  return (
    <li key={folder.key} style={{ display: 'inline' }}>
      <button
        style={{
          margin: '10px',
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
      <ul style={{ listStyleType: 'none' }}>{open ? children : null}</ul>
    </li>
  );
};

const ItemInput = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [isFolder, setIsFolder] = useState(false);
  return (
    <input
      type='text'
      style={{ margin: '10px' }}
      value={input}
      onChange={event => setInput(event.target.value)}
      onKeyPress={event => (event.key === 'Enter' ? onSubmit(input) : null)}
    />
  );
};
