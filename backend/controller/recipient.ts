import Recipient, { IRecipient } from '../model/recipient';
import Location from '../model/location';
import IdentificationTag from '../model/tag';
import { FastifyRequest, FastifyReply } from 'fastify';

export const createRecipient = async (req: FastifyRequest<{ Body: IRecipient }>, res: FastifyReply): Promise<FastifyReply> => {
  const { name, location, rfidTag, bleBeacon, medicalCondition, contactInformation, notes } = req.body;
  try {
    // Generate a unique patient_ID 
    const patient_ID: string = `P-${Math.floor(1000 + Math.random() * 9000)}`;
    if (await Recipient.findOne({ patient_ID })) {
      console.log("Recipient with this Patient ID already exists:");
      return createRecipient(req, res);
    }
    const locationExists = await Location.findById(location);
    if (!locationExists) return res.status(404).send({ success: false, message: "Location not found" });

    const BLE = await IdentificationTag.findById(bleBeacon);
    if (!BLE) return res.status(404).send({ success: false, message: "BLE Beacon not found" });
    if (BLE.type !== 'ble') return res.status(400).send({ success: false, message: "Invalid BLE Beacon type" });
    if (BLE.status !== 'available') return res.status(400).send({ success: false, message: "BLE Beacon is already assigned" });

    const RFID = await IdentificationTag.findById(rfidTag);
    if (!RFID) return res.status(404).send({ success: false, message: "RFID Tag not found" });
    if (RFID.type !== 'rfid') return res.status(400).send({ success: false, message: "Invalid RFID Tag type" });
    if (RFID.status !== 'available') return res.status(400).send({ success: false, message: "RFID Tag is already assigned" });

    const recipient = new Recipient({
      name,
      patient_ID,
      location,
      robot: locationExists.robot,
      rfidTag,
      bleBeacon,
      medicalCondition,
      contactInformation,
      notes
    });

    BLE.assignedTo = recipient.id;
    BLE.assignedDate = new Date();
    BLE.status = 'active';

    RFID.assignedTo = recipient.id;
    RFID.assignedDate = new Date();
    RFID.status = 'active';

    await BLE.save();
    await RFID.save();

    await recipient.save();
    return res.status(201).send({
      success: true,
      message: "Recipient created successfully",
      recipient
    });
  } catch (error: any) {
    console.error("Error creating recipient:", error);
    return res.status(500).send({
      success: false,
      message: "Error creating recipient",
      error
    });
  }
};

export const getRecipientById = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  const { id } = req.params;
  try {
    const recipient = await Recipient.findById(id)
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
    if (!recipient) {
      return res.status(404).send({
        success: false,
        message: "Recipient not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Recipient fetched successfully",
      recipient
    });
  } catch (error) {
    console.error("Error fetching recipient:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching recipient",
      error
    });
  }
};

