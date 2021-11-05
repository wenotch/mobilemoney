import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Input,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { useMachine } from "@xstate/react";
import { useFormik } from "formik";
import { isNull } from "lodash";
import { SetPinRequest } from "paygo";
import React, { useContext } from "react";
import { View } from "react-native";
import { showMessage } from "react-native-flash-message";
import * as Yup from "yup";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { BackIcon } from "../../../components/icons";
import { Loader } from "../../../components/loader";
import { Colors } from "../../../constants";
import {
  Session,
  SessionContext,
} from "../../../lib/session/context/session-context";
import { AppRoutes } from "../../../navigator/app.route";
import { setPINMachine } from "../fsm/set-pin-machine";

const validationSchema = Yup.object().shape<SetPinRequest>({
  pin: Yup.string()
    .required()
    .length(4)
    .test("digitOnly", "PIN must contain only digits", (value) =>
      /^\d{4}$/.test(value!)
    )
    .label("PIN"),
});

export const SetPin = () => {
  const { navigate, goBack } = useNavigation();
  const { currentUser } = useContext(SessionContext) as Session;
  const [currentState, send] = useMachine(setPINMachine);

  const { touched, errors, handleSubmit, values, setFieldValue } = useFormik({
    initialValues: {} as SetPinRequest,
    onSubmit: async (values) => {
      send({
        type: "set_pin",
        pin: values.pin,
      });
    },
    validationSchema,
  });

  if (currentState.matches("completed")) {
    navigate(AppRoutes.HOME);
  }

  if (currentState.matches("error")) {
    showMessage({
      message: currentState.context.errorMessage!,
      type: "danger",
    });
  }

  if (currentState.matches("success")) {
    showMessage({
      message: "You have successfully create a new pin",
      type: "success",
    });
  }

  const leftTopNavigationAction = (
    <TopNavigationAction icon={BackIcon} onPress={goBack} />
  );

  return (
    <Body>
      <TopNavigation
        title={isNull(currentUser?.pin) ? "SET NEW PIN" : "CHANGE PIN"}
        alignment="center"
        style={{ backgroundColor: Colors.grey }}
        accessoryLeft={() => leftTopNavigationAction}
      />
      <Container>
        <Text style={{ textAlign: "center", marginTop: 100 }}>
          Choose a 4-digit PayGO PIN
        </Text>
        <View>
          <Input
            style={{ marginTop: 50, marginBottom: 10 }}
            caption={touched.pin && errors.pin ? errors.pin : ""}
            status={touched.pin && errors.pin ? "danger" : ""}
            onChangeText={(value) => setFieldValue("pin", value)}
            value={values.pin}
            keyboardType="number-pad"
          />
          <Button status="success" onPress={() => handleSubmit()}>
            SET PIN
          </Button>
        </View>
      </Container>

      <Loader visible={currentState.matches("settingPin")} />
    </Body>
  );
};
