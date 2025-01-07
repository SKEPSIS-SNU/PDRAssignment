import { Schema, model, models, Document } from "mongoose";

interface Submission extends Document {
  _id: string;
  uid: string;
  trackId: string;
  taskId: string;
  createdAt: Date;
}

const SubmissionSchema = new Schema({
  uid: { type: Schema.Types.ObjectId, ref: "User", required: true },
  trackId: { type: Schema.Types.ObjectId, ref: "Track", required: true },
  taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Submission = models?.Submission || model("Submission", SubmissionSchema);

export default Submission;
