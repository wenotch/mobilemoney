import { List, ListItem, ListProps, Text } from "@ui-kitten/components";
import { isArray } from "lodash";
import moment from "moment";
import { Transaction } from "paygo";
import React from "react";
import { ListRenderItem, TouchableWithoutFeedback, View } from "react-native";
import { Colors } from "../../constants";
import { formatToMoney } from "../../lib/utils";
import { globalStyles } from "../../styles";
import { Title } from "../title";

interface Props
  extends Pick<
    ListProps,
    | "onRefresh"
    | "refreshing"
    | "data"
    | "onEndReached"
    | "onEndReachedThreshold"
    | "initialNumToRender"
  > {
  viewReceipt: (item: Transaction) => void;
}

export const TransactionList: React.FC<Props> = ({
  refreshing,
  data,
  onRefresh,
  onEndReached,
  onEndReachedThreshold,
  initialNumToRender,
  viewReceipt,
}) => {
  const renderItem: ListRenderItem<Transaction> = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback onPress={() => viewReceipt(item)}>
        <View
          key={index}
          style={{
            padding: 10,
            marginBottom: 10,
            borderRadius: 10,
            backgroundColor: Colors.white,
          }}
        >
          <View style={{ ...globalStyles.row }}>
            <View style={{ ...globalStyles.col }}>
              <Text>{item.remark}</Text>
              <Text style={{ color: Colors.lightGrey, paddingTop: 5 }}>
                {moment(item.transactTime).format("MMMM Do YYYY")}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: item.amount < 0 ? "red" : "green",
                  paddingTop: 15,
                }}
              >
                {item.amount > 0
                  ? `N${formatToMoney(item.amount)}`
                  : `- N${formatToMoney(item.amount)}`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View>
      <Title heading="Transaction History" />
      {isArray(data) && data?.length > 0 && (
        <List
          data={data}
          renderItem={renderItem}
          onRefresh={onRefresh}
          refreshing={refreshing}
          style={{ backgroundColor: Colors.grey, marginBottom: 330 }}
          onEndReached={onEndReached}
          onEndReachedThreshold={onEndReachedThreshold}
          initialNumToRender={initialNumToRender}
        />
      )}
      {data?.length === 0 && (
        <ListItem
          title={() => (
            <Text style={{ fontSize: 15, fontWeight: "600", color: "red" }}>
              No transaction has been performed
            </Text>
          )}
        />
      )}
    </View>
  );
};
