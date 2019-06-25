import React from 'react';
import './loading.css';
const Loading = props => {
  if (props.isLoading === true) {
    return (
      <div className="loading">
        <h4>Loading...</h4>
      </div>
    );
  } else {
    return null;
  }
};
export default Loading;
