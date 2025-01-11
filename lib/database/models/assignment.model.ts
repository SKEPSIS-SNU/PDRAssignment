import { Schema, model, models, Document } from "mongoose";

export interface IAssignment extends Document {
  _id: string;
  user_id: string;
  task_id: string;
  track_id: string;
  status: string;
  note: string;
  error_note: string;
  submission_id: string;
  github_link: string;
  kaggle_link: string;
  website_link: string;
}

const AssignmentSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  task_id: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  track_id: { type: Schema.Types.ObjectId, ref: "Track", required: true },
  status: {
    type: String,
    enum: ["in-progress", "review", "completed"],
    default: "in-progress",
  },
  note: { type: String, default: "" },
  error_note: { type: String, default: "" },
  submission_id: {
    type: Schema.Types.ObjectId,
    ref: "Submission",
    default: null,
  },
  github_link: { type: String, default: "" },
  kaggle_link: { type: String, default: "" },
  website_link: { type: String, default: "" },
});
AssignmentSchema.index({ user_id: 1, task_id: 1 }, { unique: true });

const Assignment = models?.Assignment || model("Assignment", AssignmentSchema);

export default Assignment;
