// Paginación por cursor: el backend devuelve los items y el cursor de la página siguiente.
// nextCursor es null cuando ya no hay más que cargar, así que no existe el total de páginas.
export type CursorPage<T> = {
  nextCursor: string | null;
  hasMore: boolean;
};

export type CursorParams = {
  limit?: number;
  cursor?: string;
};

export type PostsPage = CursorPage<unknown> & { posts: import("./post").Post[] };
export type UsersPage = CursorPage<unknown> & { users: import("./users").User[] };