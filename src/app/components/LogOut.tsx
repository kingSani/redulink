"use client";

import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

export default function LogOut() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/auth/signin"); // redirect to login page
              },
            },
          });
        }}
        className="text-sm text-zinc-500 dark:text-zinc-400"
      >
        Log Out
      </button>
    </div>
  );
}
