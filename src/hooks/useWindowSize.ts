import {useState, useEffect} from 'react';

export type WindowSize = {
  width: number;
  height: number;
};

export function useWindowSize(
  padding: {horizontal: number; vertical: number},
  maxWindowSize?: WindowSize,
): WindowSize | undefined {
  const [windowSize, setWindowSize] = useState<WindowSize>();
  const {horizontal, vertical} = padding;

  useEffect(() => {
    function handleResize() {
      const width = maxWindowSize?.width
        ? Math.min(window.innerWidth, maxWindowSize.width)
        : window.innerWidth;
      const height = maxWindowSize?.height
        ? Math.min(window.innerHeight, maxWindowSize.height)
        : window.innerHeight;

      setWindowSize({
        width: width - horizontal,
        height: height - vertical,
      });
    }

    // set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [horizontal, maxWindowSize?.height, maxWindowSize?.width, vertical]);

  return windowSize;
}
