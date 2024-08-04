import { Box, ListItem, Text, UnorderedList, Tag } from "@chakra-ui/react"
//import Markdown from 'react-markdown'
//import file from "./guide.md"
import { useEffect, useState } from "react";

export const Guide: React.FC = () => {
    const [ content, setContent ] = useState("")
    
    return(
        <Box>
            <Text fontSize='l' align='left'>
                <UnorderedList>
                    <ListItem>Simple Movement - forward(value) backward(value) right(degrees) left(degrees) penup pendown                       
                    </ListItem>
                    <ListItem>Advance Movement - goto(x-value, y-value) setx(value) sety(value)</ListItem>
                    <ListItem>Shapes - circle(radius, degrees)</ListItem>
                    <ListItem>Drawing - begin_fill end_fill</ListItem>
                    <ListItem>Pen - pensize(value)</ListItem>
                </UnorderedList>
            </Text>
        </Box>
    )
}