import { useState, useCallback, useEffect } from 'react';

import { themeCheck } from '../components/UIElements/themeCheck';

let logoutTimer: any;

export const useAuth = () => {
  const [token, setToken] = useState<any>(false);
  const [theme, setTheme] = useState<string>('');
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date>();
  const [userId, setUserId] = useState<any>();
  const [checkLogin, setCheckLogin] = useState<boolean>(false);

  const login = useCallback<any>(
    (uid: string, token: string, theme: string, expirationDate: Date) => {
      setToken(token);
      setUserId(uid);
      setTheme(theme);
      themeCheck(theme);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 240 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: uid,
          token: token,
          theme: theme,
          expiration: tokenExpirationDate.toISOString(),
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(false);
    setTokenExpirationDate(undefined);
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const getStorage: string | any = localStorage.getItem('userData');
    const storedData = JSON.parse(getStorage);
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.theme,
        new Date(storedData.expiration)
      );
    }
    setCheckLogin(true);
  }, [login]);

  return { token, login, logout, theme, userId, checkLogin };
};
