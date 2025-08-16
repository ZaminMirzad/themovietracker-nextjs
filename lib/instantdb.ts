"use client";

import schema from "@/instant.schema";
import { init, InstaQLEntity } from "@instantdb/react";

export type MediaType = "movie" | "tv";

export type BookmarkRecord = {
  id: string; // TMDB id
  title?: string;
  poster_path?: string;
  backdrop_path?: string;
  media_type: MediaType;
  added_at: string;
};

const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID || "c44f4cc0-9caa-459c-8c8b-8e655445d4f8";

// export const schema = i.schema({
//   entities: {
//     bookmarks: i.entity({
//       id: i.string(), // Store TMDB id as string
//       title: i.string().optional(),
//       poster_path: i.string().optional(),
//       backdrop_path: i.string().optional(),
//       media_type: i.string(),
//       added_at: i.string(),
//       userId: i.string(),
//     }),
//   },
//   rooms: {
//     bookmarks: { presence: i.entity({}) },
//     users:{presence:i.entity({})}
//   },
// });

export type Bookmark = InstaQLEntity<typeof schema, "bookmarks">;

export const db = init({ appId: APP_ID ,schema});
export const room = db.room();

// --- API Route Helpers --- //
export  function getBookmarks()  {
  // const { data } =  db.useQuery({ bookmarks: { } });
  // console.log(data)
}

// export async function upsertBookmark(userId: string, record: Omit<BookmarkRecord, "userId">) {
//   db.transact(
//     db.tx.bookmarks[id()].update({
//       ...record,
//       id: String(record.id),
//       userId,
//       added_at: record.added_at ?? new Date().toISOString(),
//     })
//   );
// }

// export async function deleteBookmark(userId: string, record: { id: string | number; media_type: MediaType }) {
//   // Find the bookmark first
//   const bookmarks = await getBookmarks(userId);
//   const existing = bookmarks.find(
//     (b) => b.id === String(record.id) && b.media_type === record.media_type
//   );
//   if (existing) {
//     db.transact(db.tx.bookmarks[existing.id].delete());
//   }
// }



// "use client";

// import { id, i, init, InstaQLEntity } from "@instantdb/react";

// // ----------- Types ----------- //
// export type MediaType = "movie" | "tv";

// export type BookmarkRecord = {
//   id: string | number; // TMDB id
//   title?: string;
//   poster_path?: string;
//   backdrop_path?: string;
//   media_type: MediaType;
//   added_at: string;
//   userId: string;
// };

// // ----------- InstantDB Setup ----------- //
// const APP_ID = "c44f4cc0-9caa-459c-8c8b-8e655445d4f8";

// export const schema = i.schema({
//   entities: {
//     bookmarks: i.entity({
//       id: i.string(), // TMDB id as string
//       title: i.string().optional(),
//       poster_path: i.string().optional(),
//       backdrop_path: i.string().optional(),
//       media_type: i.string(), // "movie" or "tv"
//       added_at: i.string(),
//       userId: i.string(),
//     }),
//   },
//   rooms: {
//     bookmarks: {
//       presence: i.entity({}),
//     },
//   },
// });

// export type Bookmark = InstaQLEntity<typeof schema, "bookmarks">;

// export const db = init({ appId: APP_ID, schema });
// export const room = db.room("bookmarks");

// // ----------- DB Actions ----------- //

// // Save bookmark
// export function addBookmark(record: BookmarkRecord) {
//   db.transact(
//     db.tx.bookmarks[id()].update({
//       ...record,
//       id: String(record.id), // Ensure it's stored as string
//     })
//   );
// }

// // Delete bookmark
// export function deleteBookmark(bookmark: Bookmark) {
//   db.transact(db.tx.bookmarks[bookmark.id].delete());
// }

// // Toggle bookmark
// export function toggleBookmark(record: BookmarkRecord, bookmarks: Bookmark[]) {
//   const existing = bookmarks.find((b) => b.id === String(record.id));
//   if (existing) {
//     deleteBookmark(existing);
//   } else {
//     addBookmark(record);
//   }
// }

// function assertConfig() {
//   if (!APP_ID) throw new Error('INSTANTDB_APP_ID is not set');
//   if (!ADMIN_KEY) throw new Error('INSTANTDB_ADMIN_KEY is not set');
// }

// async function api<T = any>(path: string, body: unknown): Promise<T> {
//   assertConfig();
//   const res = await fetch(`${API_URL}/v1/apps/${APP_ID}${path}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${ADMIN_KEY}`,
//     },
//     body: JSON.stringify(body),
//     cache: 'no-store',
//   });
//   // Allow empty bodies gracefully
//   const text = await res.text();
//   if (!text) return {} as T;
//   return JSON.parse(text) as T;
// }

// // Query bookmarks for a user
// export async function getBookmarks(userId: string): Promise<BookmarkRecord[]> {
//   const out = await api<{ data?: BookmarkRecord[] }>(`/collections/bookmarks/query`, {
//     filter: { userId },
//     orderBy: [{ added_at: 'desc' }],
//   });
//   return out?.data ?? [];
// }

// type UpsertInput = {
//   id: string | number;
//   media_type: MediaType;
//   title?: string;
//   poster_path?: string;
//   backdrop_path?: string;
//   added_at?: string;
// };

// // Upsert a bookmark (unique by userId + id + media_type)
// export async function upsertBookmark(userId: string, input: UpsertInput): Promise<void> {
//   const payload: BookmarkRecord = {
//     userId,
//     id: input.id,
//     media_type: input.media_type,
//     title: input.title,
//     poster_path: input.poster_path,
//     backdrop_path: input.backdrop_path,
//     added_at: input.added_at ?? new Date().toISOString(),
//   };

//   await api(`/collections/bookmarks/upsert`, {
//     where: { userId, id: input.id, media_type: input.media_type },
//     data: payload,
//   });
// }

// // Delete a bookmark (by userId + id + media_type)
// export async function deleteBookmark(
//   userId: string,
//   input: { id: string | number; media_type: MediaType }
// ): Promise<void> {
//   await api(`/collections/bookmarks/delete`, {
//     filter: { userId, id: input.id, media_type: input.media_type },
//   });
// }


