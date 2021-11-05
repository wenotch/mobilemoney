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
  FormHelperText,
  InputRightElement,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { Router } from "workbox-routing";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);
  const history = useHistory();
  return (
    <IonPage>
      <IonContent fullscreen>
        <Box width="100%" h="100vh" bg="blue">
          <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            backgroundColor="#046494"
            justifyContent="center"
            alignItems="center"
          >
            <Stack
              flexDir="column"
              mb="2"
              justifyContent="center"
              alignItems="center"
            >
              <Image src={`${logo}`} width="40%" mx="auto" pt="40px" />

              <Box minW={{ base: "90%", md: "468px" }}>
                <form>
                  <Stack
                    spacing={4}
                    p="1rem"
                    backgroundColor="whiteAlpha.900"
                    boxShadow="md"
                    rounded="md"
                    pb="50px"
                    pt="40px"
                  >
                    <Heading color="#046494" fontWeight="medium" mb="10px">
                      Registration
                    </Heading>
                    <FormControl>
                      <InputGroup variant="filled">
                        <InputLeftElement
                          pointerEvents="none"
                          children={<CFaUserAlt color="#046494" />}
                        />
                        <Input
                          type="text"
                          maxLength={15}
                          placeholder="First Name"
                          _placeholder={{ color: "#046494" }}
                          bg="gray.300"
                          rounded="md"
                        />
                      </InputGroup>
                    </FormControl>{" "}
                    <FormControl>
                      <InputGroup variant="filled">
                        <InputLeftElement
                          pointerEvents="none"
                          children={<CFaUserAlt color="#046494" />}
                        />
                        <Input
                          type="text"
                          placeholder="Last Name"
                          _placeholder={{ color: "#046494" }}
                          bg="gray.300"
                          rounded="md"
                        />
                      </InputGroup>
                    </FormControl>{" "}
                    <FormControl>
                      <InputGroup variant="filled">
                        <InputLeftElement
                          pointerEvents="none"
                          children={<CFaUserAlt color="#046494" />}
                        />
                        <Input
                          type="email"
                          placeholder="Email address"
                          _placeholder={{ color: "#046494" }}
                          bg="gray.300"
                          rounded="md"
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <InputGroup>
                        <InputLeftElement
                          pointerEvents="none"
                          color="#046494"
                          children={<CFaLock color="#046494" />}
                        />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          _placeholder={{ color: "#046494" }}
                          //   outlineColor="gray.400"
                          bg="gray.300"
                          rounded="md"
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={handleShowClick}
                            color="#046494"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                    <Button
                      onClick={() => {
                        history.push("/bvn-verification");
                      }}
                      borderRadius={0}
                      variant="solid"
                      bg="#046494"
                      color="white"
                      width="full"
                    >
                      Next
                    </Button>
                  </Stack>
                </form>
              </Box>
            </Stack>
            <Box>
              <IonButton
                routerDirection="back"
                fill="clear"
                routerLink="/login"
              >
                <IonLabel>
                  <Link color="white">Already registered? Login</Link>
                </IonLabel>
              </IonButton>
            </Box>
          </Flex>
        </Box>
      </IonContent>
    </IonPage>
  );
};

export default Register;
