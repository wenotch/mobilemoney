import { User, UserRegistration, VerifyTokenRequest } from "paygo";
import { HttpService } from "../../../lib/http-service";

const register = async (user: UserRegistration) => {
  const { data } = await HttpService.post<User>("/users", user);

  return data;
};

const verifyToken = async (token: VerifyTokenRequest) => {
  const { data } = await HttpService.put<void>("/users/verify", token);

  return data;
};

export const RegistrationService = {
  register,
  verifyToken,
};
