import {
  Bill,
  ErrorType,
  PayBillRequest,
  ValidateBillingCustomerResponse,
} from "paygo";
import { assign, interpret, Machine } from "xstate";

interface BillPaymentContext {
  billPaymentRequest: PayBillRequest;
  error: string;
  category: string;
  bills: Bill[];
  selectedBill: Bill;
  name: string | null;
  filteredBills: Bill[];
  displayBills: Bill[];
}

type BillPaymentEvent =
  | { type: "BACK" }
  | { type: "PROCEED" }
  | { type: "CATEGORY_SELECTED"; category: string }
  | { type: "LOAD_BILL_FAILED"; data: ErrorType }
  | { type: "LOAD_BILLS_SUCCESS"; data: Bill[] }
  | { type: "BILL_SELECTED"; bill: Bill }
  | {
      type: "VALIDATE_CUSTOMER_ACTIVATED";
      req: {
        itemCode: string;
        billCode: string;
        customer: string;
      };
    }
  | { type: "VALIDATE_CUSTOMER_FAILED"; data: ErrorType }
  | { type: "VALIDATE_CUSTOMER_SUCCESS"; data: ValidateBillingCustomerResponse }
  | {
      type: "FORM_SUBMITTED";
      data: Pick<BillPaymentContext, "billPaymentRequest">;
    }
  | { type: "CREATE_BILL_PAYMENT_FAILED"; data: ErrorType }
  | { type: "CREATE_BILL_PAYMENT_SUCCESS" }
  | { type: "RESET" }
  | { type: "FILTER_BILLS"; value: string }
  | { type: "CLEAR_SEARCH" };

const billPaymentMachine = Machine<BillPaymentContext, BillPaymentEvent>(
  {
    id: "billPayment",
    context: {
      billPaymentRequest: {
        recurring: false,
        billDetails: {
          country: "NG",
        },
      },
    } as BillPaymentContext,
    initial: "categorySelection",
    on: {
      RESET: "categorySelection",
    },
    states: {
      categorySelection: {
        on: {
          CATEGORY_SELECTED: {
            target: "billListing",
            actions: assign({
              category: (_, event) => event.category,
            }),
          },
        },
      },
      billListing: {
        id: "billListing",
        initial: "loadingBills",
        on: {
          BACK: "categorySelection",
        },
        states: {
          loadingBills: {
            on: {
              LOAD_BILL_FAILED: {
                target: "#billPayment.error",
                actions: assign({
                  error: (_context, event) => event.data.message,
                }),
              },
              LOAD_BILLS_SUCCESS: {
                target: "listBills",
                actions: [
                  assign({
                    bills: (_, event) => {
                      const compare = (a: Bill, b: Bill) => {
                        if (a.name < b.name) {
                          return -1;
                        }
                        if (a.name > b.name) {
                          return 1;
                        }
                        return 0;
                      };

                      return event.data.sort(compare);
                    },
                  }),
                  assign({
                    filteredBills: (context, event) => {
                      switch (context.category) {
                        case "cable tv":
                          return context.bills.filter(
                            (bill) => bill.item_code.search(/CB/) >= 0
                          );

                        case "airtime":
                          return context.bills.filter(
                            (bill) => bill.item_code.search(/AT/) >= 0
                          );

                        case "mobile data":
                          const bills = context.bills.filter(
                            (bill) => bill.item_code.search(/MD/) >= 0
                          );
                          return bills;

                        case "utility":
                          return context.bills.filter(
                            (bill) => bill.item_code.search(/UB/) >= 0
                          );

                        default:
                          return [] as Bill[];
                      }
                    },
                  }),
                  assign({
                    displayBills: (context, _event) => [
                      ...context.filteredBills,
                    ],
                  }),
                ],
              },
            },
          },
          listBills: {
            on: {
              BILL_SELECTED: {
                actions: assign({
                  selectedBill: (_, event) => event.bill,
                }),
              },
              FILTER_BILLS: {
                actions: assign({
                  displayBills: (context, event) => {
                    return context.bills.filter(
                      (bill) =>
                        bill.name
                          .toLowerCase()
                          .search(event.value.toLowerCase()) >= 0
                    );
                  },
                }),
              },
              CLEAR_SEARCH: {
                actions: assign({
                  displayBills: (context, _event) => {
                    return [...context.filteredBills];
                  },
                }),
              },
              PROCEED: {
                target: "#billPayment.processBillPayment",
              },
            },
          },
        },
      },
      processBillPayment: {
        id: "processBillPayment",
        initial: "form",
        on: {
          BACK: "billListing",
        },
        states: {
          form: {
            on: {
              VALIDATE_CUSTOMER_ACTIVATED: {
                target: "validatingCustomer",
              },
              CREATE_BILL_PAYMENT_FAILED: {
                target: "error",
                actions: assign({
                  error: (context, event) => event.data.message,
                }),
              },
              CREATE_BILL_PAYMENT_SUCCESS: "success",
            },
          },
          validatingCustomer: {
            on: {
              VALIDATE_CUSTOMER_FAILED: {
                target: "error",
                actions: assign({
                  error: (_context, event) => event.data.message,
                  name: (context, _event) => "",
                }),
              },
              VALIDATE_CUSTOMER_SUCCESS: {
                actions: assign({
                  name: (_context, event) => {
                    return event.data.name;
                  },
                }),
                target: "form",
              },
            },
          },
          error: {
            after: {
              "3000": "form",
            },
          },
          success: {
            after: {
              "3000": "#billPayment.categorySelection",
            },
          },
        },
      },
      error: {
        after: {
          "3000": "categorySelection",
        },
      },
    },
  },
  {
    actions: {
      setSelectedCategory: assign({
        category: (context, event) => {
          return event.type === "CATEGORY_SELECTED"
            ? event.category
            : context.category;
        },
      }),
    },
  }
);

export const billPaymentService = interpret(billPaymentMachine).start();
