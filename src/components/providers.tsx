"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { base } from "viem/chains";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";

export function Providers({ children }: { children: React.ReactNode }) {
  // During static pre-rendering (e.g. 404 page) the env var may not be
  // available. Render children without the Privy provider so the build
  // doesn't crash. At runtime the env var will always be present.
  if (!privyAppId) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ["twitter"],
        appearance: {
          theme: "dark",
          accentColor: "#1d9bf0",
        },
        defaultChain: base,
        supportedChains: [base],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
