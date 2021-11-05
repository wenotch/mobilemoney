import { AuthResponseType } from "paygo";
import React, { useEffect, useState } from "react";
import { Session, SessionContext } from "../context/session-context";

interface Props {
  // currentUser: AuthResponseType | null;
}

export const SessionProvider: React.FC<Props> = ({ children }) => {
  const [session, setSession] = useState({} as Session | undefined);
  const [currentUser, setCurrentUser] = useState<AuthResponseType | undefined>(
    undefined
  );

  const logout = async () => {
    setCurrentUser(undefined);
  };

  useEffect(() => {
    setSession({
      currentUser,
      setCurrentUser,
      getToken() {
        return currentUser === undefined ? null : currentUser.Authorization;
      },
      clearSession() {
        logout();
      },
    });
  }, [currentUser]);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
