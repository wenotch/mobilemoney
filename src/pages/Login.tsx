import { Image } from "@chakra-ui/image";
import { useHistory } from "react-router-dom";
import { IonButton, IonContent, IonLabel, IonPage } from "@ionic/react";
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
  FormControl,
  FormHelperText,
  InputRightElement,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Redux/actions/action";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login: React.FC = () => {
  //getting complete state from redux
  const state = useSelector((state: any) => state);
  const isLoading = state.isLoading;
  console.log(isLoading);

  //init useDispatch
  const dispatch = useDispatch();

  // form data control for sign in
  const [userData, setuserData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: any) => {
    setuserData((prevState: any) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  //handles showing and unshowing password
  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);

  //error message on form
  const [errorMessage, setErrorMessage] = useState({ value: "" });

  //handles submitting the form
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (userData.email === "" || userData.password === "") {
      setErrorMessage((prevState) => ({
        value: "Empty username/password field",
      }));
    } else {
      dispatch({
        type: "LOADING",
      });
      dispatch(login(userData));
    }
  };



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
                      Log In
                    </Heading>
                    <FormControl>
                      <InputGroup variant="filled">
                        <InputLeftElement
                          pointerEvents="none"
                          children={<CFaUserAlt color="#046494" />}
                        />
                        <Input
                          type="email"
                          name="email"
                          placeholder="Email address"
                          _placeholder={{ color: "#046494" }}
                          //   outlineColor="gray.400"
                          bg="gray.300"
                          rounded="md"
                          onChange={(e) => handleInputChange(e)}
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
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          _placeholder={{ color: "#046494" }}
                          //   outlineColor="gray.400"
                          bg="gray.300"
                          rounded="md"
                          onChange={(e) => handleInputChange(e)}
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
                      <FormHelperText textAlign="right">
                        <IonButton fill="clear" routerLink="/forgot">
                          <IonLabel>
                            <Link color="gray" textTransform="lowercase">
                              forgot password?
                            </Link>
                          </IonLabel>
                        </IonButton>
                      </FormHelperText>
                    </FormControl>
                    <Button
                      borderRadius={0}
                      variant="solid"
                      isLoading={isLoading}
                      bg="#046494 !important"
                      color="white"
                      width="full"
                      onClick={handleSubmit}
                    >
                      Login
                    </Button>
                  </Stack>
                </form>
              </Box>
            </Stack>
            <Box>
              <IonButton
                routerDirection="forward"
                fill="clear"
                routerLink="/signup"
              >
                <IonLabel>
                  <Link color="white">Not Registered? Sign Up</Link>
                </IonLabel>
              </IonButton>
            </Box>
          </Flex>
        </Box>
      </IonContent>
    </IonPage>
  );
};

export default Login;
