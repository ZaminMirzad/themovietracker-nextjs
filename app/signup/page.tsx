"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background text-dark-background dark:text-dark-foreground p-4">
      <SignUp
        appearance={{
          elements: {
            card: "bg-light-background dark:bg-dark-background border border-gray-700 rounded-2xl",
            headerTitle: "text-dark-foreground",
            headerSubtitle: "text-gray-400",
          },
        }}
        routing="hash"
        afterSignUpUrl="/"
        signInUrl="/login"
      />
    </main>
  );
}
