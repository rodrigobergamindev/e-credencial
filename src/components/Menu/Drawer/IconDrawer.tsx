
import {IconButton, Icon, HStack, Text} from "@chakra-ui/react";
import { ElementType } from "toasted-notes/node_modules/@types/react";
import {useState} from 'react'
import { RiArrowRightLine, RiArrowRightUpLine, RiMenuLine } from "react-icons/ri";
import {useSidebarDrawer} from '../../../contexts/SidebarDrawerContext'



export default function IconDrawer() {


    const { onOpen } = useSidebarDrawer()

    

    return (
        <HStack cursor="pointer" onClick={onOpen}>
        <Text letterSpacing={3} fontWeight="black" color="gray.700" fontSize={["sm","md"]} transition="all 0.3s ease-in-out" _hover={{color: 'gray.500'}}>MENU</Text>
        <IconButton
            aria-label="Open navigation"
            icon={<Icon as={RiMenuLine}/>}
            color="yellow.400"
            fontSize={["30","30"]}
            variant="ghost"
            mr={5}
            _active={{
                borderColor: "none",
              }}
            _focus={{
                borderColor: "none"
            }}
           _hover={{
               transform: "scaleY(1.2)",
               color:'gray.500'
           }}
            >
            </IconButton>
        </HStack>
    )
}