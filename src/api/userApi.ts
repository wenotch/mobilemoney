import { HttpService } from "../lib/http-service";

export interface VerifyUserResponse {
  name: string;
  phone: string;
}

export const userApi = {
  async confirmPhone(phone: string) {
    const { data } = await HttpService.get<VerifyUserResponse>(
      `/users/${phone}`
    );

    return data;
  },
};
