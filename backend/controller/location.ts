import Location, { ILocation } from "../model/location";
import Robot from "../model/robot";
import { FastifyRequest, FastifyReply } from "fastify";

export const createLocation = async (req: FastifyRequest<{ Body: ILocation }>, res: FastifyReply) => {
  const { name, coordinates, description, robot, type } = req.body;
  try {
    const robotExists = await Robot.findById(robot);
    if (!robotExists) {
      return res.status(404).send({
        success: false,
        message: "Robot not found",
      });
    }
    if (await Location.findOne({ name })) {
      return res.status(400).send({
        success: false,
        message: "Location already exists",
      });
    }
    const location = new Location({
      name,
      coordinates,
      description,
      robot,
      type
    });
    robotExists.locations.push(location._id);

    await robotExists.save();
    await location.save();

    return res.status(200).send({
      success: true,
      message: "Location created successfully",
      location
    });
  } catch (error) {
    console.error("Error creating location:", error);
    return res.status(500).send({
      success: false,
      message: "Error creating location",
      error
    });
  }
};

export const getLocations = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const locations = await Location.find().populate("robot");
    return res.status(200).send({
      success: true,
      message: "Locations fetched successfully",
      locations,
      count: locations.length
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching locations",
      error
    });
  }
};

export const getLocationById = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  const { id } = req.params;
  try {
    const location = await Location.findById(id).populate("robot");
    if (!location) {
      return res.status(404).send({
        success: false,
        message: "Location not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Location fetched successfully",
      location
    });
  } catch (error) {
    console.error("Error fetching location:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching location",
      error
    });
  }
};

export const updateLocation = async (req: FastifyRequest<{ Params: { id: string }, Body: Partial<ILocation> }>, res: FastifyReply) => {
  const { id } = req.params;
  const { name, coordinates, description, type } = req.body;
  try {
    const location = await Location.findByIdAndUpdate(id, {
      name,
      coordinates,
      description,
      type
    }, { new: true }).populate("robot");
    if (!location) {
      return res.status(404).send({
        success: false,
        message: "Location not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Location updated successfully",
      location
    });
  } catch (error) {
    console.error("Error updating location:", error);
    return res.status(500).send({
      success: false,
      message: "Error updating location",
      error
    });
  }
};

export const deleteLocation = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  const { id } = req.params;
  try {
    const location = await Location.findByIdAndDelete(id);
    if (!location) {
      return res.status(404).send({
        success: false,
        message: "Location not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting location:", error);
    return res.status(500).send({
      success: false,
      message: "Error deleting location",
      error
    });
  }
};

export const searchLocations = async (req: FastifyRequest<{ Querystring: { name?: string; type?: string } }>, res: FastifyReply) => {
    const { name, type } = req.query;
    try {
        const filter: any = {};
        if (name) filter.name = { $regex: name, $options: "i" };
        if (type) filter.type = type;

        const locations = await Location.find(filter).populate("robot");
        return res.status(200).send({
            success: true,
            message: "Locations fetched successfully",
            locations,
            count: locations.length
        });
    } catch (error) {
        console.error("Error searching locations:", error);
        return res.status(500).send({
            success: false,
            message: "Error searching locations",
            error
        });
    }
};
