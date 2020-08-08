import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  theme: '',
  userId: null,
  login: () => {},
  logout: () => {}
});
