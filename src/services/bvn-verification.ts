import { VerifyBVNRequest } from "paygo";
import { HttpService } from "../lib/http-service";

export const verifyBVN = async (req: VerifyBVNRequest) => {
  const { data } = await HttpService.get(
    `/request_bvn_verification/${req.userId}/${req.bvn}`
  );

  return data;
};
