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
  deliveryHistory: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  createdAt: { type: Date, default: Date.now }
});

export default model<IRecipient>('Recipient', RecipientSchema);