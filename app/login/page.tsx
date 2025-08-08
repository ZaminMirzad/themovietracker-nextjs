"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background text-dark-background dark:text-dark-foreground p-4">
      <SignIn
        appearance={{
          elements: {
            card: "bg-light-background dark:bg-dark-background border border-gray-700 rounded-2xl",
            headerTitle: "text-dark-foreground",
            headerSubtitle: "text-gray-400",
          },
        }}
        routing="hash"
        afterSignInUrl="/"
        signUpUrl="/signup"
      />
    </main>
  );
}
