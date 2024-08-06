import React, { useState } from "react";
import { ethers } from "ethers";
import { useRollups } from "./useRollups";
import { useWallets } from "@web3-onboard/react";
import { Tabs, TabList, TabPanels, TabPanel, Tab, Link } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Button, ButtonGroup, Box } from "@chakra-ui/react";
import { Input, HStack, Stack, Flex } from "@chakra-ui/react";
import {
  Image,
  Accordion,
} from "@chakra-ui/react";
import { Text, Select } from "@chakra-ui/react";
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
  const [script, setScript] = useState<string|undefined>('# Add code here');
  const [imageData, setImageData] = useState('');

  const sendCodeInput = async(script: string|undefined) => {
    try{
      await window.ethereum.enable();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        console.log("Account:", account)
        console.log("Script: ", script)
      
      // TODO: sanitize code before sending
      
      let dataObject = {
        method: "draw",
        code: script
      };
      if (rollups && provider){
        let jsonString = JSON.stringify(dataObject);
        console.log("JSON Input: ", jsonString)
        let payload = ethers.utils.toUtf8Bytes(jsonString);
        await rollups.inputContract.addInput(propos.dappAddress, payload);
      }
    }
    catch(e){console.log(`${e}`)}
  }

  const handleEditorValueChange = (value: string|undefined) => {
    setScript(value)
  }

  const handleRunScript = async () => {
    console.log("Running the script: ", script)
    try {
      const response = await fetch('http://127.0.0.1:5000/draw', {
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
        console.error('Error in drawing:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    };

  return (
    <Tabs variant="enclosed" size="lg" align="center" mt='0'>
      <TabList>
        <Tab>🐢 Code</Tab>
        <Tab>🌏 Explore</Tab>
        <Tab>📝 Guide</Tab>
      </TabList>
      <Box p={4} display="flex">
        <TabPanels>
          { /* Playgound */ }
          <TabPanel>
            <Text fontSize="sm" color="grey">
              Code your Art, run it and Mint as NFT.
            </Text>
            <br />
            <HStack p={1}>
              <Button onClick={handleRunScript} size='sm' colorScheme="green">Run ▶️</Button>
              <Button onClick={() => sendCodeInput(script)} size='sm' colorScheme="cyan" isDisabled={!imageData}>
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
          
          { /* Explore */ }
          <TabPanel>
            <Accordion defaultIndex={[0]} allowMultiple>
            <Text fontSize="sm" color="grey">
              List of all the verifiable NFTs created via Turtlish 
            </Text>
            <br />
               {<Explore dappAddress={propos.dappAddress}/> }
            </Accordion>
          </TabPanel>

          { /* Guide */ }
          <TabPanel>
                <Guide />
          </TabPanel>
        </TabPanels>
      </Box>
    </Tabs>
  );
};
