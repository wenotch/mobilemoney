import { Transaction } from "paygo";
import { HttpService } from "../lib/http-service";

const getTransactionHistory = async (start: number) => {
  const { data } = await HttpService.get<Transaction[]>(
    `/transactions?start=${start}`
  );

  return data || [];
};

export const transactionHistoryService = {
  getTransactionHistory,
};
