import { createContext } from "react";
import { createContextualCan } from "@casl/react";

// @ts-ignore
export const AbilityContext = createContext();
export const Can = createContextualCan(AbilityContext.Consumer);
