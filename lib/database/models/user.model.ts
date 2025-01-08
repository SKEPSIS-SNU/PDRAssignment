import { Schema, model, models, Document } from "mongoose";

export interface User extends Document {
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  photo: string;
  createdAt: Date;
}

const UserSchema = new Schema({
  clerk_id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  first_name: { type: String, default: "" },
  last_name: { type: String, default: "" },
  photo: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const User = models?.User || model("User", UserSchema);

export default User;
