import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { LiffProvider } from "@/libs/liff";
import { AuthProvider } from "@/providers/auth";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  // msw起動前にレンダリング(=APIリクエスト)しないようにする
  // https://github.com/mswjs/msw/discussions/1049#discussioncomment-1941348
  const [shouldRender, setShouldRender] = useState(!process.env.NEXT_PUBLIC_API_MOCKING);
  useEffect(() => {
    async function initMocks() {
      const { initMocks } = await import("../mocks");
      await initMocks();
      setShouldRender(true);
    }

    if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
      void initMocks();
    }
  }, []);
  if (!shouldRender) {
    return null;
  }

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: "light",
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <LiffProvider>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </LiffProvider>
      </Suspense>
    </MantineProvider>
  );
}
