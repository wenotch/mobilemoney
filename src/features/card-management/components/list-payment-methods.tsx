import { List, ListItem } from "@ui-kitten/components";
import React from "react";
import { ListRenderItem } from "react-native";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { ChevronArrowForward } from "../../../components/icons";
import { Colors } from "../../../constants";

interface Props {
  paymentMethods: string[];
  goto: (data: string) => void;
}

export const ListPaymentMethods: React.FC<Props> = ({
  paymentMethods,
  goto,
}) => {
  const renderItem: ListRenderItem<string> = ({ index, item }) => (
    <ListItem
      title={item}
      key={index}
      accessoryRight={ChevronArrowForward}
      style={{ borderBottomColor: Colors.grey, borderBottomWidth: 1 }}
      onPress={() => goto(item)}
    />
  );

  return (
    <Body>
      <Container style={{ flex: 1 }}>
        <List
          data={paymentMethods}
          renderItem={renderItem}
          style={{
            backgroundColor: Colors.grey,
            padding: 0,
            margin: 0,
          }}
        />
      </Container>
    </Body>
  );
};
