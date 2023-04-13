import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { LiffProvider } from "@/libs/liff";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <LiffProvider>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </LiffProvider>
      </Suspense>
    </NextUIProvider>
  );
}
