import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const User = React.lazy(() => import('./user/pages/User'));
const NewCustomer = React.lazy(() => import('./customers/pages/NewCustomer'));
const UserCustomers = React.lazy(() => import('./customers/pages/UserCustomers'));
const UpdateCustomer = React.lazy(() => import('./customers/pages/UpdateCustomer'));
const NewProject = React.lazy(() => import('./customers/pages/NewProject'));
const CustomerProjects = React.lazy(() => import('./customers/pages/CustomerProjects'));
const Project = React.lazy(() => import('./customers/pages/Project'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

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
        <Route path="/customers/:customerId" exact>
          <UpdateCustomer />
        </Route>
        <Route path="/:customerId/projects" exact>
          <CustomerProjects />
        </Route>
        <Route path="/:customerId/projects/new" exact>
          <NewProject />
        </Route>
        <Route path="/projects/:projectId">
          <Project />
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
        {checkLogin && <main><Suspense fallback={
          <div className="center">
            <LoadingSpinner />
          </div>
        }>{routes}</Suspense></main>}
      </Router>
    </AuthContext.Provider>
  );
};


export default App;
