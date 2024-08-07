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
