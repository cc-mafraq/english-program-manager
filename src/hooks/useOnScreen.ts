// https://stackoverflow.com/questions/45514676/react-check-if-element-is-visible-in-dom

import { RefObject, useEffect, useMemo, useState } from "react";

export const useOnScreen = (ref?: RefObject<Element>) => {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(() => {
    return new IntersectionObserver(([entry]) => {
      return setIntersecting(entry.isIntersecting);
    });
  }, []);

  useEffect(() => {
    ref?.current && observer.observe(ref.current);
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, [observer, ref]);

  return isIntersecting;
};
