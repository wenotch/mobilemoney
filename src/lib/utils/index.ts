import AsyncStorage from "@react-native-async-storage/async-storage";
import { isUndefined } from "lodash";
import {
  AuthResponseType,
  CardPaymentMethod,
  PaymentMethod,
  Wallet,
} from "paygo";
import { MaskService } from "react-native-masked-text";

export const getToken = async (): Promise<string | null> => {
  const currentUserStr = await AsyncStorage.getItem("currentUser");

  if (currentUserStr !== null) {
    return (JSON.parse(currentUserStr) as AuthResponseType).Authorization;
  }

  return null;
};

export const convertUrlStringToArray = (url: string): string[] => {
  return url.split("/");
};

export const encrypt = (key: string, text: string) => {
  var forge = require("node-forge");
  var cipher = forge.cipher.createCipher(
    "3DES-ECB",
    forge.util.createBuffer(key)
  );
  cipher.start({ iv: "" });
  cipher.update(forge.util.createBuffer(text, "utf-8"));
  cipher.finish();
  var encrypted = cipher.output;
  return forge.util.encode64(encrypted.getBytes());
};

export const isCard = (card: PaymentMethod): card is CardPaymentMethod => {
  if (isUndefined((card as CardPaymentMethod).bin)) return false;

  return (card as CardPaymentMethod).last4Digit!.length > 0;
};

export const isBank = (wallet: PaymentMethod): wallet is Wallet => {
  return !isUndefined((wallet as Wallet).balance);
};

export const formatToMoney = (value: string) => {
  const amount = MaskService.toMask("money", value, {
    delimiter: ",",
    precision: 2,
    separator: ".",
    unit: undefined,
  });
  return amount;
};

export const convertMoneyToNumber = (value: string) => {
  return Number(value.replace(",", ""));
};
