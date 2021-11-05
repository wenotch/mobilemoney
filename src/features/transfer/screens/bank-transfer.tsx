import { useNavigation } from "@react-navigation/native";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Text,
  Toggle,
} from "@ui-kitten/components";
import { useMachine } from "@xstate/react";
import { useFormik } from "formik";
import { isUndefined } from "lodash";
import React, { useEffect } from "react";
import { View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useQuery } from "react-query";
import * as Yup from "yup";
import { Bank, bankApi } from "../../../api/bankApi";
import { InitiateTransferRequest, transferApi } from "../../../api/transferApi";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Label } from "../../../components/label";
import { Loader } from "../../../components/loader";
import { Success } from "../../../components/success";
import { formatToMoney } from "../../../lib/utils";
import { AppRoutes } from "../../../navigator/app.route";
import { globalStyles } from "../../../styles";
import { ConfirmBankTransfer } from "../components/confirm-bank-transfer";
import {
  BankTransferContext,
  BankTransferEvent,
  BankTransferForm,
  bankTransferService,
} from "../machine/bankTransferService";

const validationSchema = Yup.object().shape<Partial<BankTransferForm>>({
  bankCode: Yup.string().required().label("Bank Code"),
  accountNumber: Yup.string().required().length(10).label("Account Number"),
  remark: Yup.string().max(150).label("Reason"),
  amount: Yup.string().required().label("Amount"),
  PIN: Yup.string().required().length(4).label("PIN"),
  saveBeneficiary: Yup.boolean(),
});

