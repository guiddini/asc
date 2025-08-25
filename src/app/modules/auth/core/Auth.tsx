/* eslint-disable react-refresh/only-export-components */
import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { LayoutSplashScreen } from "../../../../_metronic/layout/core";
import * as authHelper from "./AuthHelpers";
import { WithChildren } from "../../../../_metronic/helpers";
import { useDispatch } from "react-redux";
import {
  setAuth as setReduxAuth,
  clearAuth as clearReduxAuth,
  setCurrentUser as setReduxCurrentUser,
} from "../../../features/userSlice";
import { getAuthenticatedUserDataApi, getUserDataApi } from "../../../apis";
import { User } from "../../../types/user";
import { Ability, AbilityBuilder } from "@casl/ability";
import ability from "../../../utils/ability";

export type AuthContextProps = {
  token: string | undefined;
  saveAuth: (token: string | undefined) => void;
  currentUser: User | undefined;
  setCurrentUser: Dispatch<SetStateAction<User | undefined>>;
  logout: () => void;
};

const initAuthContextPropsState = {
  token: undefined,
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextProps>(
  initAuthContextPropsState
);

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const dispatch = useDispatch();

  const saveAuth = (newToken: string | undefined) => {
    setToken(newToken);
    if (newToken) {
      authHelper.setAuth(newToken);
    } else {
      authHelper.removeAuth();
    }
  };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
    dispatch(clearReduxAuth());
  };

  return (
    <AuthContext.Provider
      value={{ token, saveAuth, currentUser, setCurrentUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthInit: FC<WithChildren> = ({ children }) => {
  const { token, currentUser, logout, setCurrentUser, saveAuth } = useAuth();
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const dispatch = useDispatch();

  // We should request user by authToken before rendering the application
  const requestUser = async (authToken: string) => {
    try {
      if (!currentUser) {
        const { data } = await getAuthenticatedUserDataApi();
        if (data) {
          const userData = data as User;
          const permissions = userData?.permissions;
          const { can, rules } = new AbilityBuilder(Ability);
          permissions.forEach((permission) => {
            const [action, entity] = permission.name.split("_");
            can(action, entity);
            ability.update(rules);
          });
          saveAuth(authToken);
          setCurrentUser(userData);
          dispatch(
            setReduxCurrentUser({
              token: authToken,
              user: userData,
            })
          );
        }
      }
    } catch (error) {
      console.error(error);
      if (currentUser) {
        logout();
      }
    } finally {
      setShowSplashScreen(false);
    }
  };

  useEffect(() => {
    if (token) {
      requestUser(token);
    } else {
      logout();
      setShowSplashScreen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};

export { AuthProvider, AuthInit, useAuth };
