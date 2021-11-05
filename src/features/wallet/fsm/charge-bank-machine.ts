import { Machine } from "xstate";

interface ChargeBankContext {}

interface ProceedEvent {
  type: "PROCEED";
}

interface BankChargeSuccessEvent {
  type: "BANK_CHARGE_SUCCESS";
}

interface BankChargeFailedEvent {
  type: "BANK_CHARGE_FAILED";
}

type ChargeBankEvent =
  | ProceedEvent
  | BankChargeSuccessEvent
  | BankChargeFailedEvent;

export const chargeBankMachine = Machine<ChargeBankContext, ChargeBankEvent>({
  id: "chargeBank",
  initial: "chargeBankForm",
  states: {
    chargeBankForm: {
      on: {
        BANK_CHARGE_SUCCESS: {
          target: "complete",
        },
        BANK_CHARGE_FAILED: {
          target: "complete",
        },
      },
    },
    complete: {
      after: {
        "3000": "chargeBankForm",
      },
    },
    cancelled: {},
  },
});
