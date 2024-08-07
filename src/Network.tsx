// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { FC } from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from "./config.json";
import {Button, Select, Box, Badge, Spacer, Heading, Text, Stack, Image } from "@chakra-ui/react"
import heroImage from "./assets/hero-image.png"
import logoImage from "./assets/logo.svg"

const config: any = configFile;

export const Network: FC = () => {
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
    return (
        <Box>
            {!wallet && 
            <Box mt='20' alignContent={"center"}>
                <Stack>
                    <Heading>Turtlish! 🐢 🖼️ </Heading>
                    <Text color={'grey'}>
                        Generate verifiable art NFTs with Python code. 🚀 
                        <br />
                        .
                        <br />
                        <Image boxSize='300px' src={heroImage} />
                    </Text>
                    <Button width="100px" colorScheme="green"
                        onClick={() =>
                            connect()
                        }
                    >
                        {connecting ? "Connecting" : "Connect "}
                    </Button>
                </Stack>
            </Box>
            }
            {wallet && (
                <Box display='flex' w='100%' ml='2' mt='2' mb='0' alignItems='baseline'>
                   <Image boxSize='60px' src={logoImage} />
                </Box>
            )}
        </Box>
    );
};
