import Robot, { IRobot } from "../model/robot";
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