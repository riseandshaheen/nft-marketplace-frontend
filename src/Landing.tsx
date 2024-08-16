import { FC } from "react";
import { Box, Heading, Stack, Text, Image } from "@chakra-ui/react";
import heroImage from "./assets/hero-image.png"

export const Landing: FC = () => {
    return(
        <Box mt='20' alignContent={"center"}>
                <Stack>
                    <Heading>Turtlish! 🐢 🖼️ </Heading>
                    <Text color={'grey'}>
                        Generate verifiable art NFTs with Python code. 🚀 
                        <br />
                        <br />
                        <Image boxSize='300px' src={heroImage} />
                    </Text>
                </Stack>
            </Box>
    )
}