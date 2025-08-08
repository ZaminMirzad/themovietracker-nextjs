import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ bookmarks: [] }, { status: 200 });
  }
  const bookmarks = (user.publicMetadata as any)?.bookmarks || [];
  return NextResponse.json({ bookmarks });
}

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const user = await clerkClient.users.getUser(userId);
    const current = ((user.publicMetadata as any)?.bookmarks || []) as any[];
    const exists = current.find((b) => b.id === body.id && b.media_type === body.media_type);
    if (!exists) {
      const updated = [...current, body];
      await clerkClient.users.updateUser(userId, {
        publicMetadata: { ...user.publicMetadata, bookmarks: updated },
      });
      return NextResponse.json({ success: true, bookmarks: updated });
    }
    return NextResponse.json({ success: true, bookmarks: current });
  } catch (e) {
    console.error('POST /api/bookmarks error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, media_type } = body;
    const user = await clerkClient.users.getUser(userId);
    const current = ((user.publicMetadata as any)?.bookmarks || []) as any[];
    const updated = current.filter((b) => !(String(b.id) === String(id) && b.media_type === media_type));
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { ...user.publicMetadata, bookmarks: updated },
    });
    return NextResponse.json({ success: true, bookmarks: updated });
  } catch (e) {
    console.error('DELETE /api/bookmarks error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
