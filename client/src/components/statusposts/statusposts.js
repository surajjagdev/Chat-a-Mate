import React from 'react';
const StatusPost = props => {
  return (
    <div style={{ paddingLeft: '5px', paddingRight: '5px' }}>
      <h5>{props.createdAt}</h5>
      <p>{props.body}</p>
    </div>
  );
};
export default StatusPost;
