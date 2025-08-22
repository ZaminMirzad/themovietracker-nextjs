"use client";

import { useAuth } from "@clerk/nextjs";
import { init } from "@instantdb/react";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  const { getToken, signOut } = useAuth();
  const db = init({
    appId:
      process.env.NEXT_PUBLIC_INSTANTDB_APP_ID ||
      "c44f4cc0-9caa-459c-8c8b-8e655445d4f8",
  });

  const signInToInstantWithClerkToken = async () => {
    // getToken gets the jwt from Clerk for your signed in user.
    const idToken = await getToken();

    if (!idToken) {
      // No jwt, can't sign in to instant
      return;
    }

    // Create a long-lived session with Instant for your clerk user
    // It will look up the user by email or create a new user with
    // the email address in the session token.
    db.auth.signInWithIdToken({
      clientName: "clerk",
      idToken: idToken,
    });
  };

  const { user } = db.useAuth();

  if (user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background text-dark-background dark:text-dark-foreground p-3 sm:p-4">
        <div className="text-center space-y-4">
          <p className="text-base sm:text-lg">Signed in with Instant through Clerk!</p>
          <button
            onClick={() => {
              // First sign out of Instant to clear the Instant session.
              db.auth.signOut().then(() => {
                // Then sign out of Clerk to clear the Clerk session.
                signOut();
              });
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            Sign out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background text-dark-background dark:text-dark-foreground p-3 sm:p-4">
      <div className="w-full max-w-md">
        <SignIn
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
          afterSignInUrl="/"
          signUpUrl="/signup"
        />
      </div>
    </main>
  );
}
