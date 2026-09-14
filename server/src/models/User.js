import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    name: { type: String, trim: true, default: "" },
    avatar: { type: String, default: "" },
    sex: { type: String, enum: ["masculino", "femenino"], default: "masculino" },
    background: { type: String, default: "" },
    note: { type: String, default: "" },
    theme: { type: String, default: "light" },
    role: {
      id: { type: Number, default: 0 },
      name: { type: String, enum: ["alumno", "profesor", "moderador"], default: "alumno" },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;