import { Box, ListItem, Text, UnorderedList, Code, Badge, Divider, Link } from "@chakra-ui/react"

export const Guide: React.FC = () => {
    
    return(
        <Box alignContent='left'>
            <Text fontSize='3xl' align='left'>▶️ Getting started</Text>
            <Text fontSize='l' align='left'>Creating your first Turtlish drawing is pretty simple. You've to write Python code with Turtle commands. Start by instantiating Turtlish() class as shown below.</Text>
            <Code colorScheme='green'>MyTurtle = Turtlish()</Code>
            <br/><br/>
            <Text fontSize='l' align='left'>Next, we can write commands to move our turtle within the defined area of <Badge>500x500 pixels</Badge>. Default position of the Turtle is at the center of the canvas: (0,0). To move the turtle forward by 50 pixels, we code as below:</Text>
            <Code colorScheme='green'>MyTurtle.forward(50)</Code>
            <br/><br/>
            <Text fontSize='l' align='left'> If you run above two lines of code, that should give you a straight line of 50 pixels. Try drawing a rectangle now with commands listed below. Hint: To make turns, you can use right or left command. Both of these commands take degrees to turn as parameter. If you add the line below, our turtle will make a sharp 90 degrees right turn.</Text>
            <Code colorScheme='green'>MyTurtle.right(90)</Code>
            <br/><br/>
            <Text fontSize='l' align='left'> Congrats! 🎉 That's all the basics you need. Explore <Link color='green.500' href="https://github.com/riseandshaheen/turtlish">more examples</Link> in this repo to get inspired.</Text>

            
            <br/><br/>
            <Divider/>
            <br/>
            <Text fontSize='3xl' align='left'>▶️ Commands</Text>
            <Text fontSize='l' align='left'>
                <UnorderedList>
                    <ListItem>Simple Movement(with aliases) <br/>
                        <Code colorScheme='blue'>forward(number_of_pixels)</Code> or <Code colorScheme='blue'>fd(number_of_pixels)</Code><br/>
                        <Code colorScheme='blue'>backward(number_of_pixels)</Code> or <Code colorScheme='blue'>bk(number_of_pixels)</Code><br/>
                        <Code colorScheme='blue'>right(degrees)</Code> or <Code colorScheme='blue'>rt(degrees)</Code><br/>
                        <Code colorScheme='blue'>left(degrees)</Code> or <Code colorScheme='blue'>lt(degrees)</Code><br/>
                        <Code colorScheme='blue'>penup()</Code> <br/>
                        <Code colorScheme='blue'>pendown()</Code> <br/> <br/>
                                                 
                    </ListItem>
                    <ListItem>Advance Movement <br/>
                        <Code colorScheme='blue'>goto(x-value, y-value)</Code> <br/>
                        <Code colorScheme='blue'>setx(value)</Code> <br/>
                        <Code colorScheme='blue'>sety(value)</Code> <br/>
                        <Code colorScheme='blue'>circle(radius, degrees)</Code> <br/>  
                    </ListItem>
                </UnorderedList>
            </Text>
        </Box>
    )
}