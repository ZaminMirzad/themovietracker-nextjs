// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    bookmarks: i.entity({
      movieId: i.any().unique().indexed(), // Indexed for fast lookups
      title: i.string().optional(),
      poster_path: i.string().optional(),
      backdrop_path: i.string().optional(),
      media_type: i.string().indexed(), // Indexed for fast lookups
      added_at: i.string().optional(), // Added this missing field
      overview: i.string().optional(),
    }),
  },
  links: {},
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
