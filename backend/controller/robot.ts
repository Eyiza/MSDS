import Robot, { IRobot } from "../model/robot";
import Task from "../model/task";
import Recipient from "../model/recipient";
import Location from "../model/location";
import IdentificationTag from '../model/tag';

import { FastifyRequest, FastifyReply } from "fastify";

export const createRobot = async (req: FastifyRequest<{ Body: IRobot }>, res: FastifyReply) => {
  const { name, serialNumber, ipAddress } = req.body;
  try {
    const robot = new Robot({
      name,
      serialNumber,
      ipAddress
    });
    await robot.save();
    
    return res.status(200)
        // .header('Content-Type', 'application/json; charset=utf-8')
        .send({
            success: true,
            message: "Robot created successfully",
            robot,
        });
  } catch (error) {
    console.error("Error creating robot:", error);
    res.status(500).send({
        success: false,
        message: "Error creating robot",
        error,
    });
  }
};

export const getRobots = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const robots = await Robot.find()
      .populate("locations")
      .populate("deliveries");
    return res.status(200).send({
      success: true,
      message: "Robots fetched successfully",
      robots,
    });
  } catch (error) {
    console.error("Error fetching robots:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching robots",
      error,
    });
  }
};

export const getRobotById = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  const { id } = req.params;
  try {
    const robot = await Robot.findById(id)
      .populate("locations")
      .populate("deliveries");
    if (!robot) {
      return res.status(404).send({
        success: false,
        message: "Robot not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Robot fetched successfully",
      robot,
    });
  } catch (error) {
    console.error("Error fetching robot:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching robot",
      error,
    });
  }
};

export const updateRobot = async (req: FastifyRequest<{ Params: { id: string }, Body: Partial<IRobot> }>, res: FastifyReply) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const robot = await Robot.findByIdAndUpdate(id, updateData, { new: true })
      .populate("locations")
      .populate("deliveries");
    if (!robot) {
      return res.status(404).send({
        success: false,
        message: "Robot not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Robot updated successfully",
      robot,
    });
  } catch (error) {
    console.error("Error updating robot:", error);
    res.status(500).send({
      success: false,
      message: "Error updating robot",
      error,
    });
  }
};

export const deactivateRobot = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  const { id } = req.params;
  try {
    const robot = await Robot.findByIdAndUpdate(id, {  status: 'out_of_order' }, { new: true })
      .populate("locations")
      .populate("deliveries");
    if (!robot) {
      return res.status(404).send({
        success: false,
        message: "Robot not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Robot deactivated successfully",
      robot,
    });
  } catch (error) {
    console.error("Error deactivating robot:", error);
    res.status(500).send({
      success: false,
      message: "Error deactivating robot",
      error,
    });
  }
};

export const resetRobot = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  const { id } = req.params;
  try {
    const robot = await Robot.findById(id);
    if (!robot) {
      return res.status(404).send({
        success: false,
        message: "Robot not found",
      });
    }
    // Reset robot settings
    robot.status = 'active';
    robot.currentMode = 'standby';
    robot.settings = {
      maxSpeed: 0.5,
      maxSpeedUnits: 'm/s',
      waitTimeAtDelivery: 50,
      retryCount: 3,
      requireRFIDConfirmation: true,
      autoDockingEnabled: false,
      defaultMessage: 'Hello, I have a delivery for you. Please scan your RFID tag to confirm.',
    };
    robot.locations = [];
    robot.deliveries = [];
    await robot.save();
    return res.status(200).send({
      success: true,
      message: "Robot reset successfully",
      robot,
    });
  } catch (error) {
    console.error("Error resetting robot:", error);
    res.status(500).send({
      success: false,
      message: "Error resetting robot",
      error,
    });
  }
};

export const startQueuedTasks = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  const { id } = req.params;
  try {
    const robot = await Robot.findById(id);
    if (!robot) {
      return res.status(404).send({
        success: false,
        message: "Robot not found",
      });
    }
    const tasks = await Task.find({ robot: id, status: 'queued' });
    if (!tasks.length) {
      return res.status(404).send({
        success: false,
        message: "No queued tasks found for this robot",
      });
    }
    tasks.forEach(task => {
      task.status = 'active';
      // task.deliveryTimeline.start = new Date();
      task.save();
    });
    return res.status(200).send({
      success: true,
      message: "Queued tasks started successfully",
      tasks
    });
  } catch (error) {
    console.error("Error starting queued tasks:", error);
    return res.status(500).send({
      success: false,
      message: "Error starting queued tasks",
      error
    });
  }
};

export const taskCreationData  = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  const { id } = req.params;
  try {
    const robot = await Robot.findById(id);
    if (!robot) {
      return res.status(404).send({
        success: false,
        message: "Robot not found",
      });
    }
    const recipients = await Recipient.find({ robot: id, status: 'active' })
        .populate({
            path: 'location',
            select: '_id name type',
        })
        .populate({
            path: 'rfidTag',
            select: '_id type tagCode',
        })
        .populate({
            path: 'bleBeacon',
            select: '_id type tagCode',
        })
        .populate({
            path: 'deliveryHistory',
            select: '_id task_id status createdAt deliveryTimeline',
        });
    
    return res.status(200).send({
      success: true,
      message: "Recipient creation data fetched successfully",
      recipients
    });
  } catch (error) {
    console.error("Error fetching recipient creation data:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching recipient creation data",
      error
    });
  }
};

export const recipientCreationData = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  const { id } = req.params;
  try {
    const robot = await Robot.findById(id);
    if (!robot) {
      return res.status(404).send({
        success: false,
        message: "Robot not found",
      });
    }
    const locations = await Location.find({ robot: id }).select('_id name type');
    const RFID_Tags = await IdentificationTag.find({ type: 'rfid', status: 'available' }).select('_id tagCode');
    const BLE_Beacons = await IdentificationTag.find({ type: 'ble', status: 'available' }).select('_id tagCode');

    return res.status(200).send({
      success: true,
      message: "Recipient creation data fetched successfully",
      data: {
        locations,
        RFID_Tags,
        BLE_Beacons
      }
    });
  } catch (error) {
    console.error("Error fetching recipient creation data:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching recipient creation data",
      error
    });
  }
};
