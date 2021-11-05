import { Button } from "@ui-kitten/components";
import { useFormik } from "formik";
import { AddCardType } from "paygo";
import React from "react";
import * as Yup from "yup";
import { Input } from "../../../components/input";
import { globalStyles } from "../../../styles";

const validationSchema = Yup.object().shape<Partial<AddCardType>>({
  number: Yup.string().required().min(16).max(18).label("Card Number"),
  cvv: Yup.string().required().length(3).label("CVV"),
  expiry_date: Yup.string().required().length(5).label("Expiry Date"),
  pin: Yup.string().required().length(4).label("PIN"),
});

interface Props {
  submit: (cardDetail: Partial<AddCardType>) => void;
}

export const AddCardForm: React.FC<Props> = ({ submit }) => {
  const { errors, values, touched, handleSubmit, setFieldValue } = useFormik({
    validationSchema,
    initialValues: {} as Partial<AddCardType>,
    onSubmit(values: Partial<AddCardType>) {
      const expiryDateArr = values.expiry_date?.split("/");

      if (expiryDateArr) {
        setFieldValue("expiry_month", expiryDateArr[0]);
        setFieldValue("expiry_year", expiryDateArr[1]);
      }
    },
  });

  const setExpiryDate = (value: string) => {
    if (value.length === 2) {
      setFieldValue("expiry_date", value.concat("/"));
    }
  };

  return (
    <>
      <Input
        label="Card Number"
        caption={errors.number && touched.number ? errors.number : ""}
        status={errors.number && touched.number ? "danger" : ""}
        placeholder="Enter your card number"
        keyboardType="numbers-and-punctuation"
        style={{ ...globalStyles.input }}
        value={values.number}
        onChangeText={(value) => setFieldValue("number", value)}
      />
      <Input
        label="CVV"
        caption={errors.cvv && touched.cvv ? errors.cvv : ""}
        status={errors.cvv && touched.cvv ? "danger" : ""}
        placeholder="Enter your card CVV"
        keyboardType="numbers-and-punctuation"
        style={{ ...globalStyles.input }}
        value={values.cvv}
        onChangeText={(value) => setFieldValue("cvv", value)}
      />
      <Input
        label="Expiry Date"
        caption={
          errors.expiry_date && touched.expiry_date ? errors.expiry_date : ""
        }
        status={errors.expiry_date && touched.expiry_date ? "danger" : ""}
        placeholder="Enter your card number"
        keyboardType="numbers-and-punctuation"
        style={{ ...globalStyles.input }}
        value={values.expiry_date}
        onChangeText={(value) => setExpiryDate(value)}
      />
      <Input
        label="PIN"
        caption={errors.pin && touched.pin ? errors.pin : ""}
        status={errors.pin && touched.pin ? "danger" : ""}
        keyboardType="number-pad"
        style={{ ...globalStyles.input }}
        value={values.pin}
        onChangeText={(value) => setFieldValue("pin", value)}
      />

      <Button onPress={() => handleSubmit()}>Add Card</Button>
    </>
  );
};
