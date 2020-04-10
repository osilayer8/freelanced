import React from 'react';

import './Avatar.scss';

interface Props {
  className: string,
  style: any,
  image: string,
  alt: string,
  width: string
}

const Avatar: React.FC<Props> = (props) => {
  console.log(props.style);
  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

export default Avatar;
