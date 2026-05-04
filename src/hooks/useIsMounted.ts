import {useEffect, useState} from 'react';

export const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    if (!isMounted) setTimeout(() => setIsMounted(true), 100);
  }, []);
  return isMounted;
};
