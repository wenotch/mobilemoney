import { PaymentMethods, StartCardVerificationResponse } from "paygo";
import { HttpService } from "../lib/http-service";

const startCardVerification = async () => {
  const { data } = await HttpService.get<StartCardVerificationResponse>(
    "/start_card_verification"
  );
  console.log(data);
  return data;
};

const fetchPaymentMethods = async () => {
  const { data } = await HttpService.get<PaymentMethods>(
    "/users/payment-methods"
  );

  return data;
};

export const paymentMethodService = {
  fetchPaymentMethods,
  startCardVerification,
};
