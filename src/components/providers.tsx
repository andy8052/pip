"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { base } from "viem/chains";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
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
