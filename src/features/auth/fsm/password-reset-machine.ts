import { ErrorType } from "paygo";
import { assign, interpret, Machine, MachineConfig } from "xstate";

interface StateSchema {
  states: {
    login: {};
    requestResetToken: {
      states: {
        idle: {};
        submitting: {};
        success: {};
        error: {};
      };
    };
    resetPassword: {
      states: {
        idle: {};
        submitting: {};
        success: {};
        error: {};
      };
    };
  };
}

interface Context {
  data: { email: string } | undefined;
  error: string | undefined;
  resetPasswordRequest:
    | {
        code: string;
        password: string;
      }
    | undefined;
}

type Event =
  | {
      type: "INITIATE_PASSWORD_RESET";
    }
  | { type: "REQUEST_RESET_TOKEN"; email: string }
  | {
      type: "RESET_PASSWORD";
      data: {
        code: string;
        password: string;
      };
    }
  | { type: "SUBMIT"; data: { email: string } }
  | { type: "BACK" }
  | { type: "RESEND_TOKEN" }
  | { type: "SUCCESS" }
  | { type: "ERROR"; data: ErrorType };

type RequestResetTokenStateSchemaType = StateSchema["states"]["requestResetToken"];
type ResetPasswordStateSchemaType = StateSchema["states"]["resetPassword"];

const requestResetToken: MachineConfig<
  any,
  RequestResetTokenStateSchemaType,
  Event
> = {
  id: "requestResetToken",
  initial: "idle",
  states: {
    idle: {
      on: {
        SUBMIT: {
          target: "submitting",
          actions: ["submit"],
        },
        BACK: "#resetPasswordMachine.login",
      },
    },
    submitting: {
      on: {
        ERROR: {
          target: "error",
          actions: assign({
            error: (_context, event) => event.data.message,
          }),
        },
        SUCCESS: "success",
      },
    },
    success: {
      on: {
        SUCCESS: "#resetPassword.idle",
      },
    },
    error: {
      after: {
        "3000": "idle",
      },
    },
  },
};

const resetPassword: MachineConfig<any, ResetPasswordStateSchemaType, Event> = {
  id: "resetPassword",
  initial: "idle",
  states: {
    idle: {
      on: {
        BACK: "#resetPasswordMachine.login",
        RESEND_TOKEN: "#requestResetToken.submitting",
        RESET_PASSWORD: {
          actions: "resetPassword",
          target: "submitting",
        },
      },
    },
    submitting: {
      on: {
        ERROR: {
          target: "error",
          actions: assign({
            error: (_context, event) => event.data.message,
          }),
        },
        SUCCESS: "success",
      },
    },
    success: { type: "final" },
    error: {
      after: {
        "3000": "idle",
      },
    },
  },
};

const resetPasswordMachine = Machine<Context, StateSchema, Event>(
  {
    id: "resetPasswordMachine",
    initial: "login",
    context: {
      data: undefined,
      error: undefined,
      resetPasswordRequest: undefined,
    },
    states: {
      login: {
        on: {
          INITIATE_PASSWORD_RESET: "requestResetToken",
        },
      },
      requestResetToken: {
        ...requestResetToken,
      },
      resetPassword: {
        ...resetPassword,
      },
    },
  },
  {
    actions: {
      submit: assign({
        data: (_context, event) => {
          if (event.type === "SUBMIT") {
            return event.data;
          }

          return undefined;
        },
      }),
      resetPassword: assign({
        resetPasswordRequest: (_context, event) => {
          if (event.type === "RESET_PASSWORD") {
            return event.data;
          }
        },
      }),
    },
    guards: {},
    services: {},
  }
);

export const resetPasswordService = interpret(resetPasswordMachine).start();

resetPasswordService.machine.config;
