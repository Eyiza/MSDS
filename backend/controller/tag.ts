import IdentificationTag, { IIdentificationTag } from '../model/tag';
import { FastifyRequest, FastifyReply } from 'fastify';

export const createTag = async (req: FastifyRequest<{ Body: IIdentificationTag }>, res: FastifyReply) => {
  const { type, tagCode, tagId, rssi } = req.body;
  try {
    if (await IdentificationTag.findOne({ $or: [{ tagCode }, { tagId }] })) {
      return res.status(400).send({
        success: false,
        message: "Tag with this code or ID already exists",
      });
    }
    const tag = new IdentificationTag({
      type,
      tagCode,
      tagId,
      rssi
    });
    await tag.save();
    return res.status(201).send({
      success: true,
      message: "Tag created successfully",
      tag
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    return res.status(500).send({
      success: false,
      message: "Error creating tag",
      error
    });
  }
};

export const getTagById = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  const { id } = req.params;
  try {
    const tag = await IdentificationTag.findById(id).populate('assignedTo')
        .populate({
            path: 'assignedTo.location',
            select: '_id name type'
        })
        .populate({
            path: 'usageHistory.task',
            select: '_id task_id status createdAt',
        });
    if (!tag) {
      return res.status(404).send({
        success: false,
        message: "Tag not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Tag fetched successfully",
      tag
    });
  } catch (error) {
    console.error("Error fetching tag:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching tag",
      error
    });
  }
};
export const updateTag = async (req: FastifyRequest<{ Params: { id: string }, Body: Partial<IIdentificationTag> }>, res: FastifyReply) => {
  const { id } = req.params;
  const { tagCode, tagId, rssi, status } = req.body;
  try {
    const tag = await IdentificationTag.findByIdAndUpdate(id, {
        tagCode,
        tagId,
        rssi,
        status
    }, { new: true }).populate('assignedTo')
        .populate({
            path: 'assignedTo.location',
            select: '_id name type'
        })
        .populate({
            path: 'usageHistory.task',
            select: '_id task_id status createdAt',
        });
    if (!tag) {
      return res.status(404).send({
        success: false,
        message: "Tag not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Tag updated successfully",
      tag
    });
  } catch (error) {
    console.error("Error updating tag:", error);
    return res.status(500).send({
      success: false,
      message: "Error updating tag",
      error
    });
  }
};

export const searchTags = async (req: FastifyRequest<{ Querystring: { status: string, code: string, type: string } }>, res: FastifyReply) => {
  const { status, code, type } = req.query;
  try {
    const filter: any = {};
    if (status) filter.status = status;
    if (code) filter.tagCode = { $regex: code, $options: 'i' };
    if (type) filter.type = type;
    const tags = await IdentificationTag.find(filter).populate('assignedTo')
        .populate({
            path: 'assignedTo.location',
            select: '_id name type'
        })
        .populate({
            path: 'usageHistory.task',
            select: '_id task_id status createdAt',
        });
    return res.status(200).send({
      success: true,
      message: "Tags fetched successfully",
      tags,
      count: tags.length
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching tags",
      error
    });
  }
};
