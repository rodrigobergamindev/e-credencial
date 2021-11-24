import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerCloseButton, DrawerBody, useBreakpointValue } from "@chakra-ui/react";
import { SidebarNav } from "./SidebarNav";

import {useSidebarDrawer} from '../../../contexts/SidebarDrawerContext'


export default function Siderbar() {

    const {isOpen, onClose, onOpen} = useSidebarDrawer()

    const isWideVersion = useBreakpointValue ({
        base: false,
        lg: true
    })
   
        return (
            <Drawer isOpen={isOpen}  onClose={onClose} placement="right" size="full">
            <DrawerOverlay>
                <DrawerContent bg="gray.800" p="4">
                    <DrawerCloseButton mt={6} mr={4} fontSize={["20","20"]} color="yellow.400"  variant="unstyled" _focus={{borderColor: "none"}}/>
                    <DrawerHeader>Ei</DrawerHeader>
                    <DrawerBody display="flex">
                        <SidebarNav/>
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
        
        )

    
  
}