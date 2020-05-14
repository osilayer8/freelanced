import React from 'react';

import './Card.scss';

const Card: React.FC<{ style?: React.CSSProperties, className?: string }> = (props) => {
  return (
    <div className={`card ${props.className ? props.className : ''}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
