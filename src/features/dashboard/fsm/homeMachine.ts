import { ErrorType, PaymentMethods, Transaction } from "paygo";
import { assign, Machine } from "xstate";

interface HomeContext {
  paymentMethods: PaymentMethods;
  transactionHistory: Transaction[];
  transactionQueryParams: {
    start: number;
    count: number;
  };
}

type HomeEvent =
  | { type: "LOAD_PAYMENT_METHODS_SUCCESS"; data: PaymentMethods }
  | { type: "LOAD_TRANSACTIONS_SUCCESS"; data: Transaction[] }
  | { type: "LOAD_TRANSACTIONS_FAILED"; data: ErrorType }
  | { type: "FETCH_TRANSACTIONS"; start: number; count: number }
  | { type: "FETCH_MORE_TRANSACTIONS" }
  | { type: "LOAD_PAYMENT_METHODS" };

export const homeMachine = Machine<HomeContext, HomeEvent>({
  id: "homeMachine",
  context: {
    paymentMethods: [],
    transactionHistory: [],
    transactionQueryParams: {
      start: 0,
      count: 10,
    },
  } as HomeContext,
  type: "parallel",
  states: {
    loadPaymentMethods: {
      initial: "idle",
      states: {
        idle: {
          on: {
            LOAD_PAYMENT_METHODS: "pending",
          },
        },
        pending: {
          on: {
            LOAD_PAYMENT_METHODS_SUCCESS: {
              actions: assign({
                paymentMethods: (_context, event) => {
                  return event.data;
                },
              }),
              target: "success",
            },
          },
        },
        success: {
          after: {
            "3000": "idle",
          },
        },
      },
    },
    loadTransactions: {
      initial: "idle",
      states: {
        idle: {
          on: {
            FETCH_TRANSACTIONS: {
              target: "pending",
              actions: assign({
                transactionQueryParams: (_context, event) => ({
                  count: event.count || 10,
                  start: event.start,
                }),
              }),
            },
            FETCH_MORE_TRANSACTIONS: {
              target: "pending",
              actions: assign({
                transactionQueryParams: (context, _event) => ({
                  ...context.transactionQueryParams,
                  start:
                    (context.transactionQueryParams.start + 1) *
                    context.transactionQueryParams.count,
                }),
              }),
            },
          },
        },
        pending: {
          on: {
            LOAD_TRANSACTIONS_SUCCESS: {
              actions: assign({
                transactionHistory: (_context, event) => event.data,
              }),
              target: "idle",
            },
            LOAD_TRANSACTIONS_FAILED: "idle",
          },
        },
      },
    },
  },
});
