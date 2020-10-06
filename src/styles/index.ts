import { StyleSheet } from "react-native";
import { Colors } from "../constants";

export const globalStyles = StyleSheet.create({
  blueBackground: {
    backgroundColor: Colors.darkBlue,
  },

  input: {
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
  },

  formButton: {
    backgroundColor: Colors.lightBlue,
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
  },

  col: {
    flex: 1,
  },
});
