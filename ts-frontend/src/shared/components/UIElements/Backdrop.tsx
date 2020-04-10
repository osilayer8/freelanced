import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.scss';

const Backdrop: React.FC<any> = (props) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById('backdrop-hook')!
  );
};

export default Backdrop;
