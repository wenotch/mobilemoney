import { Button, Icon, IconProps, Input } from "@ui-kitten/components";
import { useFormik } from "formik";
import { UserRegistration } from "paygo";
import React from "react";
import { View } from "react-native";
import * as Yup from "yup";
import { WizardEvent, WizardState } from "../../../lib/form-wizard/types";
import { globalStyles } from "../../../styles";
import { UserFormLabels } from "../config/form-labels";

interface Props {
  send: (event: WizardEvent<Partial<UserRegistration>>) => void;
  current: WizardState<UserRegistration>;
}

const validationSchema = Yup.object().shape<Partial<UserRegistration>>({
  email: Yup.string().required().email().label("Email"),
  phone: Yup.string().required().min(5).max(15).label("Phone number"),
  address: Yup.string().required().label("Address"),
});

export const UserContact: React.FC<Props> = ({ send, current }) => {
  const initialValues: Partial<UserRegistration> = { ...current.context.data };

  const { setFieldValue, handleSubmit, errors, touched } = useFormik<
    Partial<UserRegistration>
  >({
    validationSchema,
    onSubmit(value: Partial<UserRegistration>) {
      send({ type: "NEXT", data: value });
    },
    initialValues,
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
        label={UserFormLabels.email}
        style={{ ...globalStyles.input }}
        placeholder="Enter your email"
        onChangeText={(value) => setFieldValue("email", value)}
        caption={errors.email && touched.email ? errors.email : ""}
        status={errors.email && touched.email ? "danger" : ""}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        label={UserFormLabels.phone}
        style={{ ...globalStyles.input }}
        placeholder="Enter your phone number"
        onChangeText={(value) => setFieldValue("phone", value)}
        caption={errors.phone && touched.phone ? errors.phone : ""}
        status={errors.phone && touched.phone ? "danger" : ""}
        keyboardType="phone-pad"
      />

      <Input
        label={UserFormLabels.address}
        style={{ ...globalStyles.input }}
        placeholder="Enter your address"
        onChangeText={(value) => setFieldValue("address", value)}
        caption={errors.address && touched.address ? errors.address : ""}
        status={errors.address && touched.address ? "danger" : ""}
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
