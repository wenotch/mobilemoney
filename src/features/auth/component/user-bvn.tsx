import { Button, Icon, IconProps } from "@ui-kitten/components";
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
  submit: (data: Partial<UserRegistration>) => void;
  previous: () => void;
  current: WizardState<Partial<UserRegistration>>;
}

const validationSchema = Yup.object().shape<Partial<UserRegistration>>({
  bvn: Yup.string().required().length(11).label(UserFormLabels.bvn),
});

export const UserBVN: React.FC<Props> = ({
  submit: send,
  current,
  previous,
}) => {
  const initialValues: Partial<UserRegistration> = { ...current.context.data };

  const { setFieldValue, handleSubmit, errors, touched } = useFormik<
    Partial<UserRegistration>
  >({
    initialValues,
    validationSchema,
    onSubmit(values) {
      send(values);
    },
  });

  const SubmitButton = () => (
    <Button
      onPress={() => handleSubmit()}
      disabled={current.matches("pending")}
    >
      {current.matches("pending") ? "Please wait..." : "Create Account"}
    </Button>
  );

  const PrevButton = () => (
    <Button
      accessoryLeft={(props: IconProps) => (
        <Icon name="arrow-back-outline" {...props} />
      )}
      onPress={() => previous()}
    >
      Previous
    </Button>
  );
  return (
    <View>
      <Input
        label={UserFormLabels.bvn}
        style={{ ...globalStyles.input }}
        placeholder="Provide your BVN"
        onChangeText={(value) => setFieldValue("bvn", value)}
        caption={errors.bvn && touched.bvn ? errors.bvn : ""}
        status={errors.bvn && touched.bvn ? "danger" : ""}
      />
      <View
        style={[
          globalStyles.row,
          { flexDirection: "row-reverse", marginTop: 10 },
        ]}
      >
        <View style={[globalStyles.col, { marginLeft: 5 }]}>
          <SubmitButton />
        </View>
        <View style={[globalStyles.col, { marginRight: 5 }]}>
          <PrevButton />
        </View>
      </View>
    </View>
  );
};
