import { useNavigation } from "@react-navigation/native";
import React from "react";
import { AppTopNavigation } from "../../components/app-top-navigation";
import { Body } from "../../components/body";
import { Container } from "../../components/container";

interface IProps {}

export const AgentProfile: React.FC<IProps> = () => {
  const {goBack} = useNavigation()

  return (
    <Body>
      <AppTopNavigation title="AGENT PROFILE" childScreen goBack={goBack} />
      <Container></Container>
    </Body>
  );
}
