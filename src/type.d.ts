declare module "paygo" {
  export interface User {
    id?: number;
    bvn: string;
    email: string;
    phone: string;
    password: string;
    address: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    gender: string;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
    isFirstTimer?: boolean;
  }

  export type UserRegistration = Exclude<
    User,
    "isPhoneVerified" | "isEmailVerified" | "isFIrstTimer"
  > & { confirmPassword: string };

  export type LoginCredentialType = Pick<User, "phone" | "password">;

  export type AuthCredential = Pick<User, "phone" | "password">;

  export interface Customer extends User {}

  export interface Agent extends User {
    businessName: string;
    description: string;
    adddress: string;
    utilityBill: string;
    id: ID[];
  }

  export interface ID {
    number: string;
    type: string;
    expDate: Date;
    issueDate: Date;
  }

  export interface Transaction {
    id: number;
    user: User;
    beneficiary: Recipient;
    transactionType: string;
    amount: number;
    transactionTime: Date;
    remark: string;
    pin: string;
    status: string;
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

  export type Beneficiary = PayGoBeneficiary | BankBeneficiary;
}
