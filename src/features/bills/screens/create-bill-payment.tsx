import { useNavigation } from "@react-navigation/native";
import { Button, Input } from "@ui-kitten/components";
import { useService } from "@xstate/react";
import { useFormik } from "formik";
import { CreateBillPaymentForm, ErrorType, PayBillRequest } from "paygo";
import React, { useEffect } from "react";
import { BackHandler } from "react-native";
import { showMessage } from "react-native-flash-message";
import { QueryStatus, useMutation, useQuery } from "react-query";
import * as Yup from "yup";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Label } from "../../../components/label";
import { Loader } from "../../../components/loader";
import { Success } from "../../../components/success";
import { AppRoutes } from "../../../navigator/app.route";
import {
  createBillPayment,
  validateBill,
} from "../../../services/bill-service";
import { billPaymentService } from "../machine/billPaymentService";

const validationSchema = Yup.object().shape<Partial<CreateBillPaymentForm>>({
  customer: Yup.string().required().label("This field"),
  amount: Yup.string().required().label("Amount"),
  PIN: Yup.string().required().length(4).label("PIN"),
});

export const CreateBillPayment: React.FC = () => {
  const [currentState, send] = useService(billPaymentService);
  const { navigate } = useNavigation();

  const { setFieldValue, values, handleSubmit, touched, errors } = useFormik<
    Partial<CreateBillPaymentForm>
  >({
    onSubmit(values) {
      const data = {
        recurring: false,
        intervalInDays: 0,
        PIN: values.PIN,
        billDetails: {
          amount: parseFloat(values.amount as string),
          country: values.country,
          customer: values.customer,
          type: currentState.context.selectedBill.biller_name,
        },
      } as PayBillRequest;

      mutate(data);
    },
    initialValues: {
      recurring: currentState.context.billPaymentRequest.recurring,
      country: currentState.context.billPaymentRequest.billDetails.country,
      type: currentState.context.selectedBill.name,
    },
    validationSchema,
  });

  const {
    status: customerValidationStatus,
    data: customerValidationData,
    error: customerValidationError,
  } = useQuery(
    [
      `validate-customer-${values.customer}`,
      {
        itemCode: currentState.context.selectedBill.item_code,
        billerCode: currentState.context.selectedBill.biller_code,
        customer: values.customer,
      },
    ],
    async (key, { itemCode, billerCode, customer }) => {
      return await validateBill(itemCode, billerCode, customer)!;
    },
    {
      enabled: currentState.matches({
        processBillPayment: "validatingCustomer",
      }),
    }
  );

  const [
    mutate,
    { status: createBillPaymentStatus, error: createBillPaymentError },
  ] = useMutation<any, ErrorType, PayBillRequest>((req: PayBillRequest) => {
    return createBillPayment(req);
  });

  useEffect(() => {
    if (customerValidationStatus === QueryStatus.Success) {
      send({
        type: "VALIDATE_CUSTOMER_SUCCESS",
        data: customerValidationData as any,
      });
    }

    if (customerValidationStatus === QueryStatus.Error) {
      send({
        type: "VALIDATE_CUSTOMER_FAILED",
        data: customerValidationError as ErrorType,
      });
    }

    if (createBillPaymentStatus === QueryStatus.Error) {
      send({
        type: "CREATE_BILL_PAYMENT_FAILED",
        data: createBillPaymentError!,
      });
    }

    if (createBillPaymentStatus === QueryStatus.Success) {
      send({
        type: "CREATE_BILL_PAYMENT_SUCCESS",
      });
    }
  }, [customerValidationStatus, createBillPaymentStatus]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        send("BACK");

        return true;
      }
    );

    return subscription.remove;
  }, [send]);

  if (currentState.matches("billListing")) navigate(AppRoutes.BILL_LIST);

  if (
    currentState.matches({ processBillPayment: "error" }) ||
    currentState.matches("error")
  ) {
    showMessage({
      message: currentState.context.error,
      type: "danger",
    });
  }

  if (currentState.matches({ processBillPayment: "success" })) {
    return <Success />;
  }

  return (
    <Body>
      <AppTopNavigation childScreen title="Create Bill Payment" />
      <Container>
        <Input
          label={() => (
            <Label title={currentState.context.selectedBill.label_name} />
          )}
          onChangeText={(value) => setFieldValue("customer", value)}
          value={values.customer}
          onBlur={() => {
            if (!currentState.context.selectedBill.is_airtime) {
              send("VALIDATE_CUSTOMER_ACTIVATED", {
                customer: values.customer,
              });
            }
          }}
          caption={touched.customer && errors.customer ? errors.customer : ""}
          status={touched.customer && errors.customer ? "danger" : ""}
          keyboardType="phone-pad"
        />

        {!currentState.context.selectedBill.is_airtime && (
          <Input
            editable={false}
            label={() => <Label title="Name" />}
            value={currentState.context.name as string}
          />
        )}

        {(!currentState.context.selectedBill.is_airtime ||
          currentState.context.selectedBill.item_code.indexOf("ub") >= 0) && (
          <Input
            label={() => <Label title="Amount" />}
            onChangeText={(value) => {
              setFieldValue("amount", value);
            }}
            caption={touched.amount && errors.amount ? errors.amount : ""}
            status={touched.amount && errors.amount ? "danger" : ""}
            editable={currentState.context.selectedBill.is_airtime}
            value={currentState.context.selectedBill.amount!.toString()}
          />
        )}

        {currentState.context.selectedBill.is_airtime && (
          <Input
            label={() => <Label title="Amount" />}
            onChangeText={(value) => {
              setFieldValue("amount", value);
            }}
            caption={touched.amount && errors.amount ? errors.amount : ""}
            status={touched.amount && errors.amount ? "danger" : ""}
            value={values.amount as string}
            placeholder="0.00"
          />
        )}

        <Input
          label={() => <Label title="PIN" />}
          onChangeText={(value) => {
            setFieldValue("PIN", value);
          }}
          value={values.PIN?.toString()}
          caption={touched.PIN && errors.PIN ? errors.PIN : ""}
          status={touched.PIN && errors.PIN ? "danger" : ""}
          secureTextEntry
        />

        <Button
          onPress={() => {
            !currentState.context.selectedBill.is_airtime &&
              setFieldValue(
                "amount",
                currentState.context.selectedBill.amount!.toString()
              );
            handleSubmit();
          }}
        >
          {currentState.matches("creatingBillPayment")
            ? "Please wait..."
            : "Pay Bill Securely"}
        </Button>
      </Container>

      <Loader
        visible={
          currentState.matches({
            processBillPayment: "validatingCustomer",
          }) || createBillPaymentStatus === QueryStatus.Loading
        }
      />
    </Body>
  );
};
