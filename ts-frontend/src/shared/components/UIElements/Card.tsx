import React from 'react';

import './Card.scss';

const Card: React.FC<any> = (props) => {
  return (
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
