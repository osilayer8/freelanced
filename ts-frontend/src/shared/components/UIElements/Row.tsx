import React from 'react';

import './Row.scss';

const Row: React.FC<{ style?: React.CSSProperties, className?: string }> = (props) => {
  return (
    <div className={`full-box ${props.className ? props.className : ''}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Row;
