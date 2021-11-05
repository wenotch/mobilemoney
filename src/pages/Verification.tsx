import { Image } from "@chakra-ui/image";
// import { Box } from "@chakra-ui/layout";
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
  Text,
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

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Verification: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);
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
                    <Heading w="full" color="#046494" fontWeight="medium">
                      BVN
                    </Heading>

                    <FormControl>
                      <InputGroup variant="filled">
                        <InputLeftElement
                          pointerEvents="none"
                          children={<CFaUserAlt color="#046494" />}
                        />
                        <Input
                          type="number"
                          placeholder="Enter Bvn"
                          _placeholder={{ color: "#046494" }}
                          //   outlineColor="gray.400"
                          bg="gray.300"
                          rounded="md"
                        />
                      </InputGroup>
                    </FormControl>

                    <Flex justifyContent="space-between">
                      <Button
                        borderRadius={0}
                        variant="solid"
                        bg="#046494"
                        color="white"
                        width="48%"
                      >
                        <IonButton
                          routerDirection="back"
                          fill="clear"
                          routerLink="/signup"
                        >
                          <IonLabel>
                            <Link color="white">Back </Link>
                          </IonLabel>
                        </IonButton>
                      </Button>
                      <Button
                        borderRadius={0}
                        variant="solid"
                        bg="#046494"
                        color="white"
                        width="48%"
                      >
                        <IonButton
                          routerDirection="back"
                          fill="clear"
                          routerLink="/dashboard"
                        >
                          <IonLabel>
                            <Link color="white">Next</Link>
                          </IonLabel>
                        </IonButton>
                      </Button>
                    </Flex>
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
                  <Link color="white">Back to Login</Link>
                </IonLabel>
              </IonButton>
            </Box>
          </Flex>
        </Box>
      </IonContent>
    </IonPage>
  );
};

export default Verification;
