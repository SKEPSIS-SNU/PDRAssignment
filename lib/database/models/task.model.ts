import { Schema, model, models, Document } from "mongoose";

export interface Task extends Document {
  _id: string;
  track_id: string;
  task_name: string;
  task_description: string;
  image: string;
  read_more: string;
  dead_line: number;
  currentDate: number;
  createdAt: Date;
}

const TaskSchema = new Schema({
  track_id: { type: Schema.Types.ObjectId, ref: "Track", required: true },
  task_name: { type: String, required: true },
  task_description: { type: String, required: true },
  image: { type: String, default: "" },
  read_more: { type: String, default: "" },
  dead_line: { type: Number, default: 7 },
  currentDate: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Task = models?.Task || model("Task", TaskSchema);

export default Task;
