import { useState } from 'react';

const useRender = () => {
  const [state, setState] = useState(false);
  return {
    refresh: () => setState(state => !state),
  };
};

export default useRender;
