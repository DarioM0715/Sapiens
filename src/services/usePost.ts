//INTERFACES
import type { Post } from "@/types/post";

type ProductState = {
  post: Post[];
  loading: boolean;
  error: string | null;

  fetchPost: () => Promise<Post[]>;
  fetchPostById: (id: number) => Promise<Post>;
  createPost: (payload: Post) => Promise<Post>;
  updatePost: (id: number, patch: Partial<Post>) => Promise<Post>;
  deletePost: (id: number) => Promise<void>;

  resetError: () => void;
};

// export const useProductStore = create<ProductState>((set, get) => ({
//   post: [],
//   loading: false,
//   error: null,

//   resetError: () => set({ error: null }),

//   fetchPost: async () => {
//     set({ loading: true, error: null });
//     try {
//       const data = await api
//       set({ post: data, loading: false });
//       return data;
//     } catch (err: any) {
//       set({ error: err?.message ?? "Unknown error", loading: false });
//       return [];
//     }
//   },

//   createPost: async (payload) => {
//     set({ loading: true, error: null });
//     try {
//       const created = await api.create(payload);
//       set((state) => ({ post: [...state.post, created], loading: false }));
//       return created;
//     } catch (err: any) {
//       set({ error: err?.message ?? "Create failed", loading: false });
//       throw err;
//     }
//   },

//   updatePost: async (id, patch) => {
//     set({ loading: true, error: null });
//     try {
//       const updated = await api.update(id, patch);
//       set((state) => ({
//         post: state.post.map((d) => (d.id === id ? updated : d)),
//         loading: false,
//       }));
//       return updated;
//     } catch (err: any) {
//       set({ error: err?.message ?? "Update failed", loading: false });
//       throw err;
//     }
//   },

//   deletePost: async (id) => {
//     set({ loading: true, error: null });
//     try {
//       await api.remove(id);
//       set((state) => ({
//         post: state.post.filter((d) => d.id !== id),
//         loading: false,
//       }));
//     } catch (err: any) {
//       set({ error: err?.message ?? "Delete failed", loading: false });
//       throw err;
//     }
//   },

//   fetchPostById: async (id) => {
//     set({ loading: true, error: null });

//     try {
//       const db = await api.fetchById(id);
//       set((state) => {
//         const exists = state.post.some((d) => d.id === id);
//         return {
//           post: exists ? state.post.map((d) => (d.id === id ? db : d)) : [...state.post, db],
//           loading: false,
//         };
//       });
//       return db;
//     } catch (err: any) {
//       set({ error: err?.message ?? "Fetch by id failed", loading: false });
//       throw err;
//     }
//   },
// }));
