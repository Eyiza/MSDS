import { Schema, model, Document } from 'mongoose';

// Define the User interface extending Document for Mongoose
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'engineer', 'operator'], default: 'operator' },
  createdAt: { type: Date, default: Date.now },
}, {
  versionKey: false,
  timestamps: true,
});

export default model<IUser>('User', UserSchema);