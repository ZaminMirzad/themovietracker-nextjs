"use client";

import { useAuth } from "@clerk/nextjs";
import { init } from "@instantdb/react";

export default function LoginPage() {
  const { isSignedIn, getToken,signOut } = useAuth();
  const db = init({ appId: process.env.NEXT_PUBLIC_INSTANTDB_APP_ID ||"c44f4cc0-9caa-459c-8c8b-8e655445d4f8" });


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

  // useEffect(() => {
  //   if (isSignedIn) {
  //     signInToInstantWithClerkToken();
  //   }
  // }, []);

  const { isLoading, user, error } = db.useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error signing in to Instant! {error.message}</div>;


    if (user) {
      return (
        <div>
          <p>Signed in with Instant through Clerk!</p>{' '}
          <button
            onClick={() => {
              // First sign out of Instant to clear the Instant session.
              db.auth.signOut().then(() => {
                // Then sign out of Clerk to clear the Clerk session.
                signOut();
              });
            }}
          >
            Sign out
          </button>
        </div>
      );
    }
    return (
      <div>
        <button onClick={signInToInstantWithClerkToken}>
          Sign in to Instant
        </button>
      </div>
    );  }
  // if (user) {
  // return (
  //   <main className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background text-dark-background dark:text-dark-foreground p-4">
  //     <SignIn
  //       appearance={{
  //         elements: {
  //           card: "bg-light-background dark:bg-dark-background border border-gray-700 rounded-2xl",
  //           headerTitle: "text-dark-foreground",
  //           headerSubtitle: "text-gray-400",
  //         },
  //       }}
      
  //       routing="hash"
  //       afterSignInUrl="/"
  //       signUpUrl="/signup"
  //     />
  //   </main>
  // );
}

