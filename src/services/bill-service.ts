import {
  GetBillResponse,
  PayBillRequest,
  ValidateBillingCustomerResponse,
} from "paygo";
import { HttpService } from "../lib/http-service";

export const getBills = async () => {
  const { data: res } = await HttpService.get<GetBillResponse>("/bills");

  return res.data.filter((bill) => bill.country === "NG");
};

export const validateBill = async (
  itemCode: string,
  code: string,
  customer: string
) => {
  const res = await HttpService.get<ValidateBillingCustomerResponse>(
    `/validate_bill/${itemCode}/${code}/${customer}`
  );

  return res.data.data;
};

export const createBillPayment = async (req: PayBillRequest) => {
  const bill = {
    interval: false,
    intervalInDays: 0,
    PIN: req.PIN,
    billDetails: {
      country: req.billDetails.country,
      customer: req.billDetails.customer,
      amount: req.billDetails.amount,
      type: req.billDetails.type,
    },
  };

  const { data } = await HttpService.post("/bills", bill);

  return data;
};
