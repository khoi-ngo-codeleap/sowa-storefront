import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { FrontendApi, Configuration } from "@ory/client";

const basePath =
  import.meta.env.VITE_REACT_APP_ORY_URL || "http://localhost:3000";
const ory = new FrontendApi(
  new Configuration({
    basePath,
    baseOptions: {
      withCredentials: true,
      headers: {
        // Only needed to pass the documentation CI. You do not need this line in your code:
        [import.meta.env.VITE_ORY_CI_RATE_LIMIT_HEADER || ""]: import.meta.env
          .VITE_ORY_CI_RATE_LIMIT_HEADER_VALUE,
      },
    },
  })
);

console.log("Ory: ", ory);

export type AuthContextValue =
  | { isAuthenticated: false }
  | {
      isAuthenticated: true;
      session: string;
      sessionToken: string;
      syncSession: () => void;
      setSession: () => void;
      didFetch: () => void;
    };

const AuthContext = createContext<AuthContextValue>({ isAuthenticated: false });

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  // const [session, setSession] = useState<Session | undefined>();
  // const [logoutUrl, setLogoutUrl] = useState<string | undefined>();

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        console.log(data, "as debug");
      })
      .catch((err) => {
        console.error(err);
      });
    // ory
    //   .toSession()
    //   .then(({ data }) => {
    //     // User has a session!
    //     setSession(data);
    //     ory.createBrowserLogoutFlow().then(({ data }) => {
    //       // Get also the logout url
    //       setLogoutUrl(data.logout_url);
    //     });
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     // Redirect to login page
    //     window.location.replace(`${basePath}/ui/login`);
    //   });
  }, []);

  const authValue: AuthContextValue = useMemo(
    () => ({
      session: "dummy session",
      sessionToken: "dummy sessionToken",
      isAuthenticated: true,
      syncSession: () => {
        console.log("trigger syncSession");
      },
      setSession: () => {
        console.log("trigger setSession");
      },
      didFetch: () => {
        console.log("trigger didFetch");
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
