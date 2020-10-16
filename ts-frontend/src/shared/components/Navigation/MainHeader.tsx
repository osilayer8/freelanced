import React, { ReactNode } from 'react';

import './MainHeader.scss';

const MainHeader: React.FC<{ children: ReactNode }> = (props) => {
  return <header className="main-header">{props.children}</header>;
};

export default MainHeader;
