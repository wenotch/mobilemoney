import { Button } from "@ui-kitten/components";
import { useFormik } from "formik";
import { UserRegistration } from "paygo";
import React from "react";
import { View } from "react-native";
import * as Yup from "yup";
import { Input } from "../../../components/input";
import { WizardState } from "../../../lib/form-wizard/types";
import { globalStyles } from "../../../styles";
import { UserFormLabels } from "../config/form-labels";

interface Props {
  next: (data: Partial<UserRegistration>) => void;
  current: WizardState<Partial<UserRegistration>>;
}

const validationSchema = Yup.object().shape<Partial<UserRegistration>>({
  firstName: Yup.string()
    .required()
    .min(2)
    .max(30)
    .label(UserFormLabels.firstName),
  lastName: Yup.string()
    .required()
    .min(2)
    .max(30)
    .label(UserFormLabels.lastName),
  phone: Yup.string().min(6).max(15).label(UserFormLabels.phone),
  email: Yup.string().email().required().label(UserFormLabels.email),
});

export const UserProfile: React.FC<Props> = (props) => {
  const { next, current } = props;

  const initialValues: Partial<UserRegistration> = { ...current.context.data };

  const { handleSubmit, errors, touched, values, setFieldValue } = useFormik({
    initialValues: (initialValues as unknown) as UserRegistration,
    validationSchema,
    onSubmit(values: UserRegistration) {
      next(values);
    },
  });

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <Input
            label={UserFormLabels.firstName}
            style={{ ...globalStyles.input }}
            onChangeText={(value) => setFieldValue("firstName", value)}
            caption={
              errors.firstName && touched.firstName ? errors.firstName : ""
            }
            status={errors.firstName && touched.firstName ? "danger" : ""}
            value={values.firstName}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <Input
            label={UserFormLabels.lastName}
            style={{ ...globalStyles.input }}
            onChangeText={(value) => setFieldValue("lastName", value)}
            caption={errors.lastName && touched.lastName ? errors.lastName : ""}
            status={errors.lastName && touched.lastName ? "danger" : ""}
            value={values.lastName}
          />
        </View>
      </View>

      <Input
        label={UserFormLabels.phone}
        style={{ ...globalStyles.input }}
        onChangeText={(value) => setFieldValue("phone", value)}
        caption={errors.phone && touched.phone ? errors.phone : ""}
        status={errors.phone && touched.phone ? "danger" : ""}
        value={values.phone}
        keyboardType="phone-pad"
      />

      <Input
        label={UserFormLabels.email}
        style={{ ...globalStyles.input }}
        onChangeText={(value) => setFieldValue("email", value)}
        caption={errors.email && touched.email ? errors.email : ""}
        status={errors.email && touched.email ? "danger" : ""}
        value={values.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button onPress={() => handleSubmit()} style={{ marginTop: 10 }}>
        Next
      </Button>
    </View>
  );
};
