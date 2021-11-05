import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Datepicker,
  IndexPath,
  Select,
  SelectItem,
  Text,
} from "@ui-kitten/components";
import { useFormik } from "formik";
import { User } from "paygo";
import React, { useContext, useState } from "react";
import { View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { QueryStatus, useMutation } from "react-query";
import * as Yup from "yup";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Input } from "../../../components/input";
import { Label } from "../../../components/label";
import { Title } from "../../../components/title";
import { Colors, flashMessageDuration } from "../../../constants";
import {
  Session,
  SessionContext,
} from "../../../lib/session/context/session-context";
import { AppRoutes } from "../../../navigator/app.route";
import { globalStyles } from "../../../styles";
import { userService } from "../services/user-service";

export const validationSchema = Yup.object().shape<Partial<User>>({
  email: Yup.string().email().label("Email"),
  address: Yup.string().max(50).label("Address"),
  city: Yup.string().min(2).max(30).label("City"),
  state: Yup.string().min(2).max(30).label("City"),
  middleName: Yup.string().min(2).max(30),
  firstName: Yup.string().min(2).max(15),
  lastName: Yup.string().min(2).max(15),
  nextOfKinName: Yup.string().min(3).max(60).label("Next of Kin Name"),
  nextOfKinAddress: Yup.string()
    .max(50)
    .when("nextOfKinName", {
      is: (value) => value && value.length > 0,
      then: Yup.string().required(),
    }),
  nextOfKinPhone: Yup.string()
    .max(15)
    .when("nextOfKinName", {
      is: (value) => value && value.length > 0,
      then: Yup.string().required(),
    }),
});

