import { useNavigation } from "@react-navigation/native";
import { Text } from "@ui-kitten/components";
import { useService } from "@xstate/react";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { BillIcon, CashOutIcon } from "../../../components/icons";
import { Title } from "../../../components/title";
import { Colors } from "../../../constants";
import { AppRoutes } from "../../../navigator/app.route";
import { globalStyles } from "../../../styles";
import { billPaymentService } from "../machine/billPaymentService";

export const Services = () => {
  const [currentState, send] = useService(billPaymentService);
  const { navigate } = useNavigation();

  useEffect(() => {
    if (!currentState.matches("categorySelection")) {
      send("RESET");
    }
  }, []);

  if (currentState.matches({ billListing: "loadingBills" })) {
    navigate(AppRoutes.BILL_PAYMENT);
  }

  if (currentState.matches("error")) {
    showMessage({
      message: currentState.context.error,
      type: "danger",
    });
  }

  return (
    <View style={{ marginTop: 10 }}>
      <Title heading="Make Payment" />
      <View style={[globalStyles.row]}>
        <View style={styles.serviceBtnWrapper}>
          <TouchableOpacity
            style={{ ...styles.serviceBtn }}
            onPress={() => {
              send({
                type: "CATEGORY_SELECTED",
                category: "airtime",
              });
            }}
          >
            <>
              <BillIcon fill={Colors.lightBlue} width={30} height={30} style={{backgroundColor: Colors.darkBlue, padding: 10}} />
              <Text style={{ textAlign: "center", fontSize: 11, color: Colors.lightGrey }}>Buy Airtime</Text>
            </>
          </TouchableOpacity>
        </View>

        <View style={styles.serviceBtnWrapper}>
          <TouchableOpacity
            style={{ ...styles.serviceBtn }}
            onPress={() =>
              send({
                type: "CATEGORY_SELECTED",
                category: "cable tv",
              })
            }
          >
            <>
              <CashOutIcon fill={Colors.lightBlue} width={30} height={30} />
              <Text style={{ textAlign: "center" }}>Cable TV</Text>
            </>
          </TouchableOpacity>
        </View>

        <View style={styles.serviceBtnWrapper}>
          <TouchableOpacity
            style={{ ...styles.serviceBtn }}
            onPress={() =>
              send({
                type: "CATEGORY_SELECTED",
                category: "mobile data",
              })
            }
          >
            <>
              <CashOutIcon fill={Colors.lightBlue} width={30} height={30} />
              <Text style={{ textAlign: "center" }}>Mobile Data</Text>
            </>
          </TouchableOpacity>
        </View>

        <View style={styles.serviceBtnWrapper}>
          <TouchableOpacity
            style={{ ...styles.serviceBtn }}
            onPress={() =>
              send({
                type: "CATEGORY_SELECTED",
                category: "utility",
              })
            }
          >
            <>
              <CashOutIcon fill={Colors.lightBlue} width={30} height={30} />
              <Text style={{ textAlign: "center" }}>Utility</Text>
            </>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceBtn: {
    borderColor: Colors.black,
    padding: 10,
    borderRadius: 10,
    shadowColor: Colors.grey,
    width: 160,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceBtnWrapper: {
    flex: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});
