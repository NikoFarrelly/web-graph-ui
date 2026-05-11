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

  // TODO make this more reactive, potentially shift to using ref?
  useEffect(() => {
    function handleResize() {
      if (!window) return;

      const hasDefinedMax = !!maxWindowSize;

      // initial set windowSize set
      if (!hasDefinedMax && !windowSize) {
        return setWindowSize({
          width: window.innerWidth - horizontal,
          height: window.innerHeight - vertical,
        });
      } else if (!windowSize && hasDefinedMax) {
        const width =
          window.innerWidth > maxWindowSize?.width ? maxWindowSize.width : window.innerWidth;
        const height =
          window.innerHeight > maxWindowSize?.height ? maxWindowSize.height : window.innerHeight;
        return setWindowSize({
          width: width - horizontal,
          height: height - vertical,
        });
      }

      if (maxWindowSize?.width && maxWindowSize?.height) {
        const hasMaxWidth = maxWindowSize.width >= window.innerWidth;
        const hasMaxHeight = maxWindowSize.height >= window.innerHeight;
        // if outside max bounds, return early.
        if (hasMaxHeight || hasMaxWidth) return;
        setWindowSize({
          width: window.innerWidth - horizontal,
          height: window.innerHeight - vertical,
        });
      } else {
        setWindowSize({
          width: window.innerWidth - horizontal,
          height: window.innerHeight - vertical,
        });
      }
    }

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
