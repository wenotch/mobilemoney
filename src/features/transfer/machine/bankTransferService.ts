import { isUndefined } from "lodash";
import { BankBeneficiary, ErrorType } from "paygo";
import { assign, Machine, StateSchema } from "xstate";
import { Bank } from "../../../api/bankApi";
import {
  CreateRecipientResponse,
  InitiateTransferRequest,
  InitiateTransferResponse,
  VerifyBankAccountResponse,
} from "../../../api/transferApi";

export interface BankTransferForm {
  saveBeneficiary: boolean;
  bankCode: string;
  accountNumber: string;
  type: string;
  name: string;
  currency: string;
  remark?: string;
  amount: number | string;
  PIN: string;
  recipient: string;
}
export interface BankTransferContext {
  banks: Bank[];
  beneficiaries: BankBeneficiary[];
  error: string;
  selectedBankName: string;
  filteredBanks: Bank[];
  form: BankTransferForm;
}

export interface BankTransferStateSchema extends StateSchema {
  states: {
    loadingBanks: {};
    preAccountVerification: {};
    verifyingAccountNumber: {};
    creatingRecipient: {};
    postCreateRecipient: {};
    initiatingTransfer: {};
    completed: {};
    error: {};
  };
}

export type BankTransferEvent =
  | { type: "BACK" }
  | {
      type: "done.invoke.loadBanks";
      data: Bank[];
    }
  | {
      type: "error.platform.loadBanks";
      data: ErrorType;
    }
  | {
      type: "VERIFY_ACCOUNT_NUMBER_INITIATED";
    }
  | {
      type: "done.invoke.verifyAccountNumber";
      data: Pick<VerifyBankAccountResponse, "data">;
    }
  | {
      type: "error.platform.verifyAccountNumber";
      data: ErrorType;
    }
  | {
      type: "done.invoke.creatingRecipient";
      data: Pick<CreateRecipientResponse, "data">;
    }
  | {
      type: "error.platform.creatingRecipient";
      data: ErrorType;
    }
  | {
      type: "TRANSFER_INITIATED";
    }
  | {
      type: "done.invoke.initiateTransfer";
      data: InitiateTransferResponse;
    }
  | {
      type: "error.platform.initiateTransfer";
      data: ErrorType;
    }
  | {
      type: "FIND_BANK";
      query: string;
    }
  | {
      type: "PROCEED";
      data: InitiateTransferRequest;
    }
  | {
      type: "CREATE_RECIPIENT_INITIATED";
    }
  | {
      type: "BANK_SELECTED";
      data: Bank;
    };

export const bankTransferService = Machine<
  BankTransferContext,
  BankTransferEvent
>(
  {
    id: "transfer",
    context: {
      filteredBanks: [] as Bank[],
      banks: [] as Bank[],
      form: {
        type: "nuban",
        currency: "NGN",
      },
    } as BankTransferContext,
    initial: "loadingBanks",
    states: {
      loadingBanks: {
        invoke: {
          id: "loadBanks",
          src: "loadBanks",
          onDone: {
            target: "transferForm",
            actions: "updateBanks",
          },
          onError: "error",
        },
      },
      transferForm: {
        initial: "form",
        id: "transferForm",
        on: {
          BACK: ".form",
        },
        states: {
          form: {
            on: {
              VERIFY_ACCOUNT_NUMBER_INITIATED: {
                target: "verifyingAccountNumber",
              },
              FIND_BANK: {
                actions: "filterBanks",
              },
              CREATE_RECIPIENT_INITIATED: {
                target: "creatingRecipient",
              },
              BANK_SELECTED: {
                actions: "updateSelectedBank",
              },
              PROCEED: { target: "confirmation", actions: "updateTransaction" },
            },
          },
          verifyingAccountNumber: {
            invoke: {
              id: "verifyAccountNumber",
              src: "verifyAccountNumber",
              onDone: {
                target: "creatingRecipient",
                actions: "updateTransaction",
              },
              onError: {
                target: "#transfer.error",
                actions: "updateError",
              },
            },
          },
          creatingRecipient: {
            invoke: {
              id: "creatingRecipient",
              src: "createRecipient",
              onDone: {
                target: "form",
                actions: "updateTransaction",
              },
              onError: {
                target: "#transfer.error",
                actions: "updateError",
              },
            },
          },
          confirmation: {
            on: {
              TRANSFER_INITIATED: "#transfer.initiatingTransfer",
              BACK: "form",
            },
          },
        },
      },
      initiatingTransfer: {
        invoke: {
          id: "initiateTransfer",
          src: "initiateTransfer",
          onDone: "success",
          onError: {
            target: "error",
            actions: "updateError",
          },
        },
      },
      success: {
        after: {
          "3000": "completed",
        },
      },
      completed: {
        type: "final",
      },
      error: {
        after: {
          "3000": "transferForm",
        },
      },
    },
  },
  {
    actions: {
      updateBanks: assign({
        banks: (_context, event) => {
          return event.type === "done.invoke.loadBanks" ? event.data : [];
        },
      }),
      filterBanks: assign({
        filteredBanks: (context, event) => {
          const banks =
            event.type === "FIND_BANK"
              ? context.banks.filter(
                  (bank) =>
                    bank.name.toLowerCase().search(event.query.toLowerCase()) >=
                    0
                )
              : [];

          return banks;
        },
      }),
      updateTransaction: assign({
        form: (context, event) => {
          switch (event.type) {
            case "done.invoke.verifyAccountNumber":
              return {
                ...context.form,
                accountNumber: event.data.data.account_number,
                name: event.data.data.account_name,
              };

            case "done.invoke.creatingRecipient":
              return {
                ...context.form,
                recipient: event.data.recipient_code,
              };

            case "PROCEED":
              return {
                ...context.form,
                amount: event.data.amount,
                remark: event.data.remark,
                PIN: event.data.PIN,
              };

            default:
              return {
                ...context.form,
              };
          }
        },
      }),
      updateSelectedBank: assign({
        selectedBankName: (context, event) => {
          return event.type === "BANK_SELECTED"
            ? event.data.name
            : context.selectedBankName;
        },
      }),
      updateError: assign({
        error: (context, event) => {
          return event.type === "error.platform.creatingRecipient" ||
            event.type === "error.platform.initiateTransfer" ||
            event.type === "error.platform.verifyAccountNumber"
            ? event.data.message
            : context.error;
        },
      }),
    },
    guards: {
      hasAccountNumber(context, _event) {
        return !isUndefined(context.form.accountNumber);
      },
    },
  }
);
