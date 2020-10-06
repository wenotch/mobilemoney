import { Button, IndexPath, SelectItem } from "@ui-kitten/components";
import { useFormik } from "formik";
import { isArray } from "lodash";
import { UserRegistration } from "paygo";
import React, { useState } from "react";
import { View } from "react-native";
import * as Yup from "yup";
import { Input } from "../../../components/input";
import { Select } from "../../../components/select";
import { WizardEvent, WizardState } from "../../../lib/form-wizard/types";
import { globalStyles } from "../../../styles";
import { UserFormLabels } from "../config/form-labels";
import { GenderOptions } from "../types";

interface Props {
  send: (event: WizardEvent) => void;
  current: WizardState<UserRegistration>;
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
  middleName: Yup.string().min(2).max(30).label(UserFormLabels.middleName),
  gender: Yup.string()
    .oneOf(["Male", "Female"])
    .required()
    .label(UserFormLabels.gender),
});

export const UserProfile: React.FC<Props> = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const { send, current } = props;

  const gender = Object.values(GenderOptions);
  const displayValue =
    current.context.data!.gender ?? gender[selectedIndex.row];

  const initialValues: Partial<UserRegistration> = { ...current.context.data };

  const { handleSubmit, errors, touched, values, setFieldValue } = useFormik({
    initialValues: (initialValues as unknown) as UserRegistration,
    validationSchema,
    onSubmit(values: UserRegistration) {
      send({ type: "NEXT", data: values });
    },
  });

  const renderOptions = (g: string, i: number) => (
    <SelectItem title={g} key={i} />
  );

  const onSelect = (index: IndexPath | IndexPath[]) => {
    if (!isArray(index)) {
      setSelectedIndex(index);
      setFieldValue("gender", gender[index.row]);
    }
  };

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <Input
            label={UserFormLabels.firstName}
            style={{ ...globalStyles.input }}
            placeholder="Enter your first name"
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
            placeholder="Enter your last name"
            onChangeText={(value) => setFieldValue("lastName", value)}
            caption={errors.lastName && touched.lastName ? errors.lastName : ""}
            status={errors.lastName && touched.lastName ? "danger" : ""}
            value={values.lastName}
          />
        </View>
      </View>
      <Input
        label={UserFormLabels.middleName}
        style={{ ...globalStyles.input }}
        placeholder="Enter other names"
        onChangeText={(value) => setFieldValue("middleName", value)}
        caption={
          errors.middleName && touched.middleName ? errors.middleName : ""
        }
        status={errors.middleName && touched.middleName ? "danger" : ""}
        value={values.middleName}
      />

      <Select
        label={UserFormLabels.gender}
        selectedIndex={selectedIndex}
        onSelect={(index) => onSelect(index)}
        value={displayValue}
        status={errors.gender && touched.gender ? "danger" : ""}
        caption={errors.gender && touched.gender ? errors.gender : ""}
      >
        {gender.map((g: string, i: number) => renderOptions(g, i))}
      </Select>

      <Button onPress={() => handleSubmit()} style={{ marginTop: 10 }}>
        Next
      </Button>
    </View>
  );
};
