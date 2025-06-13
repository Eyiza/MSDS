import Robot, { IRobot } from "../model/robot";
import { FastifyRequest, FastifyReply } from "fastify";

// Controller for handling robot-related operations
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
