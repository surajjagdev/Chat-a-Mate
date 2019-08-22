import React from 'react';
import { Link } from 'react-router-dom';
function determineDate(postDate) {
  let todayDate = new Date();
  let todayUTC = todayDate.toUTCString();
  let todayMilliSeconds = Date.parse(todayUTC);
  let postDateMilliSeconds = Date.parse(postDate);
  return differenceInDates(postDateMilliSeconds, todayMilliSeconds);
}
function differenceInDates(a, b) {
  let diffTime = b - a;
  //less than a minute
  if (diffTime < 60000) {
    return `few seconds ago`;
  }
  //more than a minute less than hour
  else if (diffTime > 60000 && diffTime < 3600000) {
    let minutesAgo = diffTime / 60000;
    return `${Math.round(minutesAgo)} minutes Ago`;
  }
  //more than hour
  else if (diffTime > 3600000 && diffTime < 86400000) {
    let hoursAgo = diffTime / 3600000;
    return `${Math.round(hoursAgo)} hours ago`;
  }
  //more than day
  else {
    let daysAgo = diffTime / 86400000;
    return `${Math.round(daysAgo)} days ago`;
  }
}
const StatusPost = props => {
  return (
    <div
      style={{
        padding: '0px 5px',
        paddingRight: '5px',
        minHeight: '75px',
        fontSize: '15px'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Link to={`/${props.addedBy}`}>
          <h5>{props.addedBy}</h5>
        </Link>
        <h5>{props.user_to !== 'None' ? `${props.user_to}` : null}</h5>
        <h5 style={{ paddingLeft: '5px', color: 'gray' }}>
          {determineDate(props.createdAt)}
        </h5>
      </div>
      <p>{props.body}</p>
    </div>
  );
};
export default StatusPost;
