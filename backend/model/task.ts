import { Schema, model, Document } from 'mongoose';

// Define the Task interface extending Document for Mongoose
export interface ITask extends Document {
  task_id: string;
  recipient: Schema.Types.ObjectId;
  robot: Schema.Types.ObjectId;
  message: string;
  location: Schema.Types.ObjectId;
  status: string; 
  deliveryItem?: string;
  failureReason?: string;
  deliveryTimeline: {
    create?: Date;
    queued?: Date;
    start?: Date;
    complete?: Date;
    fail?: Date;
  };
  createdAt: Date;
}
 
const TaskSchema = new Schema({
  task_id: { type: String, unique: true, required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'Recipient', required: true },
  robot: { type: Schema.Types.ObjectId, ref: 'Robot' },
  message: String,
  location: { type: Schema.Types.ObjectId, ref: 'Location' },
  status: { type: String, enum: ['todo', 'queued', 'active', 'completed', 'missed'], default: 'todo' },
  deliveryItem: String,
  failureReason: String,
  createdAt: { type: Date, default: Date.now },
  deliveryTimeline: {
    create: Date,
    queued: Date,
    start: Date,
    complete: Date,
    fail: Date
  },
});

export default model<ITask>('Task', TaskSchema);