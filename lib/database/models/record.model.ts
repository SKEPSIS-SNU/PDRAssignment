import { Schema, model, models, Document } from "mongoose";

export interface IRecord extends Document {
  _id: string;
  uid: string;
  trackId: string;
  tasksInfo: {
    taskId: string;
    taskStatus: string;
    taskErrorNote: string;
    submissionId: string;
    taskGitHubUrl: string;
    taskKglUrl: string;
    taskWebUrl: string;
  }[];
  createdAt: Date;
}

const RecordSchema = new Schema({
  uid: { type: Schema.Types.ObjectId, ref: "User", required: true },
  trackId: { type: Schema.Types.ObjectId, ref: "Track", required: true },
  tasksInfo: [
    {
      _id: false,
      taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
      taskStatus: {
        type: String,
        enum: ["in-progress", "review", "completed"],
        default: "in-progress",
      },
      taskErrorNote: { type: String, default: "" },
      submissionId: { type: Schema.Types.ObjectId, ref: "Submission" },
      taskGitHubUrl: { type: String, default: "" },
      taskKglUrl: { type: String, default: "" },
      taskWebUrl: { type: String, default: "" },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

RecordSchema.index({ uid: 1, trackId: 1 }, { unique: true });

const Record = models?.Record || model("Record", RecordSchema);

export default Record;
