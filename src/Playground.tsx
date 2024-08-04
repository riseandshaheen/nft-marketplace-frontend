// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import React, { useState } from "react";
import { ethers } from "ethers";
import { useRollups } from "./useRollups";
import { useWallets } from "@web3-onboard/react";
import {
  IERC1155__factory,
  IERC20__factory,
  IERC721__factory,
} from "./generated/rollups";
import { Tabs, TabList, TabPanels, TabPanel, Tab, Link } from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Button, ButtonGroup, Box } from "@chakra-ui/react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { Input, HStack, Stack, Flex } from "@chakra-ui/react";
import {
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Text, Select } from "@chakra-ui/react";
import { Vouchers } from "./Vouchers";
import { Notices } from "./Notices";
import { Reports } from "./Reports";
import { Mint } from "./Mint";
import {Listings} from "./Listings";
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

  
  const depositEtherToPortal = async (amount: number) => {
    try {
      if (rollups && provider) {
        const data = ethers.utils.toUtf8Bytes(`Deposited (${amount}) ether.`);
        const txOverrides = { value: ethers.utils.parseEther(`${amount}`) };
        console.log("Ether to deposit: ", txOverrides);

        // const tx = await ...
        rollups.etherPortalContract.depositEther(
          propos.dappAddress,
          data,
          txOverrides
        );
      }
    } catch (e) {
      console.log(`${e}`);
    }
  };

  const withdrawEther = async (amount: number) => {
    try {
      if (rollups && provider) {
        let ether_amount = ethers.utils.parseEther(String(amount)).toString();
        console.log("ether after parsing: ", ether_amount);
        const input_obj = {
          method: "ether_withdraw",
          args: {
            amount: ether_amount,
          },
        };
        const data = JSON.stringify(input_obj);
        let payload = ethers.utils.toUtf8Bytes(data);
        await rollups.inputContract.addInput(propos.dappAddress, payload);
      }
    } catch (e) {
      console.log(e);
    }
  };
  

  const transferNftToPortal = async (
    contractAddress: string,
    nftid: number
  ) => {
    try {
      if (rollups && provider) {
        const data = ethers.utils.toUtf8Bytes(
          `Deposited (${nftid}) of ERC721 (${contractAddress}).`
        );
        //const data = `Deposited ${args.amount} tokens (${args.token}) for DAppERC20Portal(${portalAddress}) (signer: ${address})`;
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const erc721PortalAddress = rollups.erc721PortalContract.address;

        const tokenContract = signer
          ? IERC721__factory.connect(contractAddress, signer)
          : IERC721__factory.connect(contractAddress, provider);

        // query current approval
        const currentApproval = await tokenContract.getApproved(nftid);
        if (currentApproval !== erc721PortalAddress) {
          // Allow portal to withdraw `amount` tokens from signer
          const tx = await tokenContract.approve(erc721PortalAddress, nftid);
          const receipt = await tx.wait(1);
          const event = (
            await tokenContract.queryFilter(
              tokenContract.filters.Approval(),
              receipt.blockHash
            )
          ).pop();
          if (!event) {
            throw Error(
              `could not approve ${nftid} for DAppERC721Portal(${erc721PortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`
            );
          }
        }

        // Transfer
        rollups.erc721PortalContract.depositERC721Token(
          contractAddress,
          propos.dappAddress,
          nftid,
          "0x",
          data
        );
      }
    } catch (e) {
      console.log(`${e}`);
    }
  };

  const handleEditorValueChange = (value: string|undefined) => {
    setScript(value)
  }

  const [input, setInput] = useState<string>("");
  const [dappRelayedAddress, setDappRelayedAddress] = useState<boolean>(false)
  const [hexInput, setHexInput] = useState<boolean>(false);
  const [script, setScript] = useState<string|undefined>('# Add code here');
  const [imageData, setImageData] = useState('');
  const [isMintEnabled, setIsMintEnabled] = useState(false);

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
        <Tab>🎟️ Mint</Tab>
        <Tab>🌏 Explore</Tab>
        <Tab>📝 Guide</Tab>
      </TabList>
      <Box p={4} display="flex">
        <TabPanels>
          { /* Playgound */}
          <TabPanel>
            <Text fontSize="sm" color="grey">
              Code your Art, run the code and Mint as NFT.
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

                <Box flex="1" textAlign="center">
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

          <TabPanel>
            <Accordion defaultIndex={[0]} allowMultiple>
            <Text fontSize="sm" color="grey">
              After the withdraw request, the user has to execute a voucher to transfer assets from Cartesi dApp to their account. 
            </Text>
            <br />
               {/* dappRelayedAddress && <Vouchers dappAddress={propos.dappAddress} /> */}
               {<Mint dappAddress={propos.dappAddress}/> }
            </Accordion>
          </TabPanel>
          <TabPanel>
            <Listings dappAddress={propos.dappAddress}/>
          </TabPanel>
          <TabPanel>
                <Guide />
          </TabPanel>
        </TabPanels>
      </Box>
    </Tabs>
    //</div>
  );
};
