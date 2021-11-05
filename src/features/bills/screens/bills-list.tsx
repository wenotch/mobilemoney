import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Icon,
  IconProps,
  Input,
  List,
  ListItem,
} from "@ui-kitten/components";
import { useService } from "@xstate/react";
import { Bill, ErrorType } from "paygo";
import React, { useEffect } from "react";
import { BackHandler, ListRenderItem, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { QueryStatus, useQuery } from "react-query";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import {
  ChevronArrowForward,
  CloseIcon,
  SearchIcon,
} from "../../../components/icons";
import { Loader } from "../../../components/loader";
import { AppRoutes } from "../../../navigator/app.route";
import { getBills } from "../../../services/bill-service";
import { billPaymentService } from "../machine/billPaymentService";

export const BillList: React.FC = () => {
  const [currentState, send] = useService(billPaymentService);
  const { navigate } = useNavigation();

  const { status, data, error } = useQuery<Bill[], ErrorType>(
    "get-bills",
    () => {
      return getBills();
    }
  );

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        goBack();

        return true;
      }
    );

    return subscription.remove;
  }, [send]);

  useEffect(() => {
    status === QueryStatus.Success &&
      send({
        type: "LOAD_BILLS_SUCCESS",
        data,
      });
  }, [status]);

  const goBack = () => {
    send("BACK");
  };

  if (status === QueryStatus.Error) {
    send({
      type: "LOAD_BILL_FAILED",
      data: error!,
    });
  }

  if (currentState.matches("error")) {
    showMessage({
      message: error?.message!,
      type: "danger",
    });

    navigate(AppRoutes.HOME);
  }

  if (currentState.matches("categorySelection")) {
    navigate(AppRoutes.HOME);
  }

  if (currentState.matches("processBillPayment")) {
    navigate(AppRoutes.CREATE_BILL_PAYMENT);
  }

  const rightAccessory = () => {
    return (
      <Button
        appearance="ghost"
        accessoryLeft={CloseIcon}
        onPress={() => {
          send("CLEAR_SEARCH");
        }}
      ></Button>
    );
  };

  const renderItem: ListRenderItem<Bill> = ({ item, index }) => {
    const renderCheck = () => {
      if (
        currentState.context.selectedBill &&
        currentState.context.selectedBill.name === item.name
      ) {
        return (props: IconProps) => (
          <Icon {...props} name="checkmark-circle-2" fill="red" />
        );
      } else {
        return (props: IconProps) => (
          <Icon {...props} name="checkmark-circle-2" />
        );
      }
    };

    const selectBill = (bill: Bill) => {
      send({
        type: "BILL_SELECTED",
        bill,
      });
    };

    return (
      <ListItem
        title={item.amount ? `${item.name} - N${item.amount}` : item.name}
        description={`Pay bill using ${item.short_name}`}
        style={{ marginBottom: 10, borderRadius: 10 }}
        accessoryLeft={renderCheck()}
        accessoryRight={ChevronArrowForward}
        onPress={() => selectBill(item)}
      />
    );
  };

  return (
    <Body>
      <AppTopNavigation title="BILLS" childScreen goBack={goBack} />
      <Container>
        <Input
          placeholder="Search"
          accessoryLeft={SearchIcon}
          accessoryRight={rightAccessory}
          onChangeText={(value) =>
            send({
              type: "FILTER_BILLS",
              value,
            })
          }
        />
        <View style={{ flex: 1 }}>
          <List
            data={currentState.context.displayBills}
            renderItem={renderItem}
          />
        </View>
        <Button
          status="success"
          style={{ marginBottom: 10 }}
          onPress={() => send("PROCEED")}
        >
          Proceed
        </Button>
      </Container>

      <Loader visible={status === QueryStatus.Loading} />
    </Body>
  );
};
