import React from 'react';

const style = {
  margin: '10px',
  borderRadius: '50%',
  borderWidth: 0,
  background: 'white',
  outline: 'none',
  width: '19px',
  height: '19px'
};

export default ({ item }) => {
  return (
    <li style={{ flexDirection: 'row' }}>
      <div style={style} />
      {item.name}
    </li>
  );
};
