import { useMachine } from "@xstate/react";
import { assign } from "xstate";
import { wizardMachine } from "./machine";
import { onSubmit, WizardContext, WizardEvent } from "./types";

interface Options<T = any> {
  onSubmit: onSubmit<T>;
}

function useFormWizard<T = any>(options: Options) {
  const { onSubmit } = options;
  const [current, send, service] = useMachine<WizardContext<T>, WizardEvent>(
    wizardMachine,
    {
      actions: {
        nextStep: assign({
          data: (ctx, event) => {
            if (event.type === "NEXT") {
              return { ...ctx.data, ...event.data };
            }

            return undefined;
          },
          currentStep: (ctx, _event) =>
            Math.min(ctx.maxSteps, ctx.currentStep + 1),
        }),
        prevStep: assign({
          currentStep: (ctx, _event) => Math.max(1, ctx.currentStep - 1),
        }),
        completed: assign({
          message: (_ctx, event) => {
            if (event.type === "SUCCESS" || event.type === "ERROR") {
              return event.response;
            }

            return null;
          },
        }),
        initialize: assign<WizardContext<T>, WizardEvent>({
          maxSteps: (_context, event) => {
            if (event.type === "INIT") {
              return event.maxSteps;
            }

            return 0;
          },
        }),
      },
      guards: {
        isLastStep(context, _event) {
          return context.currentStep === context.maxSteps;
        },
      },
      services: {
        async submit(context, event) {
          let { data } = context;
          if (event.type === "SUBMIT") {
            data = { ...context.data, ...event.data };
          }

          onSubmit(data!);
        },
      },
    }
  );

  return {
    send,
    current,
    service,
  };
}

export default useFormWizard;
