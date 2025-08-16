import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getBookmarks } from '@/lib/instantdb';

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
