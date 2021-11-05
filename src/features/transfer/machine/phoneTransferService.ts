import * as Contacts from "expo-contacts";
import { assign, Machine, StateSchema } from "xstate";
import { TransferToMobileRequest } from "../../../api/transferApi";

interface PhoneTransferContext {
  contacts: Contacts.Contact[];
  transferForm: TransferToMobileRequest;
  selectedContacts: Contacts.Contact;
  error: string;
}

interface PhoneTransferStateSchema extends StateSchema {
  states: {
    loadingContacts: {};
    listingContacts: {};
    transferRequestForm: {};
    initiatingTransfer: {};
    success: {};
    error: {};
  };
}

type PhoneTransferEvent =
  | { type: "GET_CONTACTS_REQUESTED" }
  | {
      type: "done.invoke.contactsLoaded";
      data: Contacts.Contact[];
    }
  | {
      type: "error.platform.contactsLoaded";
      data: any;
    }
  | {
      type: "CONTACT_SELECTED";
      contact: Contacts.Contact;
    }
  | { type: "PROCEED"; transactionDetail: TransferToMobileRequest }
  | { type: "SUBMITTED" }
  | { type: "done.invoke.initiateTransfer"; data: any }
  | { type: "error.platform.initiateTransfer"; data: any }
  | { type: "BACK" }
  | { type: "OK" };

export const phoneTransferService = Machine<
  PhoneTransferContext,
  PhoneTransferEvent
>(
  {
    id: "phoneNumberTransfer",
    initial: "transferRequestForm",
    states: {
      transferRequestForm: {
        initial: "form",
        on: {
          BACK: ".form",
        },
        states: {
          form: {
            on: {
              GET_CONTACTS_REQUESTED: "loadingContacts",
              PROCEED: {
                actions: "updateForm",
                target: "confirmation",
              },
              OK: "#phoneNumberTransfer.complete",
            },
          },
          confirmation: {
            on: {
              SUBMITTED: {
                target: "#phoneNumberTransfer.initiatingTransfer",
              },
            },
          },
          loadingContacts: {
            invoke: {
              id: "loadState",
              src: "loadState",
              onError: {
                actions: "updateError",
                target: "#phoneNumberTransfer.error",
              },
              onDone: {
                actions: "updateContacts",
                target: "showContacts",
              },
            },
          },
          showContacts: {
            on: {
              CONTACT_SELECTED: {
                actions: "updateSelectedContact",
                target: "form",
              },
            },
          },
        },
      },
      initiatingTransfer: {
        invoke: {
          id: "initiatingTransfer",
          src: "initiateTransfer",
          onDone: "success",
          onError: {
            actions: "updateError",
            target: "error",
          },
        },
      },
      success: {
        after: {
          "10000": "complete",
        },
        on: {
          OK: "complete",
        },
      },
      complete: {
        after: {
          "3000": "transferRequestForm",
        },
      },
      error: {
        after: {
          "3000": "transferRequestForm",
        },
      },
    },
  },
  {
    actions: {
      updateContacts: assign({
        contacts: (_context, event) => {
          return event.type === "done.invoke.contactsLoaded" ? event.data : [];
        },
      }),
      updateError: assign({
        error: (_context, event) => {
          return event.type === "error.platform.contactsLoaded" ||
            event.type === "error.platform.initiateTransfer"
            ? event.data.message
            : "";
        },
      }),
      updateForm: assign({
        transferForm: (_context, event) => {
          return event.type === "PROCEED"
            ? event.transactionDetail
            : ({} as any);
        },
      }),
    },
  }
);
