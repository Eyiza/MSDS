import { Schema, model, Document } from 'mongoose';
import robot from './robot';

const RecipientSchema = new Schema({
  name: { type: String, required: true },
  patient_ID: { type: String, unique: true },
  ward: String,
  room: String,
  location: { type: Schema.Types.ObjectId, ref: 'Location' },
  robot: { type: Schema.Types.ObjectId, ref: 'Robot' },
  rfidTag: { type: Schema.Types.ObjectId, ref: 'IdentificationTag' },
  bleBeacon: { type: Schema.Types.ObjectId, ref: 'IdentificationTag' },
  admissionDate: { type: Date, default: Date.now },
  medicalCondition: String,
  contactInformation: String,
  notes: String,
  deliveryHistory: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});