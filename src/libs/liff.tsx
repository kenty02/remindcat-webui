import React, { useEffect, useState } from "react";
import type { liff } from "@line/liff";

export const LiffContext = React.createContext<typeof liff | null>(null);
export const LiffErrorContext = React.createContext<string | null>(null);
export const useLiff = () => React.useContext(LiffContext);

export function LiffProvider({ children }: { children: React.ReactNode }) {
  const [liffObject, setLiffObject] = useState<typeof liff | null>(null);
  const [liffError, setLiffError] = useState(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    // to avoid `window is not defined` error
    import("@line/liff").then(({ default: liff }) => {
      console.log("start liff.init()...");
      liff
        .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
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
      <LiffErrorContext.Provider value={liffError}>{children}</LiffErrorContext.Provider>
    </LiffContext.Provider>
  );
}
