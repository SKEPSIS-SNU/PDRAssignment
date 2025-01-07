import { Schema, model, models } from "mongoose";

export interface IApplication extends Document {
  uid: string;
  trackId: string;
}

const ApplicationSchema = new Schema({
  uid: { type: Schema.Types.ObjectId, ref: "User", required: true },
  trackId: { type: Schema.Types.ObjectId, ref: "Track", required: true },
});

ApplicationSchema.index({ uid: 1, trackId: 1 }, { unique: true });

const Application =
  models?.Application || model("Application", ApplicationSchema);

export default Application;
