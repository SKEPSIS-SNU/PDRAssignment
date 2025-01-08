import { Schema, model, models, Document } from "mongoose";

export interface IMembership extends Document {
  _id: string;
  user_id: string;
  track_id: string;
  createdAt: Date;
}

const MembershipSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true},
  track_id: { type: Schema.Types.ObjectId, ref: "Track", required: true},
  createdAt: { type: Date, default: Date.now },
});

const Membership = models?.Membership || model("Membership", MembershipSchema);

export default Membership;
