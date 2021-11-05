import { HttpService } from "../lib/http-service";

export interface Bank {
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string;
  active: boolean;
  is_deleted: null | boolean;
  id: number;
}

export interface GetBankResponse {
  status: boolean;
  message: string;
  data: Bank[];
}

export const bankApi = {
  async getBanks() {
    const { data: res } = await HttpService.get<GetBankResponse>("/banks");

    return res.data;
  },
};
