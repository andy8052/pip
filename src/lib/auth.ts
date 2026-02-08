import { PrivyClient } from "@privy-io/server-auth";
import { NextRequest } from "next/server";

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function getAuthenticatedUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);
  try {
    const verifiedClaims = await privy.verifyAuthToken(
      token,
      process.env.PRIVY_VERIFICATION_KEY
    );
    const user = await privy.getUser(verifiedClaims.userId);
    return user;
  } catch {
    return null;
  }
}

export { privy };
