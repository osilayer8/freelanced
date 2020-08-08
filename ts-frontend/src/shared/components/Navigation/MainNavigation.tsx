import React, { useState, useContext, useEffect } from 'react';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';
import { AuthContext } from '../../context/auth-context';
import './MainNavigation.scss';

const MainNavigation: React.FC = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const auth = useContext(AuthContext);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  const [currentTheme, setTheme] = useState<string>('light');

  const lightTheme = {
    "--background": "#fff",
    "--backgroundGradient": "#f2f2f2",
    "--base": "#000",
    "--text": "#000",
    "--box-text": "#fff"
  };

  const darkTheme = {
    "--background": "#161616",
    "--backgroundGradient": "#202020",
    "--base": "#000",
    "--text": "#fff",
    "--box-text": "#fff"
  };

  const applyTheme = (nextTheme: any, cb: any) => {
    const theme: any = nextTheme === "light" ? lightTheme : darkTheme;
    Object.keys(theme).map(key => {
      const value = theme[key];
      document.documentElement.style.setProperty(key, value);
    });
    cb();
  };

  const themeSwitch = () => {
    console.log(auth.theme);
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    applyTheme(nextTheme, () => setTheme(nextTheme));
  };

  useEffect(() => {
    setTheme(auth.theme);
    applyTheme(auth.theme, () => setTheme(auth.theme));
  }, [auth.theme]);

  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
      {auth.isLoggedIn && (<button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>)}
        <nav className="main-navigation__header-nav">
          <NavLinks />
          <button onClick={themeSwitch}>Toggle theme</button>
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
