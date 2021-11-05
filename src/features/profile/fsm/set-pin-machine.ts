import { ErrorType } from "paygo";
import { assign, createMachine } from "xstate";
import { userService } from "../services/user-service";

interface SetPinContext {
  errorMessage: string | null;
}

type SetPinEvent =
  | {
      type: "set_pin";
      pin: string;
    }
  | {
      type: "done.invoke.settingPin";
      data: any;
    }
  | {
      type: "error.platform.settingPin";
      data: ErrorType;
    };

export const setPINMachine = createMachine<SetPinContext, SetPinEvent>(
  {
    id: "setPin",
    context: {} as SetPinContext,
    initial: "idle",
    states: {
      idle: {
        on: {
          set_pin: "settingPin",
        },
      },
      settingPin: {
        invoke: {
          id: "settingPin",
          src: "setPin",
          onDone: "success",
          onError: {
            target: "error",
            actions: ["updateErrorMessage"],
          },
        },
      },
      success: {
        after: {
          "3000": "completed",
        },
      },
      error: {
        after: {
          "3000": "idle",
        },
      },
      completed: {
        type: "final",
      },
    },
  },
  {
    actions: {
      updateErrorMessage: assign({
        errorMessage: (_context, event) => {
          if (event.type === "error.platform.settingPin") {
            return event.data.message;
          }

          return null;
        },
      }),
    },
    services: {
      setPin: async (_context, event) => {
        if (event.type === "set_pin") {
          const { pin } = event;

          return userService.setPIN({ pin });
        }
      },
    },
  }
);
