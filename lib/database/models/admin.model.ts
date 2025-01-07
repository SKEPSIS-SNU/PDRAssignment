import { Schema, model, models, Document } from "mongoose";

export interface Admin extends Document {
  clerk_id: string;
  username: string;
  email: string;
}

const AdminSchema = new Schema({
  clerk_id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
});

const Admin = models?.Admin || model("Admin", AdminSchema);

export default Admin;
