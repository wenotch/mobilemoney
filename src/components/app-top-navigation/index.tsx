import { DrawerActions, useNavigation } from "@react-navigation/native";
import {
  TopNavigation,
  TopNavigationAction,
  TopNavigationProps,
} from "@ui-kitten/components";
import React from "react";
import { Colors } from "../../constants";
import { BackIcon, MenuIcon } from "../icons";

interface Props extends TopNavigationProps {
  childScreen?: boolean;
  goBack?: () => void;
}

export const AppTopNavigation: React.FC<Props> = (props) => {
  const { dispatch, goBack } = useNavigation();
  const parentRoute = props.childScreen !== undefined ? false : true;

  const navigateBack = props.goBack || goBack;

  const leftAccessoryAction = (
    <TopNavigationAction
      icon={parentRoute ? MenuIcon : BackIcon}
      onPress={() => {
        if (parentRoute) {
          dispatch(DrawerActions.toggleDrawer());
        } else {
          navigateBack();
        }
      }}
    />
  );

  return (
    <TopNavigation
      accessoryLeft={() => leftAccessoryAction}
      style={{ backgroundColor: Colors.grey }}
      alignment="center"
      {...props}
    />
  );
};
