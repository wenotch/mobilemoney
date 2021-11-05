import { isNull } from "lodash";
import { CurrentUser, Wallet } from "paygo";
import { assign, createMachine } from "xstate";

interface PostRegistrationContext {
  currentUser?: CurrentUser;
  message?: string;
  hasError?: string;
  wallet: Wallet;
}

type PostRegistrationEvent =
  | {
      type: "init";
      currentUser: CurrentUser;
    }
  | {
      type: "bvn.submitted";
      bvn: string;
      userId: number;
    }
  | {
      type: "done.invoke.initiateBVNVerification";
    };

export const postRegistrationMachine = createMachine<
  PostRegistrationContext,
  PostRegistrationEvent
>(
  {
    id: "postRegistration",
    initial: "initial",
    context: {} as PostRegistrationContext,
    states: {
      initial: {
        on: {
          init: [
            {
              actions: ["getWallet", "setCurrentUser"],
              target: "verifyBVN",
              cond: "bvnVerificationPending",
            },
            {
              actions: ["getWallet", "setCurrentUser"],
              target: "completed",
            },
          ],
        },
      },
      verifyBVN: {
        id: "verifyBVN",
        initial: "idle",
        states: {
          idle: {
            on: {
              "bvn.submitted": "initiateBVNVerification",
            },
          },
          initiateBVNVerification: {
            id: "initiateBVNVerification",
            invoke: {
              src: "initiateBVNVerification",
              onDone: "#postRegistration.completed",
              onError: {
                actions: ["bvnVerificationFailed"],
                target: "idle",
              },
            },
          },
          pendingVerification: {
            invoke: {
              src: "verificationStatus",
              onDone: "#postRegistration.completed",
            },
          },
        },
      },
      completed: {
        type: "final",
      },
    },
  },
  {
    guards: {
      bvnVerificationPending: (_context, event) => {
        if (event.type === "init") {
          return isNull(event.currentUser.fundingAccount);
        }

        return false;
      },
    },
    actions: {
      getWallet: assign({
        wallet: (_context, event) => {
          if (event.type === "init") {
            return event.currentUser.paymentMethods[0] as Wallet;
          }

          return {} as Wallet;
        },
      }),
      setCurrentUser: assign({
        currentUser: (_context, event) => {
          if (event.type === "init") {
            return event.currentUser;
          }

          return {} as CurrentUser;
        },
      }),
    },
    services: {},
  }
);
