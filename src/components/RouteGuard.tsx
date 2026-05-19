"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookies";

const publicPaths = ["/auth"];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authCheck = () => {
      const name = getCookie("seba_user_name");
      const mobile = getCookie("seba_user_mobile");

      if (!name || !mobile) {
        if (!publicPaths.includes(pathname)) {
          setAuthorized(false);
          router.replace("/auth");
        } else {
          setAuthorized(true);
        }
      } else {
        setAuthorized(true);
      }
    };

    authCheck();

    // Listen for storage changes (optional but good for multi-tab)
    window.addEventListener("storage", authCheck);
    return () => {
      window.removeEventListener("storage", authCheck);
    };
  }, [pathname, router]);

  return authorized ? <>{children}</> : null;
}