export const UpdateProfile: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const { currentUser } = useContext(SessionContext) as Session;
  const { navigate } = useNavigation();

  const now = new Date();
  const maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const minDate = new Date(1930, 0, 1);

  const [mutate, { status, error, reset }] = useMutation(
    userService.updateUserProfile
  );

  const genderList = ["", "Male", "Female"];

  const { errors, values, touched, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      firstName: currentUser?.firstName ?? "",
      lastName: currentUser?.lastName ?? "",
      middleName: currentUser?.middleName ?? "",
      address: currentUser?.address ?? "",
      city: currentUser?.city ?? "",
      state: currentUser?.state ?? "",
      nextOfKinName: currentUser?.nextOfKinName ?? "",
      nextOfKinAddress: currentUser?.nextOfKinAddress ?? "",
      nextOfKinPhone: currentUser?.nextOfKinPhone ?? "",
      gender: currentUser?.gender ?? "",
      dateOfBirth: currentUser?.dateOfBirth ?? Date.now(),
    } as Partial<User>,
    onSubmit(values: Partial<User>) {
      mutate(values);
    },
    validationSchema,
  });

  console.log(errors);

  if (status === QueryStatus.Error) {
    showMessage({
      message: "An error occured. Please try again",
      duration: flashMessageDuration,
      autoHide: true,
      type: "danger",
    });

    reset();
  }

  if (status === QueryStatus.Success) {
    showMessage({
      message: "Profile was updated successfully",
      duration: flashMessageDuration,
      autoHide: true,
      type: "success",
    });

    reset();
    navigate(AppRoutes.HOME);
  }

  return (
    <Body>
      <AppTopNavigation />
      <Container>
        <KeyboardAwareScrollView>
          <View>
            <Title heading="My profile" />
            <View style={{ ...globalStyles.row }}>
              <View style={{ ...globalStyles.col }}>
                <Input
                  label="First Name"
                  color={Colors.black}
                  caption={
                    errors.firstName && touched.firstName
                      ? errors.firstName
                      : ""
                  }
                  status={errors.firstName && touched.firstName ? "danger" : ""}
                  onChangeText={(value) => setFieldValue("firstName", value)}
                  value={values.firstName}
                />
              </View>
              <View style={{ ...globalStyles.col }}>
                <Input
                  label="Last Name"
                  color={Colors.black}
                  caption={
                    errors.lastName && touched.lastName ? errors.lastName : ""
                  }
                  status={errors.lastName && touched.lastName ? "danger" : ""}
                  onChangeText={(value) => setFieldValue("lastName", value)}
                  value={values.lastName}
                />
              </View>
            </View>
            <Input
              label="Other Names"
              color={Colors.black}
              caption={
                errors.middleName && touched.middleName ? errors.middleName : ""
              }
              status={errors.middleName && touched.middleName ? "danger" : ""}
              onChangeText={(value) => setFieldValue("middleName", value)}
              value={values.middleName ?? ""}
            />
            <Datepicker
              label={() => <Text>Date of Birth</Text>}
              max={maxDate}
              min={minDate}
              date={new Date(values.dateOfBirth!)}
              onSelect={(value) => setFieldValue("dateOfBirth", value)}
              caption={
                errors.dateOfBirth && touched.dateOfBirth
                  ? errors.dateOfBirth
                  : ""
              }
              status={errors.dateOfBirth && touched.dateOfBirth ? "danger" : ""}
            />
            <Select
              label={() => <Label title="Gender" />}
              onSelect={(index: any) => setSelectedIndex(index)}
              value={genderList[selectedIndex.row]}
              caption={errors.gender && touched.gender ? errors.gender : ""}
              status={errors.gender && touched.gender ? "danger" : ""}
            >
              {genderList.map((gender, index) => (
                <SelectItem title={gender} key={index} />
              ))}
            </Select>
            <Input
              label="Address"
              multiline
              numberOfLines={2}
              color={Colors.black}
              caption={errors.address && touched.address ? errors.address : ""}
              status={errors.address && touched.address ? "danger" : ""}
              onChangeText={(value) => setFieldValue("address", value)}
              value={values.address ?? ""}
            />
            <Input
              label="City"
              color={Colors.black}
              caption={errors.city && touched.city ? errors.city : ""}
              status={errors.city && touched.city ? "danger" : ""}
              onChangeText={(value) => setFieldValue("city", value)}
              value={values.city ?? ""}
            />
            <Input
              label="State"
              color={Colors.black}
              caption={errors.state && touched.state ? errors.state : ""}
              status={errors.state && touched.state ? "danger" : ""}
              onChangeText={(value) => setFieldValue("state", value)}
              value={values.state ?? ""}
            />

            <Title heading="Next of Kin Information" />
            <Input
              label="Full Name"
              color={Colors.black}
              caption={
                errors.nextOfKinName && touched.nextOfKinName
                  ? errors.nextOfKinName
                  : ""
              }
              status={
                errors.nextOfKinName && touched.nextOfKinName ? "danger" : ""
              }
              onChangeText={(value) => setFieldValue("nextOfKinName", value)}
            />
            <Input
              label="Address"
              color={Colors.black}
              numberOfLines={3}
              multiline
              caption={
                errors.nextOfKinAddress && touched.nextOfKinAddress
                  ? errors.nextOfKinAddress
                  : ""
              }
              status={
                errors.nextOfKinAddress && touched.nextOfKinAddress
                  ? "danger"
                  : ""
              }
              onChangeText={(value) => setFieldValue("firstName", value)}
            />
            <Input
              label="Phone"
              color={Colors.black}
              caption={
                errors.nextOfKinPhone && touched.nextOfKinPhone
                  ? errors.nextOfKinPhone
                  : ""
              }
              status={
                errors.nextOfKinPhone && touched.nextOfKinPhone ? "danger" : ""
              }
              onChangeText={(value) => setFieldValue("nextOfKinPhone", value)}
            />
          </View>
        </KeyboardAwareScrollView>
        <Button
          status="success"
          onPress={() => handleSubmit()}
          style={{ marginBottom: 10 }}
        >
          Update My Profile
        </Button>
      </Container>
    </Body>
  );
};
