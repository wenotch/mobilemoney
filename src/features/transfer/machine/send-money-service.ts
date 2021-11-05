import { assign, createMachine } from "xstate";

type BeneficiaryType =
  | "bankBeneficiary"
  | "phoneBeneficiary"
  | "payGoBeneficiary";

interface TransferContext {
  selectedBeneficiaryType: BeneficiaryType | undefined;
}

type TransferEvent =
  | { type: "beneficiaryTypeSelected"; selectedBeneficiaryType: string }
  | { type: "proceed" };

type TransferState =
  | {
      value: "listingBeneficiaryType";
      context: TransferContext & { selectedBeneficiaryType: undefined };
    }
  | {
      value: "bankBeneficiary";
      context: TransferContext & { selectedBeneficiaryType: "bankBeneficiary" };
    }
  | {
      value: "phoneBeneficiary";
      context: TransferContext & {
        selectedBeneficiaryType: "phoneBeneficiary";
      };
    }
  | {
      value: "payGoBeneficiary";
      context: TransferContext & {
        selectedBeneficiaryType: "payGoBeneficiary";
      };
    };

const transferMachine = createMachine<
  TransferContext,
  TransferEvent,
  TransferState
>(
  {
    id: "transfer",
    initial: "listingBeneficiaryType",
    states: {
      listingBeneficiaryType: {
        on: {
          beneficiaryTypeSelected: {
            actions: "updateBeneficiaryTypeSelection",
          },
          proceed: [
            {
              target: "bankBeneficiary",
              cond: "isBankBeneficiary",
            },
            {
              target: "phoneBeneficiary",
              cond: "isPhoneBeneficiary",
            },
            {
              target: "payGoBeneficiary",
            },
          ],
        },
      },
      bankBeneficiary: {},
      phoneBeneficiary: {},
      payGoBeneficiary: {},
    },
  },
  {
    actions: {
      updateBeneficiaryTypeSelection: assign({
        selectedBeneficiaryType: (_context, event) => {
          return event.type === "beneficiaryTypeSelected"
            ? (event.selectedBeneficiaryType as BeneficiaryType)
            : undefined;
        },
      }),
    },
    guards: {
      isBankBeneficiary(context, _event) {
        return context.selectedBeneficiaryType === "bankBeneficiary";
      },
      isPhoneBeneficiary(context, _event) {
        return context.selectedBeneficiaryType === "phoneBeneficiary";
      },
      isPayGoBeneficiary(context, _event) {
        return context.selectedBeneficiaryType === "payGoBeneficiary";
      },
    },
  }
);
