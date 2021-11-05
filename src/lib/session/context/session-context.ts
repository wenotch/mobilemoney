import { AuthResponseType } from "paygo";
import { createContext } from "react";

export interface Session {
  getToken: () => string | null;
  clearSession: () => void;
  currentUser: AuthResponseType | undefined;
  setCurrentUser: (currentUser: AuthResponseType) => void;
}

export const SessionContext = createContext({} as Session | undefined);
