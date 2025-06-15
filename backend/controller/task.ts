import Task, { ITask } from '../model/task';
import Robot from '../model/robot';
import Recipient from '../model/recipient';
import { FastifyRequest, FastifyReply } from 'fastify';

export const createTask = async (req: FastifyRequest<{ Body: ITask }>, res: FastifyReply): Promise<FastifyReply> => {
  const { recipient, message, deliveryItem } = req.body;
    try {
        const task_id = `T-${Math.floor(1000 + Math.random() * 9000)}`;
        if (await Task.findOne({ task_id })) {
            console.log("Task with this ID already exists:", task_id);
            return createTask(req, res);
        }
        const recipientExists = await Recipient.findById(recipient)
        if (!recipientExists) return res.status(404).send({ success: false, message: "Recipient not found" });
        if (recipientExists.status !== 'active') return res.status(400).send({ success: false, message: "Recipient is not available" });

        const robot = await Robot.findById(recipientExists.robot);
        if (!robot) return res.status(404).send({ success: false, message: "Robot not found" });
        if (robot.status !== 'active') return res.status(400).send({ success: false, message: "Robot is not available" });

        const task = new Task({
            task_id,
            recipient,
            robot: recipientExists.robot,
            message,
            location: recipientExists.location,
            deliveryItem,
            deliveryTimeline: {
                create: new Date(),
            }
        });
        robot.deliveries.push(task._id);

        await robot.save();
        await task.save();

        return res.status(201).send({
            success: true,
            message: "Task created successfully",
            task
        });
    } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).send({
            success: false,
            message: "Error creating task",
            error
        });
    }
};

export const getTaskById = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id)
      .populate('recipient', '_id name patient_ID')
      .populate('location', '_id name type')
      .select('-__v');
    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found"
      });
    }
    return res.status(200).send({
      success: true,
      message: "Task fetched successfully",
      task
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching task",
      error
    });
  }
};

export const queueTasks = async (req: FastifyRequest<{ Body: { taskIds: string[] } }>, res: FastifyReply) => {
  const { taskIds } = req.body;
  try {
    const tasks = await Task.find({ _id: { $in: taskIds } });
    if (!tasks.length) {
      return res.status(404).send({
        success: false,
        message: "No tasks found"
      });
    }
    tasks.forEach(task => {
      task.status = 'queued';
      task.deliveryTimeline.queued = new Date();
      task.save();
    });
    return res.status(200).send({
      success: true,
      message: "Tasks queued successfully",
      tasks
    });
  } catch (error) {
    console.error("Error queuing tasks:", error);
    return res.status(500).send({
      success: false,
      message: "Error queuing tasks",
      error
    });
  }
};

export const dequeueTask = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found"
      });
    }
    task.status = 'todo';
    task.deliveryTimeline.queued = undefined;
    await task.save();
    return res.status(200).send({
      success: true,
      message: "Task unqueued successfully",
      task
    });
  } catch (error) {
    console.error("Error unqueuing task:", error);
    return res.status(500).send({
      success: false,
      message: "Error unqueuing task",
      error
    });
  }
};

export const deleteTask = async (req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).send({ success: false, message: "Task not found" });
    if (task.status !== 'todo') return res.status(400).send({ success: false, message: "Task is not in a deletable state" });
    
    const robot = await Robot.findById(task.robot);
    if (robot) {
      robot.deliveries = robot.deliveries.filter(delivery => delivery.toString() !== task._id.toString());
      await robot.save();
    }
    await Task.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).send({
      success: false,
      message: "Error deleting task",
      error
    });
  }
};

export const searchTasks = async (req: FastifyRequest<{ Querystring: { task_id?: string; location?: string; recipient?: string; status?: string } }>, res: FastifyReply) => {
  const { task_id, location, recipient, status } = req.query;
  try {
    const filter: any = {};
    if (task_id) filter.task_id = { $regex: task_id, $options: 'i' };
    if (location) filter.location = location;
    if (recipient) filter.recipient = recipient;
    if (status) filter.status = status;

    const tasks = await Task.find(filter)
      .populate('recipient', '_id name patient_ID')
      .populate('location', '_id name type')
      .select('-__v');
    return res.status(200).send({
      success: true,
      message: "Tasks fetched successfully",
      tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching tasks",
      error
    });
  }
};

export const updateTask = async (req: FastifyRequest<{ Params: { id: string }, Body: Partial<ITask> }>, res: FastifyReply) => {
  const { id } = req.params;
  const { message } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(id, {
      message
    }, { new: true })
      .populate('recipient', '_id name patient_ID')
      .populate('location', '_id name type')
      .select('-__v');
    if (!task) {
      return res.status(404).send({
        success: false,
        message: "Task not found"
      });
    }
    return res.status(200).send({
      success: true,
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).send({
      success: false,
      message: "Error updating task",
      error
    });
  }
};
