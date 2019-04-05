import React, { useState } from 'react';

export default ({ folder }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ flex: 'inline' }}>
      <button
        style={{
          margin: '10px',
          background: 'grey',
          border: 'none',
          borderRadius: '50%',
          outline: 'none'
        }}
      >
        {open ? '-' : '+'}
      </button>
      {folder.name}
      <ul style={{ listStyleType: 'none' }} />
    </div>
  );
};
