import React from "react";

function GroupInfo(props) {
  return(
    <div >
        <h1>{props.groupLevel}</h1>
        <h1>{props.description}</h1>
    </div>
  );

}

export default GroupInfo;