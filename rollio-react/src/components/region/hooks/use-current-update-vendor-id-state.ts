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
  }, []);
  return [state, setState];
};

export default useCustom;

// Replace this with the second global state management code
// https://medium.com/javascript-in-plain-english/state-management-with-react-hooks-no-redux-or-context-api-8b3035ceecf8