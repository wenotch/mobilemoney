import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Button, List, ListItem } from "@ui-kitten/components";
import { AxiosError } from "axios";
import { CardPaymentMethod, PaymentMethod } from "paygo";
import React, { useEffect } from "react";
import { ListRenderItem, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { QueryStatus, useQuery } from "react-query";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { Loader } from "../../../components/loader";
import { Colors } from "../../../constants";
import { AppRoutes } from "../../../navigator/app.route";
import { paymentMethodService } from "../../../services/payment-method-service";

export const PaymentMethods: React.FC = () => {
  const { navigate } = useNavigation();
  const isFocused = useIsFocused();
  const { name } = useRoute();
  const { data, status, error, refetch } = useQuery(
    "cards",
    paymentMethodService.fetchPaymentMethods
  );

  useEffect(() => {
    switch (status) {
      case QueryStatus.Error:
        showMessage({
          message: (error as AxiosError).message,
          duration: 3000,
          autoHide: true,
          type: "danger",
        });
        break;

      case QueryStatus.Success:
        break;

      default:
        break;
    }
  }, [status]);

  useEffect(() => {
    refetch();
  }, [isFocused]);

  const isCard = (card: PaymentMethod): card is CardPaymentMethod => {
    return (card as CardPaymentMethod).last4Digit !== undefined;
  };

  const renderItem: ListRenderItem<PaymentMethod> = ({ index, item }) => {
    let title;
    let description;

    if (isCard(item)) {
      title = item.issuer;
      description = `${item.bin} **** ${item.last4Digit}`;
    } else {
      return null;
    }

    return (
      <ListItem
        key={index}
        title={title}
        description={description}
        style={{ marginBottom: 10 }}
      />
    );
  };

  return (
    <Body>
      <AppTopNavigation title={name} alignment="center" />
      <Container>
        <View style={{ flex: 1 }}>
          <List
            data={data}
            renderItem={renderItem}
            style={{ backgroundColor: Colors.grey }}
          />
        </View>
        <View style={{ marginBottom: 10, marginTop: 5 }}>
          <Button onPress={() => navigate(AppRoutes.ADD_PAYMENT_METHOD)}>
            Add Card
          </Button>
        </View>
      </Container>

      <Loader visible={status === QueryStatus.Loading} />
    </Body>
  );
};
