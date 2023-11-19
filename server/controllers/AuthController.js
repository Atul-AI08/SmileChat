import getPrismaInstance from "../utils/PrismaClient.js";

export const checkUser = async (request, response, next) => {
  try {
    const { email } = request.body;
    if (!email) {
      return response.json({ msg: "Email is required", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return response.json({ msg: "User not found", status: false });
    } else
      return response.json({ msg: "User Found", status: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const onBoardUser = async (request, response, next) => {
  try {
    const {
      email,
      name,
      about = "Available",
      image: profilePicture,
    } = request.body;
    if (!email || !name || !profilePicture) {
      return response.json({
        msg: "Email, Name and Image are required",
      });
    } else {
      const prisma = getPrismaInstance();
      await prisma.user.create({
        data: { email, name, about, profilePicture },
      });
      return response.json({ msg: "Success", status: true });
    }
  } catch (error) {
    next(error);
  }
};

export const updateLastSeen = async (request, response, next) => {
  try {
    const {
      userId,
      currentDate,
    } = request.body;
    const prisma = getPrismaInstance();
    await prisma.user.update({
      data: {
        lastSeen: currentDate
      },
      where: {
        id: userId,
      },
    });

    return response.json({ msg: "User updated successfully", status: true });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (request, response, next) => {
  try {
    const {
      id,
    } = request.body;
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        about: true,
        lastSeen: true,
        groupId: true
      },
    });
    const groups = await prisma.group.findMany({
      select: {
        id: true,
        groupMembers: true
      },
    });
    let validGroups = [];
    groups.forEach((group) => {
      let groupMembers = group.groupMembers.split(";");
      if (groupMembers.includes(String(id))) validGroups.push(group.id);
    })
    const usersGroupedByInitialLetter = {};
    users.forEach((user) => {
      if ((user.id === parseInt(id)) || (user.groupId !== null && !validGroups.includes(user.groupId))){
        return;
      }
      const initialLetter = user.name.charAt(0).toUpperCase();
      if (!usersGroupedByInitialLetter[initialLetter]) {
        usersGroupedByInitialLetter[initialLetter] = [];
      }
      usersGroupedByInitialLetter[initialLetter].push(user);
    });
    return response.status(200).send({ users: usersGroupedByInitialLetter });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (request, response, next) => {
  console.log("function");
  try {
    const {
      userId,
      name,
      about,
      image,
    } = request.body;

    const prisma = getPrismaInstance();
    await prisma.user.update({
      data: {
        name: name,
        about: about,
        profilePicture: image,
      },
      where: {
        id: userId,
      },
    });

    return response.json({ msg: "User updated successfully", status: true });
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (request, response, next) => {
  try {
    const {
      uid,
      email,
      name,
      about = "Available",
      image: profilePicture,
    } = request.body;
    if (!uid || !email || !name || !profilePicture) {
      return response.json({
        msg: "UserId, Email, Name and Image are required",
      });
    } else {
      const prisma = getPrismaInstance();
      const userId = String(uid);
      const group = await prisma.group.create({
        data: { groupMembers: userId },
      });
      var email1 = String(group.id) + email;
      await prisma.user.create({
        data: { email: email1, name, about, profilePicture, groupId: group.id },
      });
      return response.json({ msg: "Success", status: true });
    }
  } catch (error) {
    next(error);
  }
};

export const addGroupMember = async (request, response, next) => {
  try {
    const {
      groupId,
      email,
    } = request.body;
    if (!email || !groupId) {
      return response.json({
        msg: "Email and groupId are required",
      });
    } else {
      const prisma = getPrismaInstance();
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return response.json({ msg: "User not found", status: false });
      } else {
        const group = await prisma.group.findUnique({ where: { id: groupId } });
        let groupMembers = group.groupMembers.split(";");
        if (groupMembers.includes(String(user.id))){
          return response.json({ msg: "User already present", status: true });
        }
        let members = group.groupMembers + ";" + String(user.id);
        await prisma.group.update({
          data: {
            groupMembers: members,
          },
          where: {
            id: groupId,
          },
        });
        return response.json({ msg: "Success", status: true });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const leaveGroup = async (request, response, next) => {
  try {
    const {
      userId,
      groupId,
      uid,
    } = request.body;
    if (!userId || !uid || !groupId) {
      return response.json({
        msg: "UserId and groupId are required",
      });
    } else {
      const prisma = getPrismaInstance();
      const group = await prisma.group.findUnique({ where: { id: groupId } });
      let groupMembers = group.groupMembers.split(";");
      let members = "";
      for (let i=0; i<groupMembers.length; i++) {
        if (groupMembers[i] == String(uid)){
          continue;
        }
        members += groupMembers[i] + ";";
      }
      members = members.slice(0, members.length-1);
      await prisma.group.update({
        data: {
          groupMembers: members,
        },
        where: {
          id: groupId,
        },
      });
      await prisma.messages.deleteMany({
        where: {
          OR: [
            {
              senderId: parseInt(uid),
              recieverId: parseInt(userId),
            },
            {
              senderId: parseInt(userId),
              recieverId: parseInt(uid),
            },
          ],
        },
      });
      return response.json({ msg: "Success", status: true });
    }
  } catch (error) {
    next(error);
  }
};