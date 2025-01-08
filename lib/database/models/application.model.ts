import { Schema, model, models } from "mongoose";

export interface IApplication extends Document {
  user_id: string;
  track_id: string;
}

const ApplicationSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  track_id: { type: Schema.Types.ObjectId, ref: "Track", required: true },
});

ApplicationSchema.index({ user_id: 1, track_id: 1 }, { unique: true });

const Application =
  models?.Application || model("Application", ApplicationSchema);

export default Application;
