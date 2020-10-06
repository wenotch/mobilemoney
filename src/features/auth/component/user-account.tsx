import { Button, Icon, IconProps } from "@ui-kitten/components";
import { useFormik } from "formik";
import { UserRegistration } from "paygo";
import React from "react";
import { View } from "react-native";
import * as Yup from "yup";
import { Input } from "../../../components/input";
import { WizardEvent, WizardState } from "../../../lib/form-wizard/types";
import { globalStyles } from "../../../styles";
import { UserFormLabels } from "../config/form-labels";

interface Props {
  send: (event: WizardEvent, data?: Partial<UserRegistration>) => void;
  current: WizardState<UserRegistration>;
}

const validationSchema = Yup.object().shape<Partial<UserRegistration>>({
  password: Yup.string()
    .min(5)
    .max(50)
    .required()
    .label(UserFormLabels.password),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Confirm password does not match password")
    .label(UserFormLabels.confirmPassword),
});

export const UserAccount: React.FC<Props> = ({ send, current }) => {
  const initialValues: Partial<UserRegistration> = { ...current.context.data };

  const { setFieldValue, handleSubmit, errors, touched } = useFormik<
    Partial<UserRegistration>
  >({
    initialValues,
    validationSchema,
    onSubmit(values: Partial<UserRegistration>) {
      send({ type: "NEXT", data: values });
    },
  });

  const NextButton = () => (
    <Button
      accessoryRight={(props: IconProps) => (
        <Icon name="arrow-forward-outline" {...props} />
      )}
      onPress={() => handleSubmit()}
    >
      Next
    </Button>
  );

  const PrevButton = () => (
    <Button
      accessoryLeft={(props: IconProps) => (
        <Icon name="arrow-back-outline" {...props} />
      )}
      onPress={() => send({ type: "PREV" })}
    >
      Previous
    </Button>
  );

  return (
    <View>
      <Input
        label={UserFormLabels.password}
        style={{ ...globalStyles.input }}
        placeholder="Create password"
        onChangeText={(value) => setFieldValue("password", value)}
        caption={errors.password && touched.password ? errors.password : ""}
        status={errors.password && touched.password ? "danger" : ""}
        secureTextEntry
      />
      <Input
        label={UserFormLabels.confirmPassword}
        style={{ ...globalStyles.input }}
        placeholder="Confirm previously entered password"
        onChangeText={(value) => setFieldValue("confirmPassword", value)}
        caption={
          errors.confirmPassword && touched.confirmPassword
            ? errors.confirmPassword
            : ""
        }
        status={
          errors.confirmPassword && touched.confirmPassword ? "danger" : ""
        }
        secureTextEntry
      />

      <View
        style={[
          globalStyles.row,
          { flexDirection: "row-reverse", marginTop: 10 },
        ]}
      >
        <View style={[globalStyles.col, { marginLeft: 5 }]}>
          <NextButton />
        </View>
        <View style={[globalStyles.col, { marginRight: 5 }]}>
          <PrevButton />
        </View>
      </View>
    </View>
  );
};
