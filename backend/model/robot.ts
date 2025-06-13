import { Schema, model, Document } from 'mongoose';

// Define the Robot interface extending Document for Mongoose
export interface IRobot extends Document {
  name: string;
  serialNumber: string;
  status: string;
  ipAddress: string;
  currentMode: string;
  lastOnline: Date;
  locations: Schema.Types.ObjectId[];
  deliveries: Schema.Types.ObjectId[];
  createdAt: Date;
}

const RobotSchema = new Schema({
  name: { type: String, required: true },
  serialNumber: { type: String, unique: true },
  status: { type: String, enum: ['active', 'inactive', 'out_of_order'], default: 'active' },
  ipAddress: String,
  uptime: Number,
  batteryLevel: Number,
  currentMode: { type: String, enum: ['standby', 'delivery', 'mapping', 'manual'] },
  lastOnline: Date,
  lastLocation: {
    x: Number,
    y: Number,
    orientation: Number,
  },
  locations: {
    type: [Schema.Types.ObjectId],
    ref: 'Location', 
  },
  deliveries: {
    type: [Schema.Types.ObjectId],
    ref: 'Task', 
  },
  settings: {
    maxSpeed: { type: Number, default: 0.5 }, // Default speed in m/s
    maxSpeedUnits: { type: String, enum: ['m/s', '%'], default: 'm/s' }, // Default speed unit
    waitTimeAtDelivery: { type: Number, required: true, default: 50 }, // Default wait time in seconds
    retryCount: { type: Number, required: true, default: 3 }, // Default Delivery Retry Count
    requireRFIDConfirmation: { type: Boolean, default: true }, // Default RFID confirmation requirement
    autoDockingEnabled: { type: Boolean, default: false }, // Default auto-docking setting
    defaultMessage: { type: String, default: 'Hello, I have a delivery for you. Please scan your RFID tag to confirm.' }, // Default message
  },
//   map: {
//     width: { type: Number, required: true }, 
//     height: { type: Number, required: true }, 
//     resolution: { type: Number, required: true }, 
//     origin: {
//         x: { type: Number, required: true },
//         y: { type: Number, required: true },
//         theta: { type: Number, required: false }, 
//     },
//     data: {
//         type: [Number], // Array of occupancy values: -1, 0, 100
//         required: true,
//     },
//     frame_id: { type: String, default: 'map' },
//     timestamp: { type: Date, default: Date.now }
//   },
//   users: [{
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//   }],
  createdAt: { type: Date, default: Date.now },
});

export default model<IRobot>('Robot', RobotSchema);