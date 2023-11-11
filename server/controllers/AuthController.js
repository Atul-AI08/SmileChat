import getPrismaInstance from "../utils/PrismaClient.js";
import { generateToken04 } from "../utils/TokenGenerator.js";

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

export const getAllUsers = async (req, res, next) => {
  try {
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
    const usersGroupedByInitialLetter = {};
    users.forEach((user) => {
      const initialLetter = user.name.charAt(0).toUpperCase();
      if (!usersGroupedByInitialLetter[initialLetter]) {
        usersGroupedByInitialLetter[initialLetter] = [];
      }
      usersGroupedByInitialLetter[initialLetter].push(user);
    });

    return res.status(200).send({ users: usersGroupedByInitialLetter });
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