export const BankTransfer: React.FC = () => {
  const { goBack, navigate } = useNavigation();

  const getBanksQuery = useQuery(
    "banks",
    async () => {
      return await bankApi.getBanks();
    },
    { enabled: false }
  );

  const {
    errors,
    touched,
    values,
    setFieldValue,
    handleSubmit,
  } = useFormik<BankTransferForm>({
    validationSchema,
    onSubmit(data: BankTransferForm) {
      send({
        type: "PROCEED",
        data: {
          PIN: data.PIN,
          amount: parseFloat(data.amount as string) as number,
          recipient: data.recipient,
          remark: data.remark!,
        },
      });
    },
    initialValues: {
      PIN: "",
      accountNumber: "",
      amount: "",
      bankCode: "",
      currency: "NGN",
      name: "",
      recipient: "",
      saveBeneficiary: false,
      type: "",
      remark: "",
    } as BankTransferForm,
  });

  useEffect(() => {
    service.onTransition((state) => {
      if (state.matches("error")) {
        showMessage({
          type: "danger",
          message: state.context.error,
        });
      }

      if (state.matches("completed")) {
        navigate(AppRoutes.HOME);
      }
    });
  }, []);

  const [currentState, send, service] = useMachine<
    BankTransferContext,
    BankTransferEvent
  >(bankTransferService, {
    services: {
      loadBanks(_context, _event) {
        return getBanksQuery.refetch();
      },
      async verifyAccountNumber(_context, _event) {
        return await transferApi.verifyBankAccount(
          values.bankCode,
          values.accountNumber
        );
      },
      async createRecipient(context, _event) {
        const { accountNumber, name, bankCode, currency } = context.form;

        return await transferApi.createRecipient({
          account_number: accountNumber,
          name,
          bank_code: values.bankCode,
          currency: "NGN",
          saveBeneficiary: false,
        });
      },
      async initiateTransfer(context, _event) {
        const data: InitiateTransferRequest = {
          PIN: context.form.PIN,
          amount: context.form.amount as number,
          recipient: context.form.recipient,
          remark: context.form.remark || "",
        };
        return transferApi.initiateBankTransfer(data);
      },
    },
  });

  const renderOption = (item: Bank) => {
    return <AutocompleteItem key={item.id} title={item.name} />;
  };

  const onAmountChanged = (value: string) => {
    const amount = formatToMoney(value);

    setFieldValue("amount", value);
  };

  const filterBanks = (value: string) => {
    send({ type: "FIND_BANK", query: value });
  };

  const onBankSelected = (index: number) => {
    let bank;
    const { filteredBanks, banks } = currentState.context;

    if (!isUndefined(filteredBanks) && filteredBanks.length) {
      bank = filteredBanks[index];
    } else {
      bank = banks[index];
    }

    send("BANK_SELECTED", { data: bank });

    setFieldValue("bankCode", bank!.code);
  };

  if (currentState.matches("success")) {
    return <Success />;
  }

  return (
    <Body>
      <AppTopNavigation title="Transfer" childScreen={false} />
      <KeyboardAwareScrollView>
        <Container>
          <Autocomplete
            placeholder="Enter destination bank"
            value={currentState.context.selectedBankName}
            onSelect={onBankSelected}
            onChangeText={filterBanks}
            label={() => <Label title="Destination Bank" />}
            size="large"
            placement="bottom end"
            caption={touched.bankCode && errors.bankCode ? errors.bankCode : ""}
            status={touched.bankCode && errors.bankCode ? "danger" : ""}
            editable={currentState.matches("preAccountVerification")}
          >
            {isUndefined(currentState.context.filteredBanks) ||
            currentState.context.filteredBanks.length === 0
              ? currentState.context.banks.map(renderOption)
              : currentState.context.filteredBanks.map(renderOption)}
          </Autocomplete>

          <Input
            label={() => (
              <View style={globalStyles.row}>
                <View style={[globalStyles.col, { paddingBottom: 0 }]}>
                  <Label title="Account Number" />
                </View>
                <View style={globalStyles.col}>
                  <Text
                    status="danger"
                    style={{
                      fontSize: 15,
                      paddingTop: 15,
                      textAlign: "right",
                    }}
                  >
                    Select beneficiary
                  </Text>
                </View>
              </View>
            )}
            size="large"
            onChangeText={(value) => setFieldValue("accountNumber", value)}
            editable={currentState.matches("preAccountVerification")}
            onBlur={() => {
              send({
                type: "VERIFY_ACCOUNT_NUMBER_INITIATED",
              });
            }}
            keyboardType="numeric"
          />

          <Input
            size="large"
            label={() => <Label title="Account Name" />}
            value={currentState.context.form.name}
            disabled
          />

          <Input
            caption={errors.amount && touched.amount ? errors.amount : ""}
            status={errors.amount && touched.amount ? "danger" : ""}
            size="large"
            label={() => <Label title="Amount" />}
            keyboardType="numeric"
            onChangeText={(value) => onAmountChanged(value)}
            // value={values.amount as string}
          />

          <Input
            caption={errors.remark && touched.remark ? errors.remark : ""}
            status={errors.remark && touched.remark ? "danger" : ""}
            size="large"
            label={() => <Label title="Reason" />}
            value={values.remark}
            onChangeText={(value) => {
              setFieldValue("remark", value);
            }}
            multiline
            numberOfLines={2}
          />

          <Input
            caption={errors.PIN && touched.PIN ? errors.PIN : ""}
            status={errors.PIN && touched.PIN ? "danger" : ""}
            size="large"
            label={() => <Label title="PIN" />}
            value={values.PIN}
            onChangeText={(value) => {
              setFieldValue("PIN", value);
            }}
            keyboardType="decimal-pad"
            secureTextEntry
          />

          <Toggle
            style={{ margin: 10, alignSelf: "flex-start" }}
            checked={values.saveBeneficiary}
            onChange={(value) => {
              setFieldValue("saveBeneficiary", value);
            }}
          >
            {() => (
              <Text style={{ fontSize: 15, paddingLeft: 5 }}>
                Save beneficiary?
              </Text>
            )}
          </Toggle>

          <Button onPress={() => handleSubmit()} style={{ marginTop: 15 }}>
            Proceed
          </Button>
        </Container>
      </KeyboardAwareScrollView>

      {currentState.matches({ transferForm: "confirmation" }) && (
        <ConfirmBankTransfer service={service} />
      )}

      <Loader
        visible={
          currentState.matches("loadingBanks") ||
          currentState.matches({ transferForm: "verifyingAccountNumber" }) ||
          currentState.matches({ transferForm: "creatingRecipient" }) ||
          currentState.matches("initiatingTransaction")
        }
      />

      {/* <Loader visible={currentState.matches("loadingBanks")} /> */}
    </Body>
  );
};
