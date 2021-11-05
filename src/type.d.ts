declare module "paygo" {
  export interface User {
    id?: number;
    bvn: string;
    email: string;
    phone: string;
    password: string;
    address: string | null;
    city: string | null;
    state: string | null;
    nextOfKinName: string | null;
    nextOfKinAddress: string | null;
    isCompletedTour: string | null;
    nextOfKinPhone: string | null;
    firstName: string;
    lastName: string;
    middleName?: string | null;
    dateOfBirth: string | null;
    gender: string;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
    isFirstTimer?: boolean;
    fundingAccount: null;
    paymentMethods: PaymentMethod[];
    pin: string | number | null;
  }

  export interface SetPinRequest {
    pin: string;
  }

  export interface VerifyBVNRequest {
    userId: number;
    bvn: string;
  }

  export type UserRegistration = Exclude<
    User,
    "isPhoneVerified" | "isEmailVerified" | "isFirstTimer"
  > & { confirmPassword: string };

  export type LoginCredentialType = Pick<User, "email" | "password">;

  export type AuthCredential = Pick<User, "email" | "password">;

  export interface VerifyTokenRequest {
    id: number | string;
    code: number | string;
  }

  export interface AuthResponseType extends User {
    Authorization: string;
  }

  export type CurrentUser = Exclude<
    AuthResponseType,
    "password" | "Authorization"
  >;

  export type AuthToken = Pick<AuthResponseType, "Authorization">;

  export interface Customer extends User {}

  export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

  export interface Agent {
    country: string;
    identification: {
      number: string;
      id: number;
      type: string;
      issueDate: Date;
      expDate: Date;
      status: string;
    };c
    utilityBill: string;
    city: string;
    businessName: string;
    description: string;
    state: string;
    businessAddress: string;
    isApproved: boolean;
  }

  export interface PaymentVerification {
    id: number;
    recipient: {
      id: number;
      owner: null | number;
      userId: number;
    };
    transactionType: string;
    amount: number;
    transactTime: null | Date;
    remark: string;
    status: string;
  }

  export type StartBankAccountVerificationResponse = PaymentVerification;
  export type StartCardVerificationResponse = PaymentVerification;

  export interface CardDetail {
    cvv: string;
    number: string;
    expiry_month: string;
    expiry_year: string;
    expiry_date: string;
  }

  export type AddCardType = CardDetail & { pin: string };

  export interface VerifyCardRequest {
    email: string;
    amount: string;
    card: Partial<CardDetail>;
    pin: string;
    metadata?: Record<string, CustomField[]>;
    reference: string;
  }

  export type CustomField = {
    display_name: string;
    variable_nam: string;
    value: string;
  };

  export type PayStackTransactionStatus =
    | "success"
    | "send_otp"
    | "pending"
    | "send_pin"
    | "failed"
    | "open_url"
    | "send_phone"
    | "send_birthday"
    | "send_address";

  export interface PaystackResponse {
    status: boolean;
    message: string;
    data: {
      amount: number;
      currency: string;
      transaction_date: string;
      status: PayStackTransactionStatus;
      reference: string;
      domain: string;
      metadata: Record<string, CustomField[]>;
      gateway_response: "Successful";
      message: string | null;
      channel: "card" | "bank" | "ussd";
      ip_address: string;
      log: null | string;
      fees: number;
      authorization: {
        authorization_code: string;
        bin: string;
        last4: string;
        exp_month: string;
        exp_year: string;
        channel: string;
        card_type: string;
        bank: string;
        country_code: string;
        brand: string;
        reusable: boolean;
        signature: string;
      };
      customer: {
        id: number;
        first_name: string | null;
        last_name: string | null;
        email: string;
        customer_code: string;
        phone: string | null;
        metadata: string | null;
        risk_action: string;
      };
      plan: string | null;
    };
  }

  export interface CardPaymentMethod {
    id: number;
    token: string;
    bin: null | string;
    last4Digit: null | string;
    issuer: string;
    type: string;
    country: string;
    expiry: string;
  }

  export interface BankPaymentMethod {
    id: number;
    accountNo: string;
    accountName: string;
    bankCode: string;
  }

  export interface Wallet {
    id: number;
    balance: number;
  }

  export type PaymentMethod = CardPaymentMethod | BankPaymentMethod | Wallet;

  export type PaymentMethods = PaymentMethod[];

  export interface ID {
    number: string;
    type: string;
    expDate: Date;
    issueDate: Date;
  }

  export interface Transaction {
    id: number;
    user: User;
    recipient: Recipient;
    transactionType: string;
    amount: number;
    transactTime: Date;
    remark: string;
    pin: string;
    status: string;
  }

  export type ErrorType = {
    status: string;
    message: string;
  };

  export interface PaymentMethodType {
    title: string;
    type: "card" | "bank_account";
  }

  export type CurrencyType = "NGN" | "GHS" | "USD" | "EUR" | "GBP";

  interface BankTransferRequest {
    bank_code: string;
    account_number: string;
    type: "nuban";
    name: string;
    currency: CurrencyType;
    amount: number;
    recipient: string;
    remark?: string;
    saveBeneficiary: boolean;
    PIN: number;
  }

  export interface Recipient {
    id: number;
  }

  export interface PayGoBeneficiary {
    beneficiary: User;
    paymentType: string;
  }

  export interface BankBeneficiary {
    bankCode: string;
    nubanNumber: number;
    title: string;
  }

  export interface Bill {
    id: number;
    biller_code: string;
    name: string;
    default_commission: number;
    date_added: string;
    country: string;
    is_airtime: boolean;
    biller_name: string;
    item_code: string;
    short_name: "string";
    fee: number;
    commission_on_fee: boolean;
    label_name:
      | "Mobile Number"
      | "Smart Card Number"
      | "LCC Account Number"
      | "Meter Number"
      | "Number"
      | "Tax Identification Number (TIN)"
      | "Account Number";
    amount: number;
  }

  export interface GetBillResponse {
    status: string;
    message: string;
    data: Bill[];
  }

  export interface ChargeCardRequest {
    amount: string | number;
    methodId: number;
  }

  export type Beneficiary = PayGoBeneficiary | BankBeneficiary;

  export interface PayBillRequest {
    recurring: boolean;
    intervalInDays: number;
    PIN: string;
    billDetails: Pick<
      CreateBillPaymentForm,
      "amount" | "country" | "customer" | "type"
    >;
  }

  export interface CreateBillPaymentForm {
    country: string;
    customer: string;
    amount: number | string;
    type: string;
    PIN: string;
    recurring: boolean;
    intervalInDays: number;
  }

  export interface ValidateBillingCustomerResponse {
    biller_code: string;
    name: string | null;
    response_code: string;
    address: string;
    response_message: string;
    customer: string;
    product_code: string;
    email: string | null;
  }
}

declare module "react-native-paystack-webview" {}
