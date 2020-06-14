import { useState, useCallback } from 'react';

export const usePdf = () => {
  const [hide, setHide] = useState<boolean>(false);

  const updateState = useCallback<any>((status: boolean) => {
    setHide(status);
  }, []);

  return { updateState, hide }
};