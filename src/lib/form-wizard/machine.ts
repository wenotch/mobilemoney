import { Machine } from "xstate";
import { WizardContext, WizardEvent, WizardStateSchema } from "./types";

const events = {
  NEXT: {
    actions: "nextStep",
  },
  PREV: {
    actions: "prevStep",
  },
  SUBMIT: {
    target: "pending",
    cond: "isLastStep",
  },
};

export const wizardMachine = Machine<
  WizardContext,
  WizardStateSchema,
  WizardEvent
>({
  id: "multistepForm",
  initial: "ready",
  context: {
    currentStep: 1,
    maxSteps: 1,
    message: "",
    data: {},
  },
  states: {
    ready: {
      on: {
        INIT: {
          target: "editing",
          actions: "initialize",
        },
      },
    },
    editing: {
      on: { ...events },
    },
    pending: {
      invoke: {
        id: "submit",
        src: "submit",
        onDone: {
          target: "success",
          actions: "onDone",
        },
        onError: {
          target: "error",
          actions: "onError",
        },
      },
    },
    success: {
      type: "final",
    },
    error: {
      on: { ...events },
    },
  },
});
