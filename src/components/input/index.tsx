import { Input as BaseInput, InputProps, Text } from "@ui-kitten/components";
import React from "react";
import { Colors } from "../../constants";

interface Props extends InputProps {}

export const Input: React.FC<Props> = (props) => (
  <BaseInput
    {...props}
    label={() => (
      <Text style={{ color: Colors.white, paddingBottom: 4 }}>
        {props.label as string}
      </Text>
    )}
    size="medium"
  />
);
