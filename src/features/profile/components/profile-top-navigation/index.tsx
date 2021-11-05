import { DrawerActions, useNavigation } from "@react-navigation/native";
import {
  Icon,
  IconProps,
  IndexPath,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import React, { useState } from "react";
import { Colors } from "../../../../constants";

export const ProfileTopNavigation: React.FC = ({}) => {
  const { dispatch } = useNavigation();
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(
    undefined as IndexPath | undefined
  );

  const MenuIcon = (props: IconProps) => (
    <Icon name="menu-outline" fill={Colors.darkBlue} {...props} />
  );

  const MoreIcon = (props: IconProps) => (
    <Icon name="more-vertical-outline" fill={Colors.darkBlue} {...props} />
  );

  const leftTopNavigationAction = (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={() => dispatch(DrawerActions.toggleDrawer())}
    />
  );

  const rightTopNavigationAction = (
    <TopNavigationAction icon={MoreIcon} onPress={() => setVisible(true)} />
  );

  const onItemSelect = (index: IndexPath) => {
    setSelectedIndex(index);
    setVisible(false);
  };

  return (
    <TopNavigation
      accessoryLeft={() => leftTopNavigationAction}
      accessoryRight={() => (
        <OverflowMenu
          anchor={() => rightTopNavigationAction}
          visible={visible}
          onBackdropPress={() => setVisible(false)}
          selectedIndex={selectedIndex}
          onSelect={onItemSelect}
          placement="bottom"
        >
          <MenuItem title="Change Password" />
          <MenuItem title="Agent Account" />
        </OverflowMenu>
      )}
      style={{ backgroundColor: Colors.seafoam }}
      title="My Profile"
      alignment="center"
    />
  );
};
