import React from 'react';

import './LoadingSpinner.scss';

interface xlink {
  xlink: any
}

const LoadingSpinner: React.FC<{asOverlay?: boolean}> = (props) => {
  return (
    <div className={`${props.asOverlay && 'loading-spinner__overlay'}`}>
      <svg className="loading-spinner--icon">
        <use href="#loader" xlinkHref="#loader" />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
