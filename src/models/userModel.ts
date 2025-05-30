import { model, Schema } from "mongoose";
import { genSalt, hash, compare } from "bcrypt";
import { IUser } from "../types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
    },
    password: {
      type: String,
      required: function () {
        // пароль обов’язковий тільки якщо це не Google користувач
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    phone: {
      type: Number,
      default: null,
    },
    avatar: {
      type: String,
      default: "",
    },
    favorites: {
      type: [],
    },
    viewed: {
      type: [],
    },
    myPets: {
      type: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);

  next();
});

userSchema.methods.checkPassword = (candidate: string, passwdHash: string) =>
  compare(candidate, passwdHash);

export const User = model<IUser>("User", userSchema);
