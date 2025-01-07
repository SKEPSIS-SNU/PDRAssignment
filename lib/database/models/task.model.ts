import { Schema, model, models, Document } from "mongoose";

export interface Task extends Document {
  _id: string;
  trackId: string;
  taskName: string;
  taskDescription: string;
  deadLine: number;
  currentDate: number;
}

const TaskSchema = new Schema({
  trackId: { type: Schema.Types.ObjectId, ref: "Track", required: true },
  taskName: { type: String, required: true },
  taskDescription: { type: String, required: true },
  deadLine: { type: Number, default: 7 }, // 7 days
  currentDate: { type: Number, default: 0 }, // current day
});

const Task = models?.Task || model("Task", TaskSchema);

export default Task;
