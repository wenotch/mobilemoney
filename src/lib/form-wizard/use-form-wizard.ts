import { useMachine } from "@xstate/react";
import { ErrorType } from "paygo";
import { useEffect } from "react";
import { assign } from "xstate";
import { wizardMachine } from "./machine";
import { onSubmit, WizardContext, WizardEvent } from "./types";

interface Options<T = any, K = any> {
  onSubmit: onSubmit<T>;
  onDone: (event: WizardEvent) => K;
  onError?: (error: ErrorType) => string;
}

function useFormWizard<T = any, K = any>(options: Options) {
  const { onSubmit, onDone, onError } = options;
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
        initialize: assign<WizardContext<T>, WizardEvent>({
          maxSteps: (_context, event) => {
            if (event.type === "INIT") {
              return event.maxSteps;
            }

            return 0;
          },
        }),
        onDone: assign<WizardContext<T>, WizardEvent>({
          data: (_context, event) => {
            if (event.type === "done.invoke.submit") {
              const data = onDone(event);

              return data;
            }

            return null;
          },
        }),
        onError: assign<WizardContext<T>, WizardEvent>({
          message: (_context, event) => {
            if (event.type === "error.platform.submit") {
              if (onError) {
                onError(event.data);
              }
              return event.data.message;
            }

            return "We could not complete your request at the moment. Please try again later";
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

          return await onSubmit(data);
        },
      },
    }
  );

  useEffect(() => {
    const subscription = service.subscribe((state) => console.log(state.value));

    return subscription.unsubscribe;
  }, [service]);

  const next = (data: T) => {
    send("NEXT", { data });
  };

  const previous = () => {
    send("PREV");
  };

  const submit = (data: T) => {
    send("SUBMIT", { data });
  };

  const init = (maxSteps: number) => {
    send("INIT", { maxSteps });
  };

  return {
    next,
    previous,
    submit,
    init,
    current,
  };
}

export default useFormWizard;
