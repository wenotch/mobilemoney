import { Actor, assign, interpret, Machine, spawn } from "xstate";

interface AddPaymentMethodContext {
  listPaymentMethodTypesRef: Actor<any, any>;
  addCardRef: Actor<any, any>;
  addBankRef: Actor<any, any>;
  errorMessage: string;
}

export type AddPaymentMethodEvent =
  | {
      type: "PAYMENT_METHOD.add_card";
      actor: any;
    }
  | {
      type: "PAYMENT_METHOD.add_bank_account";
      actor: any;
    }
  | {
      type: "ADD_CARD.success";
    }
  | {
      type: "ADD_CARD.error";
    }
  | {
      type: "ADD_CARD.cancelled";
    }
  | {
      type: "ADD_BANK_ACCOUNT.success";
    }
  | {
      type: "ADD_BANK_ACCOUNT.error";
    }
  | {
      type: "ADD_BANK_ACCOUNT.cancelled";
    }
  | { type: "back" };

const addPaymentMethodMachine = Machine<
  AddPaymentMethodContext,
  AddPaymentMethodEvent
>({
  id: "add-payment-method-machine",
  initial: "listPaymentMethodTypes",
  context: {} as AddPaymentMethodContext,
  on: {
    back: "listPaymentMethodTypes",
  },
  states: {
    listPaymentMethodTypes: {
      on: {
        "PAYMENT_METHOD.add_card": {
          target: "addCard",
          actions: assign({
            addCardRef: (_context, event) => spawn(event.actor),
          }),
        },
        "PAYMENT_METHOD.add_bank_account": {
          target: "addBankAccount",
          actions: assign({
            addBankRef: (_context, event) => spawn(event.actor),
          }),
        },
      },
    },
    addCard: {
      on: {
        "ADD_CARD.success": "success",
        "ADD_CARD.error": "error",
        "ADD_CARD.cancelled": "cancelled",
      },
    },
    addBankAccount: {
      on: {
        "ADD_BANK_ACCOUNT.success": "success",
        "ADD_BANK_ACCOUNT.error": "error",
        "ADD_BANK_ACCOUNT.cancelled": "cancelled",
      },
    },
    success: {
      on: {
        "PAYMENT_METHOD.add_card": {
          target: "addCard",
          actions: assign({
            addCardRef: (_context, event) => spawn(event.actor),
          }),
        },
        "PAYMENT_METHOD.add_bank_account": {
          target: "addBankAccount",
          actions: assign({
            addBankRef: (_context, event) => spawn(event.actor),
          }),
        },
      },
    },
    cancelled: {
      type: "final",
    },
    error: {
      entry: "updateError",
      after: {
        "3000": "listPaymentMethodTypes",
      },
    },
  },
});

export const addPaymentMethodService = interpret(
  addPaymentMethodMachine
).start();
