import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthCredential, AuthResponseType, User } from "paygo";
import { HttpService } from "../../../lib/http-service";

const authenticate = async (credentials: AuthCredential) => {
  const { data } = await HttpService.post<AuthResponseType>(
    "/auth",
    credentials
  );
  AsyncStorage.setItem("currentUser", JSON.stringify(data));

  return data;
};

const requestPasswordResetToken = async (request: Pick<User, "email">) => {
  return await HttpService.post<void>("/reset_password", request);
};

const resetPassword = async (
  request: Pick<User, "password"> & { code: string }
) => {
  return await HttpService.post<void>("/change_password_with_code", request);
};

export const AuthService = {
  authenticate,
  requestPasswordResetToken,
  resetPassword,
};
