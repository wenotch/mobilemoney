export enum Colors {
  blue = "#0555DB",
  gold = "#DDBA08",
  grey = "#F1F1F1",
  white = "#FFFFFF",
  black = "#000000",
  lightBlue = "#42AAFF",
  royalBlue = "#4169e1",
  // darkBlue = "#00008B",
  darkBlue = "#0555DB",
  purple = "#800080",
  darkGrey = "#E3E1E1",
  lightGrey = "#8F9BB3",
  totalGrey = "#474747",
  seafoam = "#93E9BE",
}

export enum ErrorCodes {
  "not_found" = "6004",
  "failed_auth" = "6001",
  "constraint_violation" = "6002",
  "invalid_otp" = "6003",
  "duplicate_record" = "6005",
  "email_verification_pending" = "6006",
  "bvn_verification_pending" = "6007",
  "server_error" = "500",
  "no_pin" = "6011",
  "forbidden" = "6010",
  "web_token_expired" = "6012",
  "bank_verification_error" = "6008",
  "insufficient_balance" = "6013",
}

export const flashMessageDuration = 3000;

// export const paystackPK = "pk_live_61e5a263a3f4b9acb2684bb50cd547b42a4a7469";
// export const baseUrl = "https://paygo.gitit-tech.com/api";

export const paystackPK = "pk_test_5c2e47aab82c01c33d041b05916814991cf6971c";
export const baseUrl = "https://paygo.gitit-tech.com/";
