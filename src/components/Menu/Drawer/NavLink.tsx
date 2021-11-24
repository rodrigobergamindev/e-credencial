
import {Box,Stack, Text, Link as ChakraLink, Icon, LinkProps as ChakraLinkProps, useBreakpointValue} from "@chakra-ui/react";
import { ElementType } from "toasted-notes/node_modules/@types/react";
import ActiveLink from '../../ActiveLink'
import {useState} from 'react'
import { RiArrowRightLine, RiArrowRightUpLine } from "react-icons/ri";



interface NavLinkProps extends ChakraLinkProps {
    icon: ElementType;
    children: string;
    href: string;
}

export default function NavLink({icon, children,href, ...rest}: NavLinkProps) {

    const[active,setActive] = useState(false)

    const isWideVersion = useBreakpointValue ({
        base: false,
        lg: true
    })
    
    

    return (
        <ActiveLink href={href} passHref>
        <ChakraLink display="flex" variant="unstyled" align="center" justify="center" _hover={{}} onMouseOver={() => setActive(true)} onMouseLeave={() => setActive(false)} {...rest}>
        <Stack width={["100%","350px"]} direction="row" align="center">
            <Text letterSpacing={2} fontSize={["4xl","6xl"]} fontWeight="semibold" borderBottom="solid" borderColor="transparent" transition="all 0.3s ease-in-out" _hover={{
            borderBottom:"solid",
            borderColor:"yellow.400"
        }}>{children}</Text>

        {!!isWideVersion && <Icon 
        color="yellow.400"
        fontSize="6xl"
        as={RiArrowRightLine}
        transform={`${active? "translateX(50%)": "translateX(0%)"}`}
        transition="all 0.2s ease-in-out"
        visibility={`${active? "visible": "hidden"}`}
        />}
        </Stack>
        </ChakraLink>
        </ActiveLink>
    )
}