import { Schema, model, models, Document } from "mongoose";

interface Submission extends Document {
  _id: string;
  user_id: string;
  track_id: string;
  task_id: string;
  createdAt: Date;
}

const SubmissionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  track_id: { type: Schema.Types.ObjectId, ref: "Track", required: true },
  task_id: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Submission = models?.Submission || model("Submission", SubmissionSchema);

export default Submission;
