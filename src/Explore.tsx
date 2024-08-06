import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useRollups } from "./useRollups";
import { useNoticesQuery, useVoucherQuery } from "./generated/graphql";
import { Card, CardHeader, CardBody, CardFooter, Image, Stack, Heading } from '@chakra-ui/react'
import {
    Button,
    Text,
    Grid
  } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'

type Notice = {
    id: string;
    index: number;
    input: any, //{index: number; epoch: {index: number; }
    //payload: string;
    creator: string;
    image: string;
};

type IExplorePropos = {
    dappAddress: string
}
type LoadingStates = {
    [key: string]: boolean;
  };

export const Explore: React.FC<IExplorePropos> = (propos) => {
    const [result,reexecuteQuery] = useNoticesQuery();
    const { data, fetching, error } = result;
    const [loadingStates, setLoadingStates] = useState<LoadingStates>({});
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            reexecuteQuery({ requestPolicy: 'network-only' });
        }, 10000); 
        return () => clearInterval(intervalId);
    }, [reexecuteQuery]);

    if (fetching) return <p>Fetching...</p>;
    if (error) return <p>Error... {error.message}</p>;
    if (!data || !data.notices) return <p>No Notices</p>;

    const notices: Notice[] = data.notices.edges.map((node: any) => {
        const n = node.node;
        let inputPayload = n?.input.payload;
        if (inputPayload) {
            try {
                inputPayload = ethers.utils.toUtf8String(inputPayload);
            } catch (e) {
                inputPayload = inputPayload + " (hex)";
            }
        } else {
            inputPayload = "(empty)";
        }
        let payload = n?.payload;
        let creator = "(unknown)";
        let image = "(unknown)";
        if (payload) {
            try {
                payload = ethers.utils.toUtf8String(payload);
                try {
                    const parsedPayload = JSON.parse(payload);
                    creator = parsedPayload.creator || "(unknown)";
                    image = parsedPayload.image || "(unknown)";
                } catch (jsonError) {
                    // Handle cases where payload is not JSON
                    console.error("Failed to parse payload as JSON:", jsonError);
                    creator = "(unknown)";
                    image = "(unknown)";
                }
            } catch (e) {
                payload = payload + " (hex)";
            }
        } else {
            payload = "(empty)";
        }
        return {
            id: `${n?.id}`,
            index: parseInt(n?.index),
            //payload: `${payload}`,
            creator: creator,
            image: image,
            input: n ? {index:n.input.index,payload: inputPayload} : {},
        };
    }).sort((a: Notice, b: Notice) => {
        if (b.input.index === a.input.index) {
            return b.index - a.index;
        } else {
            return b.input.index - a.input.index;
        }
    });

    // Function to toggle loading state for a specific card
    const toggleLoadingState = (cardId: number, isLoading: boolean) => {
        setLoadingStates((prevLoadingStates) => ({
        ...prevLoadingStates,
        [cardId]: isLoading,
        }));
    };

    // Function to open modal for a specific notice
    const openModal = (notice: Notice) => {
        setSelectedNotice(notice);
    };

    // Function to close modal
    const closeModal = () => {
        setSelectedNotice(null);
    };

    return (
        <div>
            {/* List all notices */}
            <Grid templateColumns='repeat(3, 1fr)' gap={6}>
                {notices.map((n: Notice) => (
                    <Card maxW='sm' marginBottom='5' key={`${n.input.index}-${n.index}`}>
                        <CardBody color={'grey'}>
                            <Image
                                src={`data:image/png;base64, ${n.image}`}
                                borderRadius='lg'
                            />
                            <Text>{n.input.index}</Text>
                        </CardBody>
                        <CardFooter>
                            <Button onClick={() => openModal(n)}>Info</Button>
                        </CardFooter>
                    </Card>
                ))}
            </Grid>

            {/* Modal for the selected notice */}
            {selectedNotice && (
                <Modal isOpen={Boolean(selectedNotice)} onClose={closeModal}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{selectedNotice.input.index}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Image
                                src={`data:image/png;base64, ${selectedNotice.image}`}
                                borderRadius='lg'
                            />
                            <Text>Created by: {selectedNotice.creator}</Text>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={closeModal}>
                                Close
                            </Button>
                            <Button variant='ghost'>Buy</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
};
