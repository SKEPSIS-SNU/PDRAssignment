import { Schema, model, models, Document } from "mongoose";

export interface ITrack extends Document {
  _id: string;
  track_name: string;
  track_description: string;
  banner: string;
  createdAt: Date;
}

const TrackSchema = new Schema({
  track_name: { type: String, required: true, unique: true },
  track_description: { type: String, default: "" },
  banner: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Track = models?.Track || model("Track", TrackSchema);

export default Track;
