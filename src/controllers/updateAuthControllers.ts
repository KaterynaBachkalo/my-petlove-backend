import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { jwtServices, petServices, userServices } from "../services";
import { ObjectId } from "mongoose";
import { HttpError } from "../utils";
import { createPetAvatar } from "../services/avatarServices";
import { AddPet, User } from "../models";

interface CustomRequest extends Request {
  user: {
    _id: ObjectId;
    name: string;
    phone: number;
  };
}

interface CustomPetRequest extends Request {
  user: {
    _id: ObjectId;
    name: string;
    phone: number;
    myPets: {
      title: string;
      name: string;
      sex: string;
      birthday: string;
      species: string;
      imgURL: string;
    };
  };
}

const checkAuthorization = (userId: ObjectId) => {
  if (!userId) {
    throw new HttpError(401, "Unauthorized");
  }
};

const updateCurrentUser = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const { _id } = req.user;

    const updateUser = await userServices.updateCurrentUser(_id, req.body);

    res.status(200).json(updateUser);
  }
);

const deletePetById = catchAsync(
  async (req: CustomPetRequest, res: Response) => {
    const { id } = req.params;

    const userId = req.user._id;

    checkAuthorization(userId);

    await userServices.updateFavoriteId(userId, id);

    const deletedFavorite = await AddPet.findOneAndDelete({
      _id: id,
      owner: userId,
    });

    if (!deletedFavorite) {
      throw new HttpError(404, "Favorite not found");
    }

    await User.findByIdAndUpdate(userId, { $pull: { myPets: id } });

    res
      .status(200)
      .json({ message: "The favorite pet is successfully deleted" });
  }
);

const addPet = catchAsync(async (req: CustomPetRequest, res: Response) => {
  const accessToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!accessToken) {
    throw new HttpError(401, "Unauthorized. No token provided.");
  }

  const userId = accessToken && jwtServices.checkToken(accessToken);

  if (!req.file) {
    throw new HttpError(400, "Please, upload the image");
  }

  if (!userId) {
    throw new HttpError(401, "Unauthorized. Invalid token.");
  }

  const avatar = await createPetAvatar(userId, req.file);

  const newPet = await petServices.addPet(userId, {
    ...req.body,
    imgURL: avatar,
  });

  await userServices.updatePetsOfUser(userId, newPet);

  res.status(201).json(newPet);
});

export default {
  updateCurrentUser,
  deletePetById,
  addPet,
};
