"use client"
import { Suspense } from "react";
import SignInPage from "./_component/SignInPage/SignInPage";

export default function Home() {

  return (
    <div className="flex justify-center items-center h-screen">
      <Suspense>
        <SignInPage />
      </Suspense>

    </div>
  );
}
