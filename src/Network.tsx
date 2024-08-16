import { FC } from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from "./config.json";
import {Button, Box, Spacer, Image } from "@chakra-ui/react"
import logoImage from "./assets/logo.svg"
import { Landing } from "./Landing";

const config: any = configFile;

export const Network: FC = () => {
    const [{ wallet, connecting }, connect ] = useConnectWallet();
    const [{ connectedChain }, setChain] = useSetChain();
    const targetChainId = config.targetChainId || "0x14a34";

    const switchChain = async (chainId: string) => {
        try {
            await setChain({ chainId });
        } catch (err) {
            console.error("Failed to switch chain:", err);
        }
    };
    
    return (
        <Box>
            {!wallet &&
            <Box alignContent={"center"}>  
                < Landing />
                <Button width="100px" colorScheme="green"
                    onClick={() =>
                        connect()
                    }
                >
                    {connecting ? "Connecting" : "Connect "}
                </Button>
            </Box>
            }
            {wallet && (
                <Box display='flex' w='100%' ml='2' mt='2' mb='0' alignItems='baseline'>
                   <Image boxSize='60px' src={logoImage} />
                   <Spacer />
                    {connectedChain && connectedChain.id !== targetChainId && (
                        <Button ml="4" colorScheme="red" onClick={() => switchChain(targetChainId)}>
                            Switch to Base Sepolia
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
};
