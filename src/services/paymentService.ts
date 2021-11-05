import { ChargeCardRequest } from "paygo";
import { HttpService } from "../lib/http-service";

export const chargeCard = async (req: ChargeCardRequest) => {
  const { data } = await HttpService.post("/charge_card", req);

  return data;
};
