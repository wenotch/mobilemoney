import { ErrorType, Transaction } from "paygo";
import { assign, Machine } from "xstate";

interface LoadTransactionContext {
  transactions: Transaction[];
  error: ErrorType;
}

type LoadTransactionEvent =
  | {
      type: "transactions.load";
    }
  | {
      type: "transactions.loaded";
      data: Transaction[];
    }
  | {
      type: "transactions.error";
      data: ErrorType;
    }
  | {
      type: "transactions.loadMore";
    };

export const loadTransactionMachine = Machine<
  LoadTransactionContext,
  LoadTransactionEvent
>(
  {
    id: "loadTransactionMachine",
    context: {} as LoadTransactionContext,
    initial: "idle",
    states: {
      idle: {
        on: {
          "transactions.load": "loading",
        },
      },
      loading: {
        invoke: {
          id: "loadTransactions",
          src: "loadTransactions",
          onDone: {
            target: "success",
            actions: ["loadTransactionSuccess"],
          },
          onError: {
            target: "error",
            actions: ["loadTransactionFailed"],
          },
        },
      },
      success: {
        on: {
          "transactions.loadMore": {
            target: "loading",
            actions: ["loadMore"],
          },
        },
      },
      loadMoreTransactions: {
        invoke: {
          src: "loadMoreTransactions",
          onDone: {
            target: "success",
            actions: ["loadTransactionSuccess"],
          },
          onError: {
            target: "error",
            actions: ["loadTransactionFailed"],
          },
        },
      },
      error: {
        after: {
          "3000": "idle",
        },
      },
    },
  },
  {
    actions: {
      loadTransactionSuccess: assign({
        transactions: (context, event) => {
          const { transactions } = context;

          if (event.type === "transactions.loaded") {
            return [...context.transactions].concat(event.data);
          }

          return [];
        },
      }),
      loadTransactionFailed: assign({
        error: (_context, event) => {
          if (event.type === "transactions.error") {
            return event.data;
          }

          return {} as ErrorType;
        },
      }),
    },
  }
);
