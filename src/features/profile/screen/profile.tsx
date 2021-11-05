import { useNavigation } from "@react-navigation/native";
import { ListItem, Text } from "@ui-kitten/components";
import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Body } from "../../../components/body";
import { Container } from "../../../components/container";
import { ChevronArrowForward } from "../../../components/icons";
import { Colors } from "../../../constants";
import {
  Session,
  SessionContext,
} from "../../../lib/session/context/session-context";
import { AppRoutes } from "../../../navigator/app.route";
import { ProfileTopNavigation } from "../components/profile-top-navigation";

export const Profile: React.FC = () => {
  const { navigate } = useNavigation();
  const { currentUser } = useContext(SessionContext) as Session;

  return (
    <Body>
      <StatusBar backgroundColor={Colors.seafoam} />
      <ProfileTopNavigation />
      <View style={{ backgroundColor: Colors.seafoam, paddingBottom: 20 }}>
        <Image
          source={require("../../../assets/unnamed.png")}
          style={[
            styles.profileImage,
            {
              backgroundColor: Colors.white,
            },
          ]}
        />
        <Text
          style={[styles.nameStyle, { color: Colors.black }]}
          category="h4"
        >{`${currentUser?.firstName} ${currentUser?.lastName}`}</Text>
      </View>

      <Container style={{ marginBottom: 20, flex: 2 }}>
        <ScrollView>
          <View>
            <ListItem
              title="Update Profile"
              style={{ ...styles.listViewStyle, marginTop: 10 }}
              accessoryRight={ChevronArrowForward}
              onPress={() => navigate(AppRoutes.UPDATE_PROFILE)}
            />
            <ListItem
              title="Change PIN"
              style={{ ...styles.listViewStyle, marginTop: 10 }}
              accessoryRight={ChevronArrowForward}
              onPress={() => navigate(AppRoutes.MANAGE_PIN)}
            />
            <ListItem
              title="Change Password"
              style={{ ...styles.listViewStyle, marginTop: 10 }}
              accessoryRight={ChevronArrowForward}
              onPress={() => navigate(AppRoutes.CHANGE_PASSWORD)}
            />
            {/* <ListItem
              title="Switch to Agent Account"
              style={styles.listViewStyle}
              accessoryRight={ChevronArrowForward}
            />
            <ListItem
              title="Support"
              style={styles.listViewStyle}
              accessoryRight={ChevronArrowForward}
            />
            <ListItem
              title="Sign Out"
              style={styles.listViewStyle}
              accessoryRight={ChevronArrowForward}
            /> */}
          </View>
        </ScrollView>
      </Container>
    </Body>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
    padding: 20,
  },
  nameStyle: {
    textAlign: "center",
  },
  listViewStyle: {
    borderRadius: 10,
    marginBottom: 20,
  },
});
