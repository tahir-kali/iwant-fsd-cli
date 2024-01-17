import { apiClient } from "@services";
export const getCreateUserRequest = (params: unknown) =>
  apiClient.client.get("/create-user", { params });
export const postCreateUserRequest = (params: unknown) =>
  apiClient.client.post("/create-user", params);
export const updateCreateUserRequest = (params: unknown) =>
  apiClient.client.put("/create-user", params);
export const deleteCreateUserRequest = (params: unknown) =>
  apiClient.client.delete("/create-user", params);
