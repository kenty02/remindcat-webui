import React, { useEffect, useState } from "react";
import type { liff } from "@line/liff";
import { AuthProvider } from "../providers/auth";

export const LiffContext = React.createContext<typeof liff | null>(null);
export const LiffErrorContext = React.createContext<string | null>(null);
export const useLiff = () => React.useContext(LiffContext);

// https://zenn.dev/arahabica/articles/274bb147a91d8a
// liff関連のlocalStorageのキーのリストを取得
const getLiffLocalStorageKeys = (prefix: string) => {
  const keys: string[] = [];
  for (var i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key!.indexOf(prefix) === 0) {
      keys.push(key!);
    }
  }
  return keys;
};
// 期限切れのIDTokenをクリアする
const clearExpiredIdToken = (liffId: string) => {
  const keyPrefix = `LIFF_STORE:${liffId}:`;
  const key = keyPrefix + "decodedIDToken";
  const decodedIDTokenString = localStorage.getItem(key);
  if (!decodedIDTokenString) {
    return;
  }
  const decodedIDToken = JSON.parse(decodedIDTokenString);
  // 有効期限をチェック
  if (new Date().getTime() > decodedIDToken.exp * 1000) {
    const keys = getLiffLocalStorageKeys(keyPrefix);
    keys.forEach(function (key) {
      localStorage.removeItem(key!);
    });
    console.log("cleared expired idToken");
  }
};

let liffInitiated = false;
export function LiffProvider({ children }: { children: React.ReactNode }) {
  const [liffObject, setLiffObject] = useState<typeof liff | null>(null);
  const [liffError, setLiffError] = useState(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    if (liffInitiated) return;
    // to avoid `window is not defined` error
    import("@line/liff").then(({ default: liff }) => {
      console.log("start liff.init()...");
      clearExpiredIdToken(import.meta.env.VITE_PUBLIC_LIFF_ID!);
      liff
        .init({ liffId: import.meta.env.VITE_PUBLIC_LIFF_ID! })
        .then(() => {
          console.log("liff.init() done");
          setLiffObject(liff);
        })
        .catch((error) => {
          console.log(`liff.init() failed: ${error}`);
          if (!process.env.liffId) {
            console.info(
              "LIFF Starter: Please make sure that you provided `LIFF_ID` as an environmental variable."
            );
          }
          setLiffError(error.toString());
        });
    });
    liffInitiated = true;
  }, []);

  // Provide `liff` object and `liffError` object
  // to page component as property
  // pageProps.liff = liffObject;
  // pageProps.liffError = liffError;
  if (liffError) {
    return <div>liffError: {liffError}</div>;
  }
  return (
    <LiffContext.Provider value={liffObject}>
      <LiffErrorContext.Provider value={liffError}>
        <AuthProvider liff={liffObject}>{children}</AuthProvider>
      </LiffErrorContext.Provider>
    </LiffContext.Provider>
  );
}
