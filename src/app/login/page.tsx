"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth");
  }, [router]);

  return (
    <div className="bg-[#F3F0EE] min-h-screen flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-[#CF4500] text-4xl">progress_activity</span>
    </div>
  );
}
