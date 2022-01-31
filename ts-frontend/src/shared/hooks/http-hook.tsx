import { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth-context';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const auth = useContext(AuthContext);

  const activeHttpRequests: React.MutableRefObject<any> = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      headers = {
        ...headers,
        Authorization: 'Bearer ' + auth.token,
        'Content-Type': 'application/json',
      };

      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl: AbortController) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    [auth.token]
  );

  const clearError = () => {
    setError('');
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl: any) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
