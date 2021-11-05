import { useNavigation } from "@react-navigation/native";
import { Button, Icon, IconProps, List, ListItem } from "@ui-kitten/components";
import { useService } from "@xstate/react";
import { CardPaymentMethod } from "paygo";
import React, { useContext } from "react";
import { ListRenderItem } from "react-native";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { ChevronArrowForward } from "../../../components/icons";
import { Colors } from "../../../constants";
import {
  Session,
  SessionContext,
} from "../../../lib/session/context/session-context";
import { isCard } from "../../../lib/utils";
import { AppRoutes } from "../../../navigator/app.route";
import { fundAccountService } from "../fsm/fund-account-machine";

export const CardListing: React.FC = () => {
  const { currentUser } = useContext(SessionContext) as Session;
  const [currentState, send] = useService(fundAccountService);
  const navigation = useNavigation();

  const cards = [...currentUser?.paymentMethods!];
  cards.shift();

  const goBack = () => {
    send("BACK");
    navigation.goBack();
  };

  const renderItem: ListRenderItem<CardPaymentMethod> = ({ item, index }) => {
    const renderCheck = () => {
      if (
        currentState.context.selectedCard &&
        currentState.context.selectedCard.id === item.id
      ) {
        return (props: IconProps) => (
          <Icon {...props} name="checkmark-circle-2" fill={"red"} />
        );
      } else {
        return (props: IconProps) => (
          <Icon {...props} name="checkmark-circle-2" />
        );
      }
    };

    return (
      <>
        {isCard(item) && (
          <ListItem
            title={item.issuer}
            description={`${item.bin} ** **** ${item.last4Digit}`}
            key={index}
            style={{ marginBottom: 10, borderRadius: 10 }}
            accessoryRight={ChevronArrowForward}
            accessoryLeft={renderCheck()}
            onPress={() => {
              send({
                type: "CARD_SELECTED",
                cardDetail: item,
              });
            }}
          />
        )}
      </>
    );
  };

  return (
    <Body>
      <AppTopNavigation childScreen title="My Cards" goBack={goBack} />
      <Container>
        <List
          renderItem={renderItem}
          data={cards}
          style={{ backgroundColor: Colors.grey, marginBottom: 10 }}
        />
        <Button
          status="success"
          onPress={() => {
            send("PROCEED");
            navigation.navigate(AppRoutes.FUND_ACCOUNT_PREVIEW);
          }}
          style={{ marginBottom: 10 }}
        >
          Proceed
        </Button>
      </Container>
    </Body>
  );
};
