import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null, index: true },
    title: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    content: { type: String, default: "" },
    time: { type: String, default: "" },
    categories: { type: [String], default: [] },
    views: { type: Number, default: 0 },
    messages: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
    dislikedBy: { type: [String], default: [] },
    savedBy: { type: [String], default: [] },
    media: { type: [{ name: String, url: String }], default: [] },
    user: {
      userId: { type: String, index: true },
      name: String,
      username: String,
      avatar: String,
    },
    institution: { type: String, default: "" },
    type: { type: String, default: "" },
    documentUrl: { type: String, default: "" },
    bibliography: { type: [{ title: String, description: String, url: String }], default: [] },
  },
  { timestamps: true }
);

// Índices compuestos para la paginación por cursor: cada listado filtra y ordena por
// (createdAt, _id), así que el prefijo del índice debe ser el filtro de la consulta.
postSchema.index({ parentId: 1, createdAt: -1, _id: -1 });
postSchema.index({ "user.userId": 1, parentId: 1, createdAt: -1, _id: -1 });
postSchema.index({ savedBy: 1, parentId: 1, createdAt: -1, _id: -1 });
postSchema.index({ likedBy: 1, parentId: 1, createdAt: -1, _id: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;