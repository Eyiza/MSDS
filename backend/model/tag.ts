import { Schema, model, Document } from 'mongoose';

// Define the IdentificationTag interface extending Document for Mongoose
export interface IIdentificationTag extends Document {
  type: string;
  tagCode: string;
  tagId: string;
  rssi?: number;
  assignedTo?: Schema.Types.ObjectId;
  assignedDate?: Date;
  lastScanned?: Date;
  status: string
}

const IdentificationTagSchema = new Schema({
  type: { type: String, enum: ['rfid', 'ble'], required: true },
  tagCode: { type: String, required: true, unique: true },
  tagId: { type: String, required: true, unique: true },
  rssi: Number,
  assignedTo: { type: Schema.Types.ObjectId, ref: 'Recipient' },
  assignedDate: Date,
  lastScanned: Date,
  status: { type: String, enum: ['active', 'available'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  usageHistory: [{
    task: { type: Schema.Types.ObjectId, ref: 'Task' },
    timestamp: Date,
    rssi: Number,
  }],
});

export default model<IIdentificationTag>('IdentificationTag', IdentificationTagSchema);