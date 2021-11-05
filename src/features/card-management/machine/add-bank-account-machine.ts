import { ErrorType, StartBankAccountVerificationResponse } from "paygo";
import { Machine, sendParent } from "xstate";

interface AddBankAccountContext {
  error: string | ErrorType;
  transaction: StartBankAccountVerificationResponse;
}

type AddCardEvent =
  | {
      type: "ADD_BANK_ACCOUNT.success";
    }
  | {
      type: "ADD_BANK_ACCOUNT.error";
    }
  | {
      type: "ADD_BANK_ACCOUNT.cancelled";
    }
  | {
      type: "done.invoke.startBankAccountVerification";
      data: StartBankAccountVerificationResponse;
    }
  | {
      type: "error.invoke.startBankAccountVerification";
      error: ErrorType;
    };

export const addBankAccountMachine = Machine<
  AddBankAccountContext,
  AddCardEvent
>(
  {
    id: "addBankAccountMachine",
    context: {
      error: "",
    } as AddBankAccountContext,
    initial: "ready",
    states: {
      startBankAccountVerification: {
        invoke: {
          id: "startBankAccountVerification",
          src: "startBankAccountVerification",
          onDone: {
            target: "ready",
            actions: ["updateTransaction"],
          },
          onError: {
            target: "error",
            actions: ["updateError"],
          },
        },
      },
      ready: {
        on: {
          "ADD_BANK_ACCOUNT.success": {
            target: "success",
          },
          "ADD_BANK_ACCOUNT.error": {
            target: "error",
            actions: ["updateError"],
          },
          "ADD_BANK_ACCOUNT.cancelled": {
            target: "cancelled",
          },
        },
      },
      error: {
        type: "final",
        entry: sendParent((context) => ({
          type: "ADD_BANK_ACCOUNT.error",
          data: context.error,
        })),
      },
      success: {
        type: "final",
        entry: sendParent(() => ({
          type: "ADD_BANK_ACCOUNT.success",
        })),
      },
      cancelled: {
        type: "final",
        entry: sendParent(() => ({
          type: "ADD_BANK_ACCOUNT.cancelled",
        })),
      },
    },
  },
  {
    actions: {
      updateTransaction: (_context, event) => {
        if (event.type === "done.invoke.startBankAccountVerification") {
          return event.data;
        }

        return {};
      },
      updateError: (_context, event) => {
        if (event.type === "error.invoke.startBankAccountVerification") {
          return event.error;
        }
      },
    },
  }
);
