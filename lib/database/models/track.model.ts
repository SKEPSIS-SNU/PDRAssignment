import { Schema, model, models, Document } from "mongoose";

export interface ITrack extends Document {
  _id: string;
  track_name: string;
  track_description: string;
  tasks: string[];
  applications: string[];
  createdAt: Date;
}

const TrackSchema = new Schema({
  track_name: { type: String, required: true, unique: true },
  track_description: { type: String, default: "" },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  applications: [{ type: Schema.Types.ObjectId, ref: "Application" }],

  createdAt: { type: Date, default: Date.now },
});

const Track = models?.Track || model("Track", TrackSchema);

export default Track;
