// Code Credit https://medium.com/javascript-in-plain-english/state-management-with-react-hooks-no-redux-or-context-api-8b3035ceecf8

import { useState, useEffect } from 'react';

let listeners:any = [];
let state = { vendorID: null };

const setState:any = (newState:any) => {
  state = { ...state, ...newState };
  listeners.forEach((listener:any) => {
    listener(state);
  });
};

const useCustom = () => {
  const newListener = useState()[1];
  useEffect(() => {
    listeners.push(newListener);

    return () => {
      listeners = listeners.filter((listener:any) => listener !== newListener)
    }
  }, []);
  return [state, setState];
};

export default useCustom;
