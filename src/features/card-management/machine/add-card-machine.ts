import {
  ErrorType,
  PaymentVerification,
  StartCardVerificationResponse,
} from "paygo";
import { assign, Machine, sendParent } from "xstate";

interface AddCardContext {
  error: string | ErrorType;
  transaction: StartCardVerificationResponse;
}

type AddCardEvent =
  | {
      type: "ADD_CARD.success";
      data: any;
    }
  | {
      type: "ADD_CARD.cancelled";
      error: any;
    }
  | {
      type: "done.invoke.startCardVerification";
      data: StartCardVerificationResponse;
    }
  | {
      type: "error.invoke.startCardVerification";
      error: ErrorType;
    };

export const addCardMachine = Machine<AddCardContext, AddCardEvent>(
  {
    id: "addCardMachine",
    context: {
      error: "",
      transaction: {},
    } as AddCardContext,
    initial: "startCardVerification",
    states: {
      startCardVerification: {
        invoke: {
          id: "startCardVerification",
          src: "startCardVerification",
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
          "ADD_CARD.success": {
            target: "success",
          },
          "ADD_CARD.cancelled": {
            target: "cancelled",
            actions: ["updateError"],
          },
        },
      },
      error: {
        type: "final",
        entry: sendParent((context) => ({
          type: "ADD_CARD.error",
          data: context.error,
        })),
      },
      success: {
        type: "final",
        entry: sendParent(() => ({
          type: "ADD_CARD.success",
        })),
      },
      cancelled: {
        type: "final",
        entry: sendParent(() => ({
          type: "ADD_CARD.cancelled",
        })),
      },
    },
  },
  {
    actions: {
      updateTransaction: assign({
        transaction: (_context, event) => {
          if (event.type === "done.invoke.startCardVerification") {
            return event.data;
          }

          return {} as PaymentVerification;
        },
      }),
      updateError: assign({
        error: (_context, event) => {
          if (event.type === "error.invoke.startCardVerification") {
            return event.error;
          }

          return "";
        },
      }),
    },
  }
);
