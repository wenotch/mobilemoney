import { Machine, StateSchema } from "xstate";

export enum FetcherEvent {
  "PENDING" = "pending",
  "SUCCESS" = "success",
  "ERROR" = "error",
}

type OptionType<T = any> = {
  url: string;
  data?: T;
  token?: string;
};

/**
 * T is the request type
 * K is the response type
 */
type FetcherEventType<T = any, K = any> =
  | {
      type: "FETCH";
      options: OptionType<T>;
    }
  | { type: "SUCCESS"; response: K }
  | { type: "ERROR"; error: Error }
  | { type: "RETRY"; options: OptionType<T> };

interface FetcherMachineStateSchema extends StateSchema {
  states: {
    idle: {};
    pending: {};
    success: {};
    error: {};
  };
}

interface FetcherContext<T = any> {
  status: "idle" | "pending" | "error" | "success";
  response?: T;
  error?: Error;
}

export const FetcherMachine = Machine<
  FetcherContext,
  FetcherMachineStateSchema,
  FetcherEventType
>({
  id: "fetcherMachine",
  initial: "idle",
  context: {
    status: "idle",
  },
  states: {
    idle: {
      on: {
        FETCH: "pending",
      },
    },
    pending: {
      invoke: {
        id: "fetcher",
        src: "fetcherService",
        onDone: {
          target: "success",
          actions: "successHandler",
        },
        onError: "error",
      },
    },
    success: {
      type: "final",
      entry: "",
    },
    error: {
      entry: "errorHandler",
      on: {
        RETRY: "pending",
      },
    },
  },
});
