import { renameSync } from "fs";
import getPrismaInstance from "../utils/PrismaClient.js";

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();

    const { message, from, to, group_, name } = req.body;
    const getUser = onlineUsers.get(to);

    if (message && from && to && group_===null) {
      const newMessage = await prisma.messages.create({
        data: {
          message: message,
          sender: { connect: { id: parseInt(from) } },
          reciever: { connect: { id: parseInt(to) } },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: { sender: true, reciever: true },
      });
      return res.status(201).send({ message: newMessage });
    }
    else if (message && from && to) {
      const newMessage = await prisma.messages.create({
        data: {
          message: message,
          sender: { connect: { id: parseInt(from) } },
          reciever: { connect: { id: parseInt(to) } },
          messageStatus: "read",
          senderName: name,
        },
        include: { sender: true, reciever: true },
      });
      const sendGroupMessage = async (id) => {
        const temp = await prisma.messages.create({
          data: {
            message: message,
            sender: { connect: { id: parseInt(to) } },
            reciever: { connect: { id: id } },
            senderName: name,
          },
          include: { sender: true, reciever: true },
        });
        const sendUserSocket = onlineUsers.get(id);
        if (sendUserSocket) {
          chatSocket
            .to(sendUserSocket)
            .emit("msg-recieve", { from: parseInt(to), message: temp });
        }
      };
      const group = await prisma.group.findUnique({
        where: {
          id: parseInt(group_)
        }
      });
      const groupMembers = group.groupMembers.split(";")
      groupMembers.forEach((groupMember) => {
        if (parseInt(groupMember)!==parseInt(from)){
          sendGroupMessage(parseInt(groupMember));
        }
      });
      return res.status(201).send({ message: newMessage });
    }
    return res.status(400).send("From, to and Message is required.");
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { from, to } = req.params;
    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(from),
            recieverId: parseInt(to),
          },
          {
            senderId: parseInt(to),
            recieverId: parseInt(from),
          },
        ],
      },
      orderBy: {
        id: "asc",
      },
    });

    let time = 0;
    const disappear = await prisma.disappear.findMany({
      where: {
        user1: parseInt(from),
        user2: parseInt(to),
      }
    });
    if (disappear[0] !== undefined){
      time += disappear[0].time;
    }

    const unreadMessages = [];

    messages.forEach((message, index) => {
      if (
        message.messageStatus !== "read" &&
        message.senderId === parseInt(to)
      ) {
        messages[index].messageStatus = "read";
        unreadMessages.push(message.id);
      }
    });

    await prisma.messages.updateMany({
      where: {
        id: { in: unreadMessages },
      },
      data: {
        messageStatus: "read",
      },
    });
    res.status(200).json({ time, messages });
  } catch (err) {
    next(err);
  }
};

export const addFileMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = "uploads/files/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to, group_, name } = req.query;
      const getUser = onlineUsers.get(to);

      if (from && to && group_===null) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: parseInt(from) } },
            reciever: { connect: { id: parseInt(to) } },
            type: "file",
            messageStatus: getUser ? "delivered" : "sent",
          },
        });
        return res.status(201).json({ message });
      }
      else if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: parseInt(from) } },
            reciever: { connect: { id: parseInt(to) } },
            type: "file",
            messageStatus: "read",
            senderName: name,
          },
        });
        const sendGroupMessage = async (id) => {
          const temp = await prisma.messages.create({
            data: {
              message: message,
              sender: { connect: { id: parseInt(to) } },
              reciever: { connect: { id: parseInt(id) } },
              type: "file",
              senderName: name,
            },
            include: { sender: true, reciever: true },
          });
          const sendUserSocket = onlineUsers.get(id);
          if (sendUserSocket) {
            chatSocket
              .to(sendUserSocket)
              .emit("msg-recieve", { from: parseInt(to), message: temp });
          }
        };
        const group = await prisma.group.findUnique({
          where: {
            id: parseInt(group_)
          }
        });
        const groupMembers = group.groupMembers.split(";")
        groupMembers.forEach((groupMember) => {
          if (parseInt(groupMember)!==parseInt(from)){
            sendGroupMessage(groupMember);
          }
        });
        return res.status(201).json({ message });
      }
      return res.status(400).send("From, to is required.");
    }
    return res.status(400).send("File is required.");
  } catch (err) {
    next(err);
  }
};

