import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import BackButton from '../UIElements/backButton';
import './NavLinks.scss';

const NavLinks: React.FC = () => {
  const auth = useContext(AuthContext);
  return (
    <React.Fragment>
    {auth.isLoggedIn && (
      <BackButton />
    )}
    <ul className="nav-links">
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/customers`}><svg><use href="#business" xlinkHref="#business" /></svg><label>MY CUSTOMERS</label></NavLink>
        </li>
      )}
    </ul>
    {auth.isLoggedIn && (
    <div className="user-bar">
        <NavLink to="/user">
          <svg><use href="#profile" xlinkHref="#profile" /></svg> <label>MY PROFILE</label>
        </NavLink>
      {auth.isLoggedIn && (
        <div className="logout" title="Logout" onClick={auth.logout}>
          <svg><use href="#logout" xlinkHref="#logout" /></svg>
        </div>
      )}
    </div>
    )}
    </React.Fragment>
  );
};

export default NavLinks;
