import { NextResponse } from "next/server";

import { id, init } from "@instantdb/admin";
import schema from "@/instant.schema";

const db = init({
  appId:
    process.env.NEXT_PUBLIC_INSTANTDB_APP_ID ||
    "c44f4cc0-9caa-459c-8c8b-8e655445d4f8",
  adminToken:
    process.env.NEXT_PUBLIC_INSTANT_APP_ADMIN_TOKEN ||
    "df816330-ae91-4ba2-8f17-c5648efaa7dc",
  schema,
});

// get bookmarks
export async function GET() {
  try {
    const data = await db.query({ bookmarks: {} });
    return NextResponse.json(
      { bookmarks: data?.bookmarks || [] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

// add to bookmarks in try/catch block and return the data from instantdb
export async function POST(request: Request) {
  const body = await request.json();
  const bookmark = body.bookmark; // Extract from the wrapped object

  try {
    // Validate required fields
    if (!bookmark?.movieId || !bookmark?.media_type) {
      console.error("Missing required fields:", {
        movieId: bookmark?.movieId,
        media_type: bookmark?.media_type,
      });
      return NextResponse.json(
        {
          error: "Missing required fields: movieId and media_type are required",
        },
        { status: 400 }
      );
    }

    // Use a timestamp-based ID for the new bookmark
    const bookmarkId = id();

    const data = await db.transact(
      db.tx.bookmarks[bookmarkId].update({
        title: bookmark.title,
        poster_path: bookmark.poster_path,
        backdrop_path: bookmark.backdrop_path,
        media_type: bookmark.media_type,
        added_at: new Date().toISOString(),
        movieId: bookmark.movieId,
        overview: bookmark.overview,
      })
    );

    // Fetch updated bookmarks list to return
    const updatedBookmarks = await db.query({ bookmarks: {} });

    return NextResponse.json(
      {
        message: "Bookmark added successfully",
        bookmarks: updatedBookmarks?.bookmarks || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding bookmark:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// remove bookmark
export async function DELETE(request: Request) {
  const req = await request.json();
  const removeId = req.bookmark?.id;

  try {
    if (!removeId) {
      console.error("No bookmark ID provided in request");
      return NextResponse.json(
        { error: "No bookmark ID provided" },
        { status: 400 }
      );
    }

    const data = await db.transact(db.tx.bookmarks[removeId].delete());

    // Fetch updated bookmarks list to return
    const updatedBookmarks = await db.query({ bookmarks: {} });

    return NextResponse.json(
      {
        message: "Bookmark removed successfully",
        bookmarks: updatedBookmarks?.bookmarks || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
