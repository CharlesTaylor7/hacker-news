import { useEffect, useReducer } from 'react';

export default (stream$, initialState, reducer, deps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const subscription = stream$.subscribe({
      next: dispatch
    });
    return () => subscription.unsubscribe();
  }, deps);

  return state;
};
