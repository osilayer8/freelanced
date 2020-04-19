import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.scss';

const NavLinks: React.FC = () => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      {auth.isLoggedIn && (
      <li>
        <NavLink to="/user">
          MY PROFILE
        </NavLink>
      </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/customers`}>MY CUSTOMERS</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/customers/new">ADD CUSTOMER</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
