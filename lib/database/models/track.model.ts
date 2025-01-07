import { Schema, model, models, Document } from "mongoose";

export interface ITrack extends Document {
  _id: string;
  label: string;
  trackName: string;
  trackDescription: string;

  applications: string[];
  createdAt: Date;
}

const TrackSchema = new Schema({
  label: { type: String, required: true },
  trackName: { type: String, required: true, unique: true },
  trackDescription: { type: String, default: "" },

  applications: [{ type: Schema.Types.ObjectId, ref: "Application" }],

  createdAt: { type: Date, default: Date.now },
});

const Track = models?.Track || model("Track", TrackSchema);

export default Track;
