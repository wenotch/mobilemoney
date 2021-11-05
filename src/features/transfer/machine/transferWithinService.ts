import { isUndefined } from "lodash";
import { assign, Machine } from "xstate";
import { TransferWithinRequest } from "../../../api/transferApi";

export interface TransferWithinContext {
  recipient: any;
  transferForm: TransferWithinRequest;
  error: string;
  phone: string;
}

export type TransferWithinEvent =
  | {
      type: "CONFIRM_RECIPIENT";
      phone: string;
    }
  | {
      type: "done.invoke.confirmingRecipientPhone";
      data: any;
    }
  | {
      type: "error.platform.confirmingRecipientPhone";
      data: any;
    }
  | {
      type: "PROCEED";
      data: TransferWithinRequest;
    }
  | {
      type: "done.invoke.initiateTransfer";
      data: any;
    }
  | {
      type: "error.platform.initiateTransfer";
      data: any;
    }
  | {
      type: "TRANSACTION_CONFIRMED";
      data: TransferWithinRequest;
    }
  | {
      type: "BACK";
    };

export const transferWithinMachine = Machine<
  TransferWithinContext,
  TransferWithinEvent
>(
  {
    id: "transferWithin",
    initial: "transferForm",
    context: {} as TransferWithinContext,
    states: {
      transferForm: {
        initial: "unSubmitted",
        states: {
          unSubmitted: {
            on: {
              CONFIRM_RECIPIENT: {
                target: "confirmingRecipientPhone",
                actions: "updatePhone",
              },
              PROCEED: {
                target: "confirmation",
                actions: "updateRequest",
                cond: "canProceed",
              },
            },
          },
          confirmingRecipientPhone: {
            invoke: {
              id: "confirmingRecipientPhone",
              src: "confirmRecipientPhone",
              onDone: {
                target: "unSubmitted",
                actions: "updateRecipient",
              },
              onError: {
                actions: "updateError",
                target: "#transferWithin.error",
              },
            },
          },
          confirmation: {
            on: {
              BACK: "unSubmitted",
              TRANSACTION_CONFIRMED: "#transferWithin.initiatingTransfer",
            },
          },
        },
      },
      initiatingTransfer: {
        invoke: {
          id: "initiatingTransfer",
          src: "initiateTransfer",
          onDone: {
            target: "success",
          },
          onError: {
            target: "error",
            actions: "updateError",
          },
        },
      },
      success: {
        after: {
          "10000": "complete",
        },
      },
      complete: {
        after: {
          "3000": {
            target: "transferForm",
            actions: assign({
              error: () => "",
              phone: () => "",
              recipient: () => "",
              transferForm: () => {},
            }),
          },
        },
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
      updateError: assign({
        error: (_, event) => {
          return event.type === "error.platform.confirmingRecipientPhone" ||
            event.type === "error.platform.initiateTransfer"
            ? event.data.message
            : "";
        },
      }),
      updateRecipient: assign({
        recipient: (context, event) => {
          const recipient =
            event.type === "done.invoke.confirmingRecipientPhone"
              ? { ...context, ...event.data }
              : {};

          return recipient;
        },
      }),
      updateRequest: assign({
        transferForm: (_, event) => {
          return event.type === "PROCEED"
            ? event.data
            : ({} as TransferWithinRequest);
        },
      }),
      updatePhone: assign({
        phone: (_, event) => {
          return event.type === "CONFIRM_RECIPIENT" ? event.phone : "";
        },
      }),
      // reset: assign({})
    },
    guards: {
      canProceed(context, _event) {
        return !isUndefined(context.recipient);
      },
    },
  }
);