export const updateRecipient = async (req: FastifyRequest<{ Params: { id: string }, Body: Partial<IRecipient> }>, res: FastifyReply) => {
  const { id } = req.params;
  const { name, location, rfidTag, bleBeacon, admissionDate, medicalCondition, contactInformation, notes } = req.body;
  try {
    if (location) {
      const locationExists = await Location.findById(location);
      if (!locationExists) return res.status(404).send({ success: false, message: "Location not found" });
    }
    const recipient = await Recipient.findById(id);
    if (!recipient) {
      return res.status(404).send({
        success: false,
        message: "Recipient not found",
      });
    }
    if (rfidTag && recipient.rfidTag.toString() !== rfidTag.toString()) { 
      const RFID = await IdentificationTag.findById(rfidTag);
      if (!RFID) return res.status(404).send({ success: false, message: "RFID Tag not found" });
      if (RFID.type !== 'rfid') return res.status(400).send({ success: false, message: "Invalid RFID Tag type" });
      if (RFID.status !== 'available') return res.status(400).send({ success: false, message: "RFID Tag is already assigned" });
        
      const existingRFID = await IdentificationTag.findById(recipient.rfidTag);
      if (existingRFID) {
        existingRFID.assignedTo = undefined;
        existingRFID.assignedDate = undefined;
        existingRFID.status = 'available';
        await existingRFID.save();
      }
    }
    if (bleBeacon && recipient.bleBeacon?.toString() !== bleBeacon.toString()) {
      const BLE = await IdentificationTag.findById(bleBeacon);
      if (!BLE) return res.status(404).send({ success: false, message: "BLE Beacon not found" });
      if (BLE.type !== 'ble') return res.status(400).send({ success: false, message: "Invalid BLE Beacon type" });
      if (BLE.status !== 'available') return res.status(400).send({ success: false, message: "BLE Beacon is already assigned" });

      const existingBLE = await IdentificationTag.findById(recipient.bleBeacon);
      if (existingBLE) {
        existingBLE.assignedTo = undefined;
        existingBLE.assignedDate = undefined;
        existingBLE.status = 'available';
        await existingBLE.save();
      }
    }

    const updatedRecipient = await Recipient.findByIdAndUpdate(id, {
        name,
        location,
        rfidTag,
        bleBeacon,
        admissionDate,
        medicalCondition,
        contactInformation,
        notes
    }, { new: true }).populate({
            path: 'location',
            select: '_id name type',
        })
        .populate({
            path: 'rfidTag',
            select: '_id type tagCode ',
        })
        .populate({
            path: 'bleBeacon',
            select: '_id type tagCode ',
        })
        .populate({
            path: 'deliveryHistory',
            select: '_id task_id status createdAt deliveryTimeline',
        });

    return res.status(200).send({
      success: true,
      message: "Recipient updated successfully",
      recipient: updatedRecipient
    });
  } catch (error) {
    console.error("Error updating recipient:", error);
    return res.status(500).send({
      success: false,
      message: "Error updating recipient",
      error
    });
  }
};

export const searchRecipients = async (req: FastifyRequest<{ Querystring: { name: string, patient_ID: string, status: string } }>, res: FastifyReply) => {
  const { name, patient_ID, status } = req.query;
  try {
    const filter: any = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (patient_ID) filter.patient_ID = patient_ID;
    if (status) filter.status = status;
    const recipients = await Recipient.find(filter)
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
      message: "Recipients fetched successfully",
      recipients,
      count: recipients.length
    });
  } catch (error) {
    console.error("Error fetching recipients:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching recipients",
      error
    });
  }
};

export const checkOutRecipient = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  const { id } = req.params;
  try {
    const recipient = await Recipient.findById(id);
    if (!recipient) {
      return res.status(404).send({
        success: false,
        message: "Recipient not found",
      });
    }
    if (recipient.status === 'inactive') return res.status(400).send({
      success: false,
      message: "Recipient is already checked out",
    });

    const rfidTag = await IdentificationTag.findById(recipient.rfidTag);
    if (!rfidTag) return res.status(404).send({ success: false, message: "RFID Tag not found" });
    rfidTag.assignedTo = undefined;
    rfidTag.assignedDate = undefined;
    rfidTag.status = 'available';
    await rfidTag.save();

    const bleBeacon = await IdentificationTag.findById(recipient.bleBeacon);
    if (!bleBeacon) return res.status(404).send({ success: false, message: "BLE Beacon not found" });
    bleBeacon.assignedTo = undefined;
    bleBeacon.assignedDate = undefined;
    bleBeacon.status = 'available';
    await bleBeacon.save();

    recipient.checkOutDate = new Date();
    recipient.status = 'inactive';
    await recipient.save();

    return res.status(200).send({
      success: true,
      message: "Recipient checked out successfully",
      recipient
    });
  } catch (error) {
    console.error("Error checking out recipient:", error);
    return res.status(500).send({
      success: false,
      message: "Error checking out recipient",
      error
    });
  }
};
