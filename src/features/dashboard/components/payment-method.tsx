import { Text } from "@ui-kitten/components";
import {
  BankPaymentMethod,
  CardPaymentMethod,
  PaymentMethod as PaymentMethodType,
  PaymentMethods,
} from "paygo";
import React, { useRef, useState } from "react";
import { Dimensions, ListRenderItem, StyleSheet, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import { Colors } from "../../../constants";
import { globalStyles } from "../../../styles";

interface Props {
  cards?: PaymentMethods;
}

const width = Dimensions.get("screen").width - 20;

export const PaymentMethodCarousel: React.FC<Props> = ({ cards }) => {
  const carousel: any = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  if (cards === undefined) {
    return null;
  }

  const renderItem: ListRenderItem<PaymentMethodType> = ({
    item: paymentMethod,
    index,
  }) => {
    const isCard = (item: PaymentMethodType): item is CardPaymentMethod => {
      return (item as CardPaymentMethod).last4Digit !== undefined;
    };

    const isBank = (item: PaymentMethodType): item is BankPaymentMethod => {
      return (item as BankPaymentMethod).bankCode !== undefined;
    };

    return (
      <React.Fragment key={index}>
        {isCard(paymentMethod) && (
          <View
            style={{
              backgroundColor: Colors.purple,
              borderRadius: 5,
              height: 150,
              padding: 10,
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <Text
                category="h4"
                style={{ color: Colors.white, textAlign: "center" }}
              >{`**** **** **** ${paymentMethod.last4Digit}`}</Text>
            </View>
            <View style={[globalStyles.row, { alignContent: "flex-end" }]}>
              <View style={{ alignContent: "flex-start", flex: 3 }}>
                <Text style={{ ...styles.title }}>Issuer</Text>
                <Text style={{ ...styles.value }}>{paymentMethod.issuer}</Text>
              </View>
              <View style={{ alignItems: "flex-end", flex: 1 }}>
                <Text style={{ ...styles.title }}>Expires</Text>
                <Text style={{ ...styles.value }}>{paymentMethod.expiry}</Text>
              </View>
            </View>
          </View>
        )}
      </React.Fragment>
    );
  };

  return (
    <Carousel
      layout={"default"}
      ref={carousel}
      data={cards}
      sliderWidth={width}
      itemWidth={width}
      renderItem={renderItem}
      onSnapToItem={(index) => setActiveIndex(index)}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  value: {
    color: Colors.white,
    fontWeight: "bold",
  },
});
