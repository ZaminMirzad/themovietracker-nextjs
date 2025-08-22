"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background text-dark-background dark:text-dark-foreground p-3 sm:p-4">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              card: "bg-light-background dark:bg-dark-background border border-gray-700 rounded-2xl shadow-2xl",
              headerTitle: "text-dark-foreground text-xl sm:text-2xl",
              headerSubtitle: "text-gray-400 text-sm sm:text-base",
              formButtonPrimary: "bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base py-2 sm:py-3",
              formFieldInput: "text-sm sm:text-base py-2 sm:py-3",
              formFieldLabel: "text-sm sm:text-base",
              footerActionLink: "text-sm sm:text-base",
              footerAction: "text-sm sm:text-base",
            },
          }}
          routing="hash"
          afterSignUpUrl="/"
          signInUrl="/login"
        />
      </div>
    </main>
  );
}
