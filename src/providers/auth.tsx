import { useEffect, useState } from "react";
import type { liff as liffType } from "@line/liff";
import { loginLineLoginLinePost } from "../api/default/default";
import { AXIOS_INSTANCE } from "../api/custom-instance";

export const AuthProvider = ({
  children,
  liff,
}: {
  children: React.ReactNode;
  liff: typeof liffType | null;
}) => {
  useEffect(() => {
    if (!liff) {
      return;
    }
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    liff.ready.then(async () => {
      const idToken = liff.getIDToken();
      if (!idToken) {
        throw new Error("idToken is null");
      }
      await loginLineLoginLinePost({
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }).then((res) => {
        setToken(res);
        console.log(`set token ${res}`);
      });
    });
  }, [liff, liff?.isLoggedIn()]);

  const [token, setToken] = useState<string | null>(null);
  const [axiosReady, setAxiosReady] = useState(false);
  useEffect(() => {
    console.log(token);
    if (!token) {
      return;
    }
    const interceptorId = AXIOS_INSTANCE.interceptors.request.use((config) => {
      console.log("aaa");
      return {
        ...config,
        headers: token
          ? ({
              ...config.headers,
              Authorization: `Bearer ${token}`,
            } as typeof config.headers)
          : config.headers,
      };
    });
    setAxiosReady(true);

    return () => {
      AXIOS_INSTANCE.interceptors.request.eject(interceptorId);
    };
  }, [token]);

  if (!axiosReady) {
    return <div>logging in...</div>;
  }
  return <>{children}</>;
};
