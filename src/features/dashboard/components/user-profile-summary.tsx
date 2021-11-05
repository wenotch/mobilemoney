import { isUndefined } from "lodash";
import { Wallet } from "paygo";
import React, { useContext } from "react";
import { Image, View } from "react-native";
import { Colors } from "../../../constants";
import { SessionContext } from "../../../lib/session/context/session-context";
import { globalStyles } from "../../../styles";
import { AccountSummary } from "./account-summary";

const userIcon = require("../../../assets/unnamed.png");

interface Props {
  wallet: Wallet;
}

export const UserProfileSummary: React.FC<Props> = ({ wallet }) => {
  const { currentUser } = useContext(SessionContext);

  return (
    <View style={[globalStyles.row]}>
      <View style={[globalStyles.col, { flex: 2 }]}>
        {!isUndefined(wallet) && (
          <AccountSummary amount={`${wallet.balance}`} />
        )}
      </View>
      <View style={[globalStyles.col]}>
        {currentUser?.profilePic === undefined && (
          <Image
            source={userIcon}
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              backgroundColor: Colors.white,
              alignSelf: "flex-end",
            }}
          />
        )}
      </View>
    </View>
  );
};
