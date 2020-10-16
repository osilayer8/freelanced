import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const User = React.lazy(() => import('./user/pages/User'));
const UpdateUser = React.lazy(() => import('./user/pages/UpdateUser'));
const UpdateSettings = React.lazy(() => import('./user/pages/UpdateSettings'));
const UpdatePassword = React.lazy(() => import('./user/pages/UpdatePassword'));
const NewCustomer = React.lazy(() => import('./customers/pages/NewCustomer'));
const UserCustomers = React.lazy(
  () => import('./customers/pages/UserCustomers')
);
const Customer = React.lazy(() => import('./customers/pages/Customer'));
const UpdateCustomer = React.lazy(
  () => import('./customers/pages/UpdateCustomer')
);
const NewProject = React.lazy(() => import('./customers/pages/NewProject'));
const Project = React.lazy(() => import('./customers/pages/Project'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

const App = () => {
  const { token, login, theme, logout, userId, checkLogin } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/user" exact>
          <User />
        </Route>
        <Route path="/user/edit" exact>
          <UpdateUser />
        </Route>
        <Route path="/user/settings" exact>
          <UpdateSettings />
        </Route>
        <Route path="/user/password" exact>
          <UpdatePassword />
        </Route>
        <Route path="/customers" exact>
          <UserCustomers />
        </Route>
        <Route path="/customer/new" exact>
          <NewCustomer />
        </Route>
        <Route path="/customers/:customerId" exact>
          <Customer />
        </Route>
        <Route path="/customers/:customerId/edit" exact>
          <UpdateCustomer />
        </Route>
        <Route path="/customers/:customerId/projects/new" exact>
          <NewProject />
        </Route>
        <Route path="/customers/:customerId/projects/:projectId" exact>
          <Project />
        </Route>
        <Redirect to="/customers" />
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
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        theme: theme,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        {checkLogin && (
          <div className="content">
            <Suspense
              fallback={
                <div className="center">
                  <LoadingSpinner />
                </div>
              }
            >
              {routes}
            </Suspense>
          </div>
        )}
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
