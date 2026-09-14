import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    content: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0 },
    user: {
      userId: { type: String, index: true },
      name: String,
      username: String,
      avatar: String,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;