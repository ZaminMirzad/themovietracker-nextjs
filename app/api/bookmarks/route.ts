import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import {  getBookmarks } from '@/lib/instantdb';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ bookmarks: [] }, { status: 200 });
    }
    const bookmarks = await getBookmarks();
    return NextResponse.json({ bookmarks: bookmarks ?? [] });
  } catch (e) {
    console.error('GET /api/bookmarks error', e);
    return NextResponse.json({ bookmarks: [] }, { status: 200 });
  }
}

// export async function POST(req: NextRequest) {
//   const session = await auth();
//   const userId = session?.userId;
//   if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//   try {
//     const body = await req.json();
//     // body: { id, tmdbId?, media_type, title?, poster_path?, backdrop_path?, added_at? }
//     await upsertBookmark(userId, body);
//     const bookmarks = await getBookmarks(userId);
//     return NextResponse.json({ success: true, bookmarks: bookmarks ?? [] });
//   } catch (e) {
//     console.error('POST /api/bookmarks error', e);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }

// export async function DELETE(req: NextRequest) {
//   const session = await auth();
//   const userId = session?.userId;
//   if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//   try {
//     const body = await req.json();
//     const { id, media_type } = body;
//     await deleteBookmark(userId, { id, media_type });
//     const bookmarks = await getBookmarks(userId);
//     return NextResponse.json({ success: true, bookmarks: bookmarks ?? [] });
//   } catch (e) {
//     console.error('DELETE /api/bookmarks error', e);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }
