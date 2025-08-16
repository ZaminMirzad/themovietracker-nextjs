import { NextResponse } from 'next/server';
import { getBookmarks } from '@/lib/instantdb';

export async function GET() {
  try {
    const bookmarks = await getBookmarks();
    return NextResponse.json({ bookmarks: bookmarks ?? [] });
  } catch (e) {
    console.error('GET /api/bookmarks error', e);
    return NextResponse.json({ bookmarks: [] }, { status: 200 });
  }
}
