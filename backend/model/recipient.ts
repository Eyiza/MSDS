import { Schema, model, Document } from 'mongoose';

// Define the Recipient interface extending Document for Mongoose
export interface IRecipient extends Document {
  name: string;
  patient_ID: string;
  location: Schema.Types.ObjectId;
  robot: Schema.Types.ObjectId;
  rfidTag: Schema.Types.ObjectId;
  bleBeacon: Schema.Types.ObjectId;
  admissionDate: Date;
  medicalCondition?: string;
  contactInformation?: string;
  notes?: string;
  checkOutDate?: Date;
  status: string;
  deliveryHistory: Schema.Types.ObjectId[];
  createdAt: Date;
}

const RecipientSchema = new Schema({
  name: { type: String, required: true },
  patient_ID: { type: String, unique: true },
  location: { type: Schema.Types.ObjectId, ref: 'Location' },
  robot: { type: Schema.Types.ObjectId, ref: 'Robot' },
  rfidTag: { type: Schema.Types.ObjectId, ref: 'IdentificationTag' },
  bleBeacon: { type: Schema.Types.ObjectId, ref: 'IdentificationTag' },
  admissionDate: { type: Date, default: Date.now },
  medicalCondition: String,
  contactInformation: String,
  notes: String,
  checkOutDate: Date,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  deliveryHistory: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  createdAt: { type: Date, default: Date.now }
});

export default model<IRecipient>('Recipient', RecipientSchema);