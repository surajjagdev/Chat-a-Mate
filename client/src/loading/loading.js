import React from 'react';
import './loading.css';
const Loading = props => {
  if (props.isLoading === true) {
    return <div className="loading" />;
  } else {
    return null;
  }
};
export default Loading;
