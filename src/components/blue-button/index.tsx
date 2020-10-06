import { Button, ButtonProps } from "@ui-kitten/components";
import React from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";

interface Props extends ButtonProps {
  label: string;
}

export const BlueButton: React.FC<Props> = (props) => (
  <Button size="large" style={{ backgroundColor: Colors.lightBlue }} {...props}>
    {props.label.toUpperCase()}
  </Button>
);
