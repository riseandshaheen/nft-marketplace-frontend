import React, { useState } from "react";
import { ethers } from "ethers";
import { useRollups } from "./useRollups";
import { useWallets } from "@web3-onboard/react";
import { Tabs, TabList, TabPanels, TabPanel, Tab, Spacer } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Button, Box } from "@chakra-ui/react";
import { HStack, Stack} from "@chakra-ui/react";
import {
  Accordion,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { Explore } from "./Explore";
import { Guide } from "./Guide" 
import Editor from '@monaco-editor/react';

interface IInputPropos {
  dappAddress: string;
}

export const Playground: React.FC<IInputPropos> = (propos) => {
  const rollups = useRollups(propos.dappAddress);
  const [connectedWallet] = useWallets();
  const provider = new ethers.providers.Web3Provider(connectedWallet.provider);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false); 
  const [script, setScript] = useState<string|undefined>('# Add code here');
  const [imageData, setImageData] = useState('');

  const sendCodeInput = async(script: string|undefined) => {
    setIsMinting(true);
    try{
      await window.ethereum.enable();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log("Account:", account)
        console.log("Script: ", script)
      
      let dataObject = {
        method: "draw",
        code: script
      };
      if (rollups && provider){
        let jsonString = JSON.stringify(dataObject);
        console.log("JSON Input: ", jsonString)
        let payload = ethers.utils.toUtf8Bytes(jsonString);
        const trx = await rollups.inputContract.addInput(propos.dappAddress, payload);
        await trx.wait()
        toast({
          title: "Transaction Successful",
          description: "Your NFT will be listed on Explore page in a few seconds.",
          status: "success",
          duration: 7000,
          isClosable: true,
        });
      }
    } catch(e){
      console.log(`${e}`)
      toast({
        title: "Transaction Failed",
        description: "An error occurred while submitting your input.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsMinting(false);
    }
  }

  const handleEditorValueChange = (value: string|undefined) => {
    setScript(value)
  }

  const handleRunScript = async () => {
    setIsLoading(true);
    console.log("Running the script: ", script)
    try {
      // update as per dev or prod environment
      const response = await fetch('https://flask-hello-world-gamma-sand-69.vercel.app/draw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( { code: script } ),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Image result: ", result);
        setImageData(result.image);
      } else {
        const errorData = await response.json();
        console.error('Error in drawing:', response.statusText);
        toast({
          title: "Error",
          description: errorData.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while running the script.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs variant="soft-rounded" size="lg" align="center" mt='0'>
      <TabList mt='0'>
        <Tab>▶️ Code</Tab>
        <Tab>🌏 Explore</Tab>
        <Tab>📝 Guide</Tab>
      </TabList>
      <Box p={4} display="flex">
        <TabPanels>
          { /* Playgound Tab */ }
          <TabPanel>
            <Text fontSize="sm" color="grey">
              Code your Art, Run it and Mint as NFT
            </Text>
            <br />
            <HStack p={1} display='flex'>
              <Button onClick={handleRunScript} size='sm' colorScheme="green" isLoading={isLoading}>Run ▶️</Button>
              <Spacer />
              <Button onClick={() => sendCodeInput(script)} size='sm' colorScheme="cyan" isDisabled={!imageData} isLoading={isMinting}>
                        Mint ✨
              </Button> 
            </HStack>
            <Box display="flex" margin="auto" position="relative">
              <Editor
                    height="500px"
                    width="500px"
                    language="python"
                    value={script}
                    theme="vs-dark"
                    onChange={handleEditorValueChange}
                  />
                <br />

                <Box p='0' flex="1" textAlign="center">
                <div
                  style={{
                    border: '1px solid black',
                    width: '500px',
                    height: '500px',
                    margin: 'auto',
                    position: 'relative',
                  }}
                >
                  {imageData && (
                    <Stack>
                      <img
                        src={`data:image/png;base64,${imageData}`}
                        alt="Generated"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </Stack>
                  )}
                </div>
                <br />
                </Box>
            </Box>  
          </TabPanel>
          
          { /* Explore Tab */ }
          <TabPanel>
            <Accordion defaultIndex={[0]} allowMultiple>
            <Text fontSize="sm" color="grey">
              List of all the verifiable NFTs created via Turtlish 
            </Text>
            <br />
               {<Explore dappAddress={propos.dappAddress}/> }
            </Accordion>
          </TabPanel>

          { /* Guide Tab */ }
          <TabPanel>
                <Guide />
          </TabPanel>
        </TabPanels>
      </Box>
    </Tabs>
  );
};
