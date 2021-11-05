// import { Modal } from "@ui-kitten/components";
import React from "react";
import { ActivityIndicator, Modal, View } from "react-native";
import { Colors } from "../../constants";

interface Props {
  visible: boolean;
}

export const Loader: React.FC<Props> = ({ visible }) => (
  <Modal visible={visible} transparent>
    <View
      style={{
        backgroundColor: "rgba(0,0,0,.6)",
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          backgroundColor: Colors.white,
          margin: 10,
          padding: 10,
          borderRadius: 2,
        }}
      >
        <ActivityIndicator size="large" color={Colors.darkBlue} />
      </View>
    </View>
  </Modal>
);
