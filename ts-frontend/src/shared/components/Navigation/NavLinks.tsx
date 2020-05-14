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
          <NavLink to={`/customers`}>MY CUSTOMERS</NavLink>
        </li>
      )}
    </ul>
    {auth.isLoggedIn && (
    <div className="user-bar">
        <NavLink to="/user">
          MY PROFILE
        </NavLink>
      {auth.isLoggedIn && (
        <button onClick={auth.logout}>LOGOUT</button>
      )}
    </div>
    )}
    </React.Fragment>
  );
};

export default NavLinks;
