import React, { useDebugValue, useEffect, useState } from 'react';

export const useLocalStorage = <S, >(key: string, df?: S): [S, React.Dispatch<React.SetStateAction<S>>] => {
  const [state, setState] = useState<S>(parse(localStorage.getItem(key)) as S);
  useDebugValue(state);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state || df, setState];
};

const parse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};
