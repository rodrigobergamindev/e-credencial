import { Box, Stack, useBreakpointValue, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerCloseButton, DrawerBody } from "@chakra-ui/react";
import { SidebarNav } from "./SidebarNav";

import {useSidebarDrawer} from '../../contexts/SidebarDrawerContext'

export default function Siderbar() {

    const {isOpen, onClose} = useSidebarDrawer()

    const isDrawerSidebar = useBreakpointValue({
        base: true,
        lg: false,
    })

    if(isDrawerSidebar) {
        return (
            <Drawer isOpen={isOpen} onClose={onClose} placement="left">
            <DrawerOverlay>
                <DrawerContent bg="gray.800" p="4">
                    <DrawerCloseButton mt="6"/>
                    <DrawerHeader>Navegação</DrawerHeader>

                    <DrawerBody>
                        <SidebarNav/>
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
        )
    }
    return(
        <Box as="aside" w="64" mr="8">
            <SidebarNav/>
        </Box>
    )
}