import { useEffect, useReducer } from 'react';

export default (stream$, initialState, reducer) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const sub = stream$.subscribe({
      next: dispatch
    });
    return () => sub.unsubscribe();
  });

  return state;
};
