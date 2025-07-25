import { Schema, model, Document } from 'mongoose';

// Define the Location interface extending Document for Mongoose
export interface ILocation extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  coordinates: {
    x: number;
    y: number;
  };
  description: string;
  robot: Schema.Types.ObjectId;
  type: string;
  createdAt: Date;
}

const LocationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  coordinates: {
    x: Number,
    y: Number,
  },
  robot: {
    type: Schema.Types.ObjectId,
    ref: 'Robot',
    required: true,
  },
  description: String,
  type: { type: String, enum: ['ward', 'base', 'room'], default: 'room' },
  createdAt: { type: Date, default: Date.now },
});

export default model<ILocation>('Location', LocationSchema);