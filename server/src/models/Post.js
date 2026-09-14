import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    time: { type: String, default: "" },
    categories: { type: [String], default: [] },
    views: { type: Number, default: 0 },
    messages: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
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

const Post = mongoose.model("Post", postSchema);

export default Post;