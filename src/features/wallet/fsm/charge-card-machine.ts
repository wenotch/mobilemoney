import { ErrorType } from "paygo";
import { Machine } from "xstate";

type Event =
  | {
      type: "BACK";
    }
  | {
      type: "CARD_SELECTED";
      data: number;
    }
  | { type: "PROCEED" }
  | {
      type: "TRANSACTION_APPROVED";
    }
  | {
      type: "TRANSACTION_SUCCESS";
    }
  | {
      type: "TRANSACTION_FAILED";
      data: ErrorType;
    };

export const chargeCardMachine = Machine<any, Event>({
  id: "chargeCard",
  context: {},
  initial: "cardListing",
  states: {
    cardListing: {
      on: {
        PROCEED: {
          target: "transactionReview",
        },
      },
    },
    transactionReview: {
      on: {
        TRANSACTION_APPROVED: {
          target: "chargingCard",
        },
        BACK: "cardListing",
      },
    },
    chargingCard: {
      on: {
        TRANSACTION_SUCCESS: "success",
      },
    },
    success: {
      after: {
        "3000": "completed",
      },
    },
    completed: {},
  },
});
