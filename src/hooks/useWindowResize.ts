// https://codesandbox.io/s/8ftbq?file=/src/useWindowResize.js:52-418
import { useLayoutEffect, useState } from "react";

export const useWindowResize = () => {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => {
      return window.removeEventListener("resize", updateSize);
    };
  }, []);

  return size;
};
