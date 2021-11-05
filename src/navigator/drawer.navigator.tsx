import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext } from "react";
import { AgentProfile } from "../features/agent";
import { BillList } from "../features/bills/screens/bills-list";
import { CreateBillPayment } from "../features/bills/screens/create-bill-payment";
import { AddBankAccount } from "../features/card-management/screens/add-bank-account";
import { AddCard } from "../features/card-management/screens/add-card";
import { ListPaymentMethodType } from "../features/card-management/screens/list-payment-method-type";
import { PaymentMethods } from "../features/card-management/screens/payment-methods";
import { Home } from "../features/dashboard/screen/home";
import { ChangePassword } from "../features/profile/screen/change-password";
import { Profile } from "../features/profile/screen/profile";
import { SetPin } from "../features/profile/screen/set-pin";
import { UpdateProfile } from "../features/profile/screen/update-profile";
import { BankTransfer } from "../features/transfer/screens/bank-transfer";
import { SelectRecipientType } from "../features/transfer/screens/select-recipient-type";
import { TransferToMobile } from "../features/transfer/screens/transfer-to-mobile";
import { TransferWithin } from "../features/transfer/screens/transfer-within";
import { BankFunding } from "../features/wallet/screens/bank-funding";
import { CardListing } from "../features/wallet/screens/card-selector";
import { FundAccountPreview } from "../features/wallet/screens/fund-account-preview";
import { SelectFundingMethod } from "../features/wallet/screens/select-funding-method";
import { Session, SessionContext } from "../lib/session/context/session-context";
import { AppRoutes } from "./app.route";

const Drawer = createDrawerNavigator();

const BottomTab = createBottomTabNavigator();

const Stack = createStackNavigator();

const ManagePaymentMethods = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={AppRoutes.SELECT_PAYMENT_METHODS}
    >
      <Stack.Screen
        name={AppRoutes.SELECT_PAYMENT_METHODS}
        component={PaymentMethods}
      />
      <Stack.Screen
        name={AppRoutes.ADD_PAYMENT_METHOD}
        component={ListPaymentMethodType}
      />
      <Stack.Screen name={AppRoutes.ADD_CARD} component={AddCard} />
      <Stack.Screen
        name={AppRoutes.ADD_BANK_ACCOUNT}
        component={AddBankAccount}
      />
    </Stack.Navigator>
  );
};

const SendMoney = () => {
  return (
    <Stack.Navigator
      mode="modal"
      headerMode="none"
      initialRouteName={AppRoutes.SELECT_RECIPIENT_TYPE}
    >
      <Stack.Screen
        component={SelectRecipientType}
        name={AppRoutes.SELECT_RECIPIENT_TYPE}
      />
      <Stack.Screen
        component={BankTransfer}
        name={AppRoutes.SEND_MONEY_TO_BANK_ACCOUNT}
      />
      <Stack.Screen
        component={TransferToMobile}
        name={AppRoutes.PHONE_CONTACT_TRANSFER}
      />
      <Stack.Screen
        component={TransferWithin}
        name={AppRoutes.TRANSFER_WITHIN}
      />
    </Stack.Navigator>
  );
};

const BillPayment = () => (
  <Stack.Navigator
    mode="modal"
    headerMode="none"
    initialRouteName={AppRoutes.BILL_LIST}
  >
    <Stack.Screen name={AppRoutes.BILL_LIST} component={BillList} />
    <Stack.Screen
      name={AppRoutes.CREATE_BILL_PAYMENT}
      component={CreateBillPayment}
    />
  </Stack.Navigator>
);

const Funding = () => (
  <Stack.Navigator initialRouteName={AppRoutes.FUND_ACCOUNT} headerMode="none">
    <Stack.Screen
      component={SelectFundingMethod}
      name={AppRoutes.FUND_ACCOUNT}
    />
    <Stack.Screen
      component={CardListing}
      name={AppRoutes.FUND_ACCOUNT_SELECT_CARD}
    />
    <Stack.Screen component={BankFunding} name={AppRoutes.BANK_FUNDING} />
    <Stack.Screen
      component={FundAccountPreview}
      name={AppRoutes.FUND_ACCOUNT_PREVIEW}
    />
  </Stack.Navigator>
);

const Dashboard = () => (
  <Stack.Navigator initialRouteName={AppRoutes.HOME} headerMode="none">
    <Stack.Screen component={Home} name={AppRoutes.HOME} />
    <Stack.Screen component={Funding} name={AppRoutes.FUND_ACCOUNT} />
    <Stack.Screen component={BillPayment} name={AppRoutes.BILL_PAYMENT} />
  </Stack.Navigator>
);

const ProfileNavigator = () => (
  <Stack.Navigator initialRouteName={AppRoutes.PROFILE} headerMode="none">
    <Stack.Screen name={AppRoutes.PROFILE} component={Profile} />
    <Stack.Screen name={AppRoutes.UPDATE_PROFILE} component={UpdateProfile} />
    <Stack.Screen name={AppRoutes.MANAGE_PIN} component={SetPin} />
    <Stack.Screen name={AppRoutes.CHANGE_PASSWORD} component={ChangePassword} />
  </Stack.Navigator>
);

export const DrawerNavigator: React.FC = () => {
  const { currentUser } = useContext(SessionContext) as Session;
  delete currentUser?.agent;
  debugger;
  
  return (
    <Drawer.Navigator initialRouteName={AppRoutes.HOME}>
      <Drawer.Screen name={AppRoutes.HOME} component={Dashboard} />
      <Drawer.Screen name={AppRoutes.PROFILE} component={ProfileNavigator} />
      <Drawer.Screen
        name={AppRoutes.MANAGE_PAYMENT_METHODS}
        component={ManagePaymentMethods}
      />
      <Drawer.Screen name={AppRoutes.SEND_MONEY} component={SendMoney} />
      {!currentUser?.agent && <Drawer.Screen name={AppRoutes.BECOME_AN_AGENT} component={AgentProfile} />}
    </Drawer.Navigator>
  );
};
