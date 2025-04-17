import { createContext } from "react";
import { voidFn } from "../interfaces";

export const ColorModeContext = createContext({
  toggleColorMode: voidFn,
});
