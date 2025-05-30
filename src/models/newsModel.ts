import { model, Schema } from "mongoose";
import { INews } from "../types";

const newsSchema = new Schema<INews>(
  {
    _id: { type: String },
    imgUrl: { type: String },
    title: { type: String },
    text: { type: String },
    date: { type: String },
    url: { type: String },
    id: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const News = model<INews>("News", newsSchema);
