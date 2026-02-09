import { Suspense } from "react";
import { LaunchForm } from "@/components/launch-form";
import { TokenList } from "@/components/token-list";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center text-center space-y-4 pt-8">
        <h1 className="text-4xl font-bold text-white">pip</h1>
        <p className="text-lg text-zinc-400 max-w-lg">
          Launch a Clanker v4 token on Base for any X profile. The profile owner
          can claim 80% of trading fees + vesting tokens.
        </p>
      </section>

      <section className="flex justify-center">
        <Suspense
          fallback={
            <div className="h-80 w-full max-w-md animate-pulse rounded-xl bg-zinc-900" />
          }
        >
          <LaunchForm />
        </Suspense>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          Recently Launched
        </h2>
        <Suspense
          fallback={
            <div className="text-center text-zinc-500 py-8">
              Loading tokens...
            </div>
          }
        >
          <TokenList />
        </Suspense>
      </section>
    </div>
  );
}
