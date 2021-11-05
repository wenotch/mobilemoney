import {
  Button,
  Input,
  Modal,
  Text,
  TopNavigation,
} from "@ui-kitten/components";
import { useFormik } from "formik";
import { VerifyBVNRequest } from "paygo";
import React from "react";
import { Dimensions, View } from "react-native";
import { useQuery } from "react-query";
import * as Yup from "yup";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Label } from "../../../components/label";
import { Colors } from "../../../constants";
import { userService } from "../../profile/services/user-service";

interface Props {
  state: any;
  send: any;
}

const validationSchema = Yup.object().shape<Partial<VerifyBVNRequest>>({
  bvn: Yup.string().length(11).required().label("BVN"),
});

export const BVNVerification: React.FC<Props> = ({ state, send }) => {
  const { status: getProfileStatus, data, refetch } = useQuery(
    "profile",
    (key) => {
      return userService.getProfile();
    },
    { enabled: false }
  );

  const { setFieldValue, errors, touched, handleSubmit, values } = useFormik({
    onSubmit: async (values) => {
      values.userId = (state.context as any).currentUser?.id!;
      send({
        type: "bvn.submitted",
        bvn: values.bvn,
        userId: values.userId,
      });
    },
    initialValues: {} as VerifyBVNRequest,
    validationSchema,
  });

  const renderButton = state.matches({ verifyBVN: "idle" }) ? (
    <Button
      onPress={() => handleSubmit()}
      status="success"
      style={{ marginTop: 10 }}
    >
      {() => <Text style={{ fontSize: 15 }}>Initiate BVN Verification</Text>}
    </Button>
  ) : (
    <Button
      onPress={() => handleSubmit()}
      status="success"
      style={{ marginTop: 10 }}
      disabled
    >
      {() => <Text style={{ fontSize: 15 }}>Please wait...</Text>}
    </Button>
  );

  return (
    <Modal
      // visible={state.matches("verifyBVN")}
      backdropStyle={{
        backgroundColor: Colors.white,
        flex: 1,
      }}
    >
      <Body
        style={{
          backgroundColor: Colors.white,
          height: Dimensions.get("screen").height,
        }}
      >
        <TopNavigation
          title="BVN Verification"
          alignment="center"
          style={{ marginTop: 20 }}
        />
        <Container>
          <Text style={{ paddingTop: 50, fontSize: 15, textAlign: "center" }}>
            We need your Bank Verification Number to verify your identity and
            open your funding account.
          </Text>
          <View style={{ paddingTop: 50 }}>
            <Input
              label={() => <Label title="Provide your bvn" />}
              onChangeText={(value) => {
                setFieldValue("bvn", value);
              }}
              caption={touched.bvn && errors.bvn ? errors.bvn : ""}
              status={touched.bvn && errors.bvn ? "danger" : ""}
            />
            <View>{renderButton}</View>
          </View>
        </Container>
      </Body>
    </Modal>
  );
};
