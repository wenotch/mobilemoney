import { CardPaymentMethod, ErrorType } from "paygo";
import { assign, interpret, Interpreter, Machine, send, spawn } from "xstate";

type PaymentMethods = "card" | "bank" | "transfer" | null;

interface FundAccountContext {
  actorRef: Interpreter<any, any>;
  selectedCard: CardPaymentMethod;
  selectedPaymentMethod: PaymentMethods;
  amount: number;
  message: string;
}

interface FundAccountResetEvent {
  type: "RESET";
}

interface BackEvent {
  type: "BACK";
}

interface PaymentMethodSelectedEvent {
  type: "PAYMENT_METHOD_SELECTED";
  paymentMethod: PaymentMethods;
}

interface CardSelectedEvent {
  type: "CARD_SELECTED";
  cardDetail: CardPaymentMethod;
}

interface FormSubmittedEvent {
  type: "FORM_SUBMITTED";
  amount: number;
}

interface ChargeCardApprovedEvent {
  type: "CHARGE_CARD_APPROVED";
}

interface ChargeCardSuccessEvent {
  type: "CHARGE_CARD_SUCCESS";
}

interface ChargeCardFailedEvent {
  type: "CHARGE_CARD_FAILED";
  data: ErrorType;
}

interface ProceedEvent {
  type: "PROCEED";
}

interface BankChargedEvent {
  type: "BANK_CHARGED_SUCCESS";
  data: any;
}

interface BankChargeFailedEvent {
  type: "BANK_CHARGE_FAILED";
  data: any;
}

interface InitializeEvent {
  type: "ACTOR_INITIALIZED";
  actor: Interpreter<any, any, any>;
}

type FundAccountEvent =
  | FundAccountResetEvent
  | BackEvent
  | PaymentMethodSelectedEvent
  | CardSelectedEvent
  | FormSubmittedEvent
  | ChargeCardApprovedEvent
  | ChargeCardSuccessEvent
  | ChargeCardFailedEvent
  | ProceedEvent
  | BankChargedEvent
  | BankChargeFailedEvent
  | InitializeEvent
  | { type: "CLEAR_MESSAGE" }
  | { type: "CHANGE_FUNDING_METHOD" };

const fundAccountMachine = Machine<FundAccountContext, FundAccountEvent>(
  {
    id: "fundAccount",
    initial: "selectingPaymentMethod",
    context: {} as FundAccountContext,
    on: {
      RESET: "selectingPaymentMethod",
    },
    states: {
      selectingPaymentMethod: {
        on: {
          PAYMENT_METHOD_SELECTED: {
            target: "form",
            actions: ["setSelectedPaymentMethod"],
          },
        },
      },
      form: {
        on: {
          BACK: "selectingPaymentMethod",
          FORM_SUBMITTED: [
            {
              actions: ["setAmount"],
              target: "processCardPayment",
              cond: "isCard",
            },
            {
              actions: ["setAmount"],
              target: "processDirectDebit",
              cond: "isDirectBilling",
            },
            {
              target: "showNubanDetail",
            },
          ],
        },
      },
      processCardPayment: {
        id: "processCard",
        initial: "cardListing",
        states: {
          cardListing: {
            on: {
              CARD_SELECTED: {
                actions: [
                  assign({
                    selectedCard: (_context, event) => {
                      return event.cardDetail;
                    },
                  }),
                ],
              },
              PROCEED: {
                target: "transactionReview",
              },
            },
          },
          transactionReview: {
            on: {
              CHARGE_CARD_APPROVED: {
                target: "chargingCard",
              },
              BACK: "cardListing",
            },
          },
          chargingCard: {
            on: {
              CHARGE_CARD_SUCCESS: "success",
              CHARGE_CARD_FAILED: {},
            },
          },
          success: {
            after: {
              "3000": "completed",
            },
          },
          completed: {},
        },
      },
      processDirectDebit: {
        id: "processDirectDebit",
        on: {
          BACK: "selectingPaymentMethod",
          ACTOR_INITIALIZED: {
            actions: "setActor",
          },
          BANK_CHARGED_SUCCESS: "success",
          BANK_CHARGE_FAILED: "selectingPaymentMethod",
        },
      },
      showNubanDetail: {},
      success: {
        after: {
          "3000": "completed",
        },
      },
      completed: {},
    },
  },
  {
    guards: {
      isCard: (context, _event) => {
        return context.selectedPaymentMethod === "card";
      },
      isDirectBilling: (context, _event) => {
        return context.selectedPaymentMethod === "bank";
      },
    },
    actions: {
      setActor: assign({
        actorRef: (_context, event) =>
          spawn((event as InitializeEvent).actor, {
            sync: true,
          }) as Interpreter<any, any, any>,
      }),
      setAmount: assign({
        amount: (_context, event) => {
          return (event as FormSubmittedEvent).amount;
        },
      }),
      setSelectedPaymentMethod: assign({
        selectedPaymentMethod: (_context, event) => {
          return (event as PaymentMethodSelectedEvent).paymentMethod;
        },
      }),
      back: send(
        (_context, _event) => {
          return {
            type: "BACK",
          };
        },
        { to: (context) => context.actorRef }
      ),
      updateError: send(
        (_context, event) => {
          return {
            ...event,
          };
        },
        { to: (context) => context.actorRef }
      ),
    },
    services: {},
  }
);

export const fundAccountService = interpret(fundAccountMachine).start();
