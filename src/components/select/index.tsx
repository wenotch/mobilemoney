import { Select as BaseSelect, SelectProps, Text } from "@ui-kitten/components";
import React from "react";
import { Colors } from "../../constants";

interface Props extends SelectProps {}

export const Select: React.FC<Props> = (props) => (
  <BaseSelect
    {...props}
    label={() => (
      <Text style={{ color: Colors.white, paddingBottom: 4 }}>
        {props.label as string}
      </Text>
    )}
    size="medium"
  >
    {props.children}
  </BaseSelect>
);
