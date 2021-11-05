import { HttpService } from "../lib/http-service";
import { convertMoneyToNumber } from "../lib/utils";

export interface VerifyBankAccountResponse {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
  };
}

export interface CreateRecipientRequest {
  name: string;
  account_number: string;
  bank_code: string;
  currency: string;
  saveBeneficiary: boolean;
}

export interface CreateRecipientResponse {
  status: string;
  message: string;
  data: {
    active: boolean;
    id: number;
    integration: number;
    name: string;
    recipient_code: string;
    type: string;
  };
}

export interface InitiateTransferRequest {
  recipient: string;
  amount: number;
  remark: string;
  PIN: string;
}

export interface InitiateTransferResponse {}

export interface TransferToMobileRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  amount: number | string;
  remark: string;
  PIN: number | string;
  transactionPin: string;
}

export interface TransferWithinRequest {
  recipient: string;
  amount: number | string;
  remark: string;
  PIN: number | string;
}

export const transferApi = {
  async verifyBankAccount(bankCode: string, accountNumber: string) {
    const { data } = await HttpService.get<VerifyBankAccountResponse>(
      `/resolve_bank_acct?bank_code=${bankCode}&account_number=${accountNumber}`
    );

    return data;
  },

  async createRecipient(req: CreateRecipientRequest) {
    const { data: res } = await HttpService.post<CreateRecipientResponse>(
      "/create_paystack_recipient",
      req
    );

    return res.data;
  },

  async initiateBankTransfer(req: InitiateTransferRequest) {
    const { data: res } = await HttpService.post<InitiateTransferResponse>(
      "/transfer",
      req
    );

    return res.data;
  },

  async transferToMobile(req: TransferToMobileRequest) {
    req.amount = convertMoneyToNumber(req.amount as string);

    const { data } = await HttpService.post<void>("/transfer_to_mobile", req);

    return data;
  },

  async transferWithin(req: TransferWithinRequest) {
    const { data } = await HttpService.post<void>("/transfer_within", req);

    return data;
  },
};
