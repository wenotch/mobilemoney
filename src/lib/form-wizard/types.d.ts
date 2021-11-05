import { AxiosError } from "axios";
import { ErrorType } from "paygo";
import { Interpreter, State } from "xstate";

export interface WizardContext<T = any> {
  maxSteps: number;
  currentStep: number;
  message: string | null;
  data: T | null;
}

export type WizardEvent<T = any> =
  | { type: "NEXT"; data: T }
  | { type: "PREV" }
  | { type: "SUBMIT"; data: T }
  | { type: "ERROR"; data: AxiosError<ErrorType> }
  | { type: "done.invoke.submit"; data: any }
  | { type: "INIT"; maxSteps: number }
  | { type: "error.platform.submit"; data: ErrorType };

export interface WizardStateSchema {
  states: {
    ready: {};
    editing: {};
    pending: {};
    error: {};
    success: {};
  };
}

type WizardState<T = any> = State<
  WizardContext<T>,
  WizardEvent,
  any,
  {
    value: any;
    context: WizardContext<T>;
  }
>;

type WizardService<T = any> = Interpreter<
  WizardContext<T>,
  any,
  WizardEvent,
  {
    value: any;
    context: WizardContext<T>;
  }
>;

export type ContextType<T = any> = {
  send: (event: WizardEvent<T>, data: Partial<WizardContext<T>>) => void;
  state: WizardState;
  service: WizardService;
};

export type onSubmit<T = any> = (values: T) => Promise<TResult | undefined>;
