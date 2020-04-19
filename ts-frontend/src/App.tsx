import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import User from './user/pages/User';
import NewCustomer from './customers/pages/NewCustomer';
import UserCustomers from './customers/pages/UserCustomers';
import UpdateCustomer from './customers/pages/UpdateCustomer';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
  const { token, login, logout, userId, checkLogin } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/user" exact>
          <User />
        </Route>
        <Route path="/:userId/customers" exact>
          <UserCustomers />
        </Route>
        <Route path="/customers/new" exact>
          <NewCustomer />
        </Route>
        <Route path="/customers/:customerId">
          <UpdateCustomer />
        </Route>
        <Redirect to="/user" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout }}
    >
      <Router>
        <MainNavigation />
        {checkLogin && <main>{routes}</main>}
      </Router>
    </AuthContext.Provider>
  );
};


export default App;
