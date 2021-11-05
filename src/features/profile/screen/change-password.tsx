import { useNavigation } from "@react-navigation/native";
import { Button, Input } from "@ui-kitten/components";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { ChangePasswordRequest } from "paygo";
import React from "react";
import { View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { QueryStatus, useMutation } from "react-query";
import * as Yup from "yup";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Label } from "../../../components/label";
import { flashMessageDuration } from "../../../constants";
import { globalStyles } from "../../../styles";
import { userService } from "../services/user-service";

const validationSchema = Yup.object().shape<ChangePasswordRequest>({
  oldPassword: Yup.string().required().min(4).max(15).label("Old password"),
  newPassword: Yup.string().required().min(4).max(15).label("New password"),
  confirmPassword: Yup.string()
    .required()
    .oneOf(
      [Yup.ref("newPassword")],
      "Confirm password doesn't match new password"
    ),
});

export const ChangePassword: React.FC = ({}) => {
  const { goBack } = useNavigation();

  const {
    errors,
    values,
    handleSubmit,
    touched,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {} as ChangePasswordRequest,
    onSubmit(values) {
      mutate(values);
    },
    validationSchema,
  });

  const [mutate, { error, status, reset }] = useMutation(
    userService.changePassword
  );

  if (status === QueryStatus.Success) {
    showMessage({
      message: "Password change was successful",
      autoHide: true,
      type: "danger",
      duration: flashMessageDuration,
    });
    resetForm();
    reset();
  }

  if (status === QueryStatus.Error) {
    showMessage({
      message: (error as AxiosError).message,
      autoHide: true,
      type: "danger",
      duration: flashMessageDuration,
    });

    reset();
  }

  return (
    <Body>
      <AppTopNavigation childScreen title="CHANGE PASSWORD" />
      <Container>
        <View>
          <Input
            label={() => <Label title="Old Password" />}
            value={values.oldPassword}
            caption={
              errors.oldPassword && touched.oldPassword
                ? errors.oldPassword
                : ""
            }
            status={errors.oldPassword && touched.oldPassword ? "danger" : ""}
            onChangeText={(value) => setFieldValue("oldPassword", value)}
            style={globalStyles.input}
          />
          <Input
            label={() => <Label title="New Password" />}
            value={values.newPassword}
            caption={
              errors.newPassword && touched.newPassword
                ? errors.newPassword
                : ""
            }
            status={errors.newPassword && touched.newPassword ? "danger" : ""}
            onChangeText={(value) => setFieldValue("newPassword", value)}
            style={globalStyles.input}
          />

          <Input
            label={() => <Label title="Confirm New Password" />}
            value={values.confirmPassword}
            caption={
              errors.confirmPassword && touched.confirmPassword
                ? errors.confirmPassword
                : ""
            }
            status={
              errors.confirmPassword && touched.confirmPassword ? "danger" : ""
            }
            onChangeText={(value) => setFieldValue("oldPassword", value)}
            style={globalStyles.input}
          />

          <Button onPress={() => handleSubmit()}>Change Password</Button>
        </View>
      </Container>
    </Body>
  );
};
