import { TPagination } from "@types";

export type TCreateUserResponse = {
  createUser: TCreateUser;
  createUserLimit: number;
  createUserAccess: boolean;
  attemptsGetCreateUserPerYear: number;
};
export type TCreateUserRecordStatus = {
  name: string;
  label: string;
  class: string;
};

export type TCreateUserRecord = {
  id: number;
  userId: number;
  size: string;
  offeredAt: string;
  status: TCreateUserRecordStatus;
  denied: boolean | null;
};

export type TCreateUser = {
  data: TCreateUserRecord[];
  pagination: TPagination;
};
