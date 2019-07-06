import React from 'react';
const ColumnWrapper = props => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '5px',
        border: '1px solid gray',
        marginTop: '10px'
      }}
    >
      {props.children}
    </div>
  );
};
export default ColumnWrapper;
