import React from "react";
import { Text, View } from "react-native";
import NumberFormat from "react-number-format";
import { Title } from "../../../components/title";
import { Colors } from "../../../constants";

interface Props {
  amount: string;
}

export const AccountSummary: React.FC<Props> = ({ amount }) => {
  return (
    <View>
      <Title heading="Total Balance" />
      <Text style={{ color: Colors.totalGrey, fontSize: 30 }}>
        <NumberFormat
          value={amount}
          thousandSeparator={true}
          prefix={"N"}
          displayType="text"
          renderText={(value) => <Text>{value}</Text>}
          decimalScale={2}
          fixedDecimalScale
        />
      </Text>
    </View>
  );
};
