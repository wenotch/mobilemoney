import { Interpreter, State } from "xstate";

export interface WizardContext<T = any> {
  maxSteps: number;
  currentStep: number;
  message: string;
  data: T | undefined;
}

export type WizardEvent<T = any> =
  | { type: "NEXT"; data: T }
  | { type: "PREV" }
  | { type: "SUBMIT"; data: T }
  | { type: "ERROR"; response: any }
  | { type: "SUCCESS"; response: any }
  | { type: "INIT"; maxSteps: number };

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

export type onSubmit<T = any> = (values: T) => void;
