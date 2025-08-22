"use client";

import { useAppStore } from "@/store/useStore";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // No need to fetch bookmarks here - they will be fetched when the bookmarks page is opened

  return <>{children}</>;
}
