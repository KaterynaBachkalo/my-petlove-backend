import { ObjectId } from "mongoose";

export interface IUser {
  name?: string;
  password: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
  checkPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  phone?: string;
  avatar?: string;
  favorites?: string[];
  viewed?: string[];
  myPets?: IPet[];
  googleId?: string;
}

export interface INotice {
  _id?: ObjectId;
  name: string;
  title: string;
  imgURL: string;
  species: string;
  birthday: string;
  sex: string;
  category: string;
  price: number;
  comment: string;
  locationId: string;
  owner: IUser;
  popularity: number;
}

export interface IPet {
  name: string;
  title: string;
  imgURL: string;
  species: string;
  birthday: string;
  sex: string;
}

export interface IMyPet {
  _id: string;
  name: string;
  title: string;
  imgURL: File;
  species: string;
  birthday: string;
  sex: string;
  owner: IUser;
}

export interface ICity {
  _id: string;
  useCounty: string;
  stateEn: string;
  cityEn: string;
  countyEn: string;
}

export interface IFriend {
  _id: string;
  title: string;
  url: string;
  addressUrl: string;
  imageUrl: string;
  address: string;
  workDays: Array<{
    _id: string;
    isOpen: boolean;
    from: string;
    to: string;
  }>;
  phone: string;
  email: string;
}

export interface INews {
  _id: string;
  imgUrl: string;
  title: string;
  text: string;
  date: string;
  url: string;
  id: string;
}

export interface QueryParams {
  title?: string | null;
  page?: number;
  limit?: number;
  category?: string;
  sex?: string;
  species?: string;
  sort?: string;
}

export interface IFavorite {
  _id: string;
  owner: IUser;
}