export const addAudioMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = "uploads/recordings/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to, group_, name } = req.query;
      const getUser = onlineUsers.get(to);

      if (from && to && group_===null) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: parseInt(from) } },
            reciever: { connect: { id: parseInt(to) } },
            type: "audio",
            messageStatus: getUser ? "delivered" : "sent",
          },
        });
        return res.status(201).json({ message });
      }
      else if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: parseInt(from) } },
            reciever: { connect: { id: parseInt(to) } },
            type: "audio",
            messageStatus: "read",
            senderName: name,
          },
        });
        const sendGroupMessage = async (id) => {
          const temp = await prisma.messages.create({
            data: {
              message: message,
              sender: { connect: { id: parseInt(to) } },
              reciever: { connect: { id: parseInt(id) } },
              type: "audio",
              senderName: name,
            },
            include: { sender: true, reciever: true },
          });
          const sendUserSocket = onlineUsers.get(id);
          if (sendUserSocket) {
            chatSocket
              .to(sendUserSocket)
              .emit("msg-recieve", { from: parseInt(to), message: temp });
          }
        };
        const group = await prisma.group.findUnique({
          where: {
            id: parseInt(group_)
          }
        });
        const groupMembers = group.groupMembers.split(";")
        groupMembers.forEach((groupMember) => {
          if (parseInt(groupMember)!==parseInt(from)){
            sendGroupMessage(groupMember);
          }
        });
        return res.status(201).json({ message });
      }
      return res.status(400).send("From, to is required.");
    }
    return res.status(400).send("Audio is required.");
  } catch (err) {
    next(err);
  }
};

export const getInitialContactsWithMessages = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.from);
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentMessages: {
          include: { reciever: true, sender: true },
          orderBy: { createdAt: "desc" },
        },
        recievedMessages: {
          include: { reciever: true, sender: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    const messages = [...user.sentMessages, ...user.recievedMessages];
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const users = new Map();
    const messageStatusChange = [];

    messages.forEach((msg) => {
      const isSender = msg.senderId === userId;
      const calculatedId = isSender ? msg.recieverId : msg.senderId;
      if (msg.messageStatus === "sent") {
        messageStatusChange.push(msg.id);
      }
      if (!users.get(calculatedId)) {
        const {
          id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          recieverId,
        } = msg;
        let user = {
          messageId: id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          recieverId,
        };
        if (isSender) {
          user = {
            ...user,
            ...msg.reciever,
            totalUnreadMessages: 0,
          };
        } else {
          user = {
            ...user,
            ...msg.sender,
            totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
          };
        }
        users.set(calculatedId, {
          ...user,
        });
      } else if (msg.messageStatus !== "read" && !isSender) {
        const user = users.get(calculatedId);
        users.set(calculatedId, {
          ...user,
          totalUnreadMessages: user.totalUnreadMessages + 1,
        });
      }
    });

    if (messageStatusChange.length) {
      await prisma.messages.updateMany({
        where: {
          id: { in: messageStatusChange },
        },
        data: {
          messageStatus: "delivered",
        },
      });
    }

    return res.status(200).json({
      users: Array.from(users.values()),
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  } catch (err) {
    next(err);
  }
};

export const setDisappearingTime = async (req, res, next) => {
  try {
    const { from, to, time } = req.body;
    const prisma = getPrismaInstance();
    const disappear = await prisma.disappear.findMany({
      where: {
        user1: parseInt(from),
        user2: parseInt(to),
      }
    });
    if (disappear == []){
      const _ = await prisma.disappear.updateMany({
        data: {
          time: parseInt(time),
        },
        where: {
          OR: [
            {
              user1: parseInt(from),
              user2: parseInt(to),
            },
            {
              user1: parseInt(to),
              user2: parseInt(from),
            },
          ],
        },
      });
    } else {
      const _x = await prisma.disappear.create({
        data: {
          user1: parseInt(from),
          user2: parseInt(to),
          time: parseInt(time),
        },
      });
      const _y = await prisma.disappear.create({
        data: {
          user1: parseInt(to),
          user2: parseInt(from),
          time: parseInt(time),
        },
      });
    }

    res.status(200).json({ msg: "Disappearing time updated successfully", status: true });
  } catch (err) {
    next(err);
  }
};