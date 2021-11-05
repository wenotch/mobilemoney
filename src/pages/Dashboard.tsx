import { Image } from "@chakra-ui/image";
import { useHistory } from "react-router-dom";
import {
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonPage,
} from "@ionic/react";
import React from "react";
import logo from "../images/paygo.png";
import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  Text,
  FormHelperText,
  InputRightElement,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import Navbar from "../components/Navbar";
import QuickLinks from "../components/QuickLinks";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Dashboard: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  

  const handleShowClick = () => setShowPassword(!showPassword);
  const history = useHistory();
  return (
    <IonPage>
      <IonContent fullscreen>
        <Box width="100%" h="100vh" bg="white">
          <Navbar />
          <Box bg="#046494" mx="30px" px="50px" py="30px" rounded="lg">
            <Text color="white">Wallet Balance</Text>
            <Text color="#E7BF00" fontWeight="semibold" fontSize="2xl">
              {" "}
              N2,000,000
            </Text>
          </Box>
          <QuickLinks />
        </Box>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
