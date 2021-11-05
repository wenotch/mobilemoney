import { ChangePasswordRequest, SetPinRequest, User } from "paygo";
import { HttpService } from "../../../lib/http-service";

const updateUserProfile = async (profile: Partial<User>) => {
  try {
    const { data } = await HttpService.put<User>("/users", profile);

    return data;
  } catch (error) {
    throw error;
  }
};

const changePassword = async (request: ChangePasswordRequest) => {
  try {
    await HttpService.put<void>("/change_password", request);
  } catch (error) {
    throw error;
  }
};

const getProfile = async () => {
  const { data } = await HttpService.get<User>("/users/profile");

  return data;
};

const setPIN = async (value: SetPinRequest) => {
  const { data } = await HttpService.post("/create_pin", value);

  return data;
};

export const userService = {
  updateUserProfile,
  changePassword,
  getProfile,
  setPIN,
};
