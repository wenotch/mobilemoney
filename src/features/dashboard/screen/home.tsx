import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { useMachine } from "@xstate/react";
import { flatten, isNull, isUndefined } from "lodash";
import moment from "moment";
import { Transaction, Wallet } from "paygo";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Modalize } from "react-native-modalize";
import { QueryStatus, useInfiniteQuery, useQuery } from "react-query";
import { AppTopNavigation } from "../../../components/app-top-navigation";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { TransactionList } from "../../../components/transaction-list";
import { Colors } from "../../../constants";
import {
  Session,
  SessionContext,
} from "../../../lib/session/context/session-context";
import { postRegistrationMachine } from "../../../machines/post-registration-machine";
import { AppRoutes } from "../../../navigator/app.route";
import { verifyBVN } from "../../../services/bvn-verification";
import { paymentMethodService } from "../../../services/payment-method-service";
import { transactionHistoryService } from "../../../services/transactionHistoryService";
import { globalStyles } from "../../../styles";
import { Services } from "../../bills/components/services";
import { BVNVerification } from "../components/bvn_verification";
import { UserProfileSummary } from "../components/user-profile-summary";

interface QueryParams {
  count: number;
  start: number;
}

export const Home: React.FC = () => {
  const modalizeRef = useRef<Modalize>(null);
  const { navigate } = useNavigation();
  const isFocused = useIsFocused();
  const { currentUser } = useContext(SessionContext) as Session;
  const [start, setStart] = useState(0);
  const [receipt, setReceipt] = useState<Transaction | null>(null);

  const [currentState, send] = useMachine(postRegistrationMachine, {
    services: {
      initiateBVNVerification: (_context, event) => {
        if (event.type === "bvn.submitted") {
          return verifyBVN({
            bvn: event.bvn,
            userId: event.userId,
          });
        }

        return Promise.resolve();
      },
    },
  });

  const paymentMethodsQuery = useQuery(
    "paymentMethods",
    (key) => {
      return paymentMethodService.fetchPaymentMethods();
    },
    {
      cacheTime: 0,
    }
  );

  const {
    data,
    fetchMore,
    refetch,
    status: loadTransactionStatus,
    canFetchMore,
  } = useInfiniteQuery(
    ["transactions", start],
    (key, start: number) => {
      return transactionHistoryService.getTransactionHistory(start);
    },
    {
      cacheTime: 0,
    }
  );

  useEffect(() => {
    if (isFocused) {
      refetch();
      paymentMethodsQuery.refetch();
      setStart(0);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isUndefined(currentUser) && paymentMethodsQuery.status === QueryStatus.Success) {
      currentUser.paymentMethods = paymentMethodsQuery.data!;

      //initializes home screen machine
      send({
        type: "init",
        currentUser: currentUser!,
      });
    }
  }, [currentUser, paymentMethodsQuery.status]);

  useEffect(() => {
    if (isNull(currentState.context.currentUser?.pin)) {
      navigate(AppRoutes.MANAGE_PIN);
    }
  }, []);

  let wallet;

  if (!isUndefined(paymentMethodsQuery.data)) {
    wallet = paymentMethodsQuery.data![0] as Wallet;
  } else if (!isUndefined(currentUser?.paymentMethods)) {
    wallet = currentUser?.paymentMethods[0] as Wallet;
  } else {
    wallet = {
      id: 0,
      balance: 0,
    };
  }

  const viewReceipt = (item: Transaction) => {
    setReceipt(item);
    modalizeRef.current?.open();
  };

  return (
    <Body>
      <AppTopNavigation />
      <Container>
        <View style={styles.profile}>
          <UserProfileSummary wallet={wallet!} />
        </View>
        <View>
          {/* <PaymentMethodCarousel
              cards={paymentMethods || currentUser?.paymentMethods}
            /> */}
          {paymentMethodsQuery.data?.length! > 1 && (
            <Button
              status="danger"
              style={{ marginTop: 15 }}
              onPress={() => navigate(AppRoutes.FUND_ACCOUNT)}
            >
              {() => (
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: Colors.white,
                  }}
                >
                  Fund Wallet
                </Text>
              )}
            </Button>
          )}
        </View>

        <Services />

        <View style={{ marginTop: 20 }}>
          <TransactionList
            data={flatten(data)}
            onRefresh={() => refetch()}
            onEndReached={canFetchMore ? fetchMore : () => {}}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            refreshing={loadTransactionStatus === QueryStatus.Loading}
            viewReceipt={viewReceipt}
          />
        </View>

        <BVNVerification send={send} state={currentState} />
      </Container>

      <Modalize ref={modalizeRef} modalHeight={250}>
        <View style={{ padding: 20 }}>
          <View style={{ ...globalStyles.row }}>
            <View style={globalStyles.col}>
              <Text style={{ color: Colors.purple }}>Transaction Type</Text>
            </View>
            <View style={globalStyles.col}>
              <Text>{receipt?.transactionType}</Text>
            </View>
          </View>
          <View style={globalStyles.row}>
            <View style={globalStyles.col}>
              <Text style={{ color: Colors.purple }}>Transaction Time</Text>
            </View>
            <View style={globalStyles.col}>
              <Text>
                {moment(receipt?.transactTime).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}
              </Text>
            </View>
          </View>
          <View style={globalStyles.row}>
            <View style={globalStyles.col}>
              <Text style={{ color: Colors.purple }}>Transaction ID</Text>
            </View>
            <View style={globalStyles.col}>
              <Text>{receipt?.id}</Text>
            </View>
          </View>
          <View style={globalStyles.row}>
            <View style={globalStyles.col}>
              <Text style={{ color: Colors.purple }}>Remark</Text>
            </View>
            <View style={globalStyles.col}>
              <Text>{receipt?.remark}</Text>
            </View>
          </View>
        </View>
      </Modalize>
    </Body>
  );
};

const styles = StyleSheet.create({
  profile: {
    marginBottom: 20,
  },
});
