"use client"

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SignInPage from "./_component/SignInPage/SignInPage";

export default function Home() {
  const searchParams = useSearchParams()
  const url = searchParams.get("callback") ?? "/home"

  return (
    <div className="flex justify-center items-center h-screen">
      <Suspense>
        <SignInPage />
      </Suspense>

    </div>
  );
}
