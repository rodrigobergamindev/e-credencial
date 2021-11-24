import { useBreakpointValue, VStack, Box, Stack, Icon, Divider, Text, Heading, HStack } from "@chakra-ui/react";
import { RiFacebookBoxFill, RiWhatsappLine, RiCarLine,RiHomeLine, RiInstagramLine, RiMessageLine, RiGpsLine } from "react-icons/ri";
import NavLink from "./NavLink";
import {SiTelegram} from 'react-icons/si'


export function SidebarNav() {

    const isWideVersion = useBreakpointValue ({
        base: false,
        lg: true
    })

    return (
        <Stack flex="1" align="flex-start" justify="center" >
            
            <VStack align={["center","flex-start"]} justify="center" width="100%" flex="1" p={[2,20]}>
            {!isWideVersion && <Heading letterSpacing={4} mb={5} color="gray.500" fontSize="sm">MENU</Heading>}
                <NavLink icon={RiHomeLine} href="/">Home</NavLink>
                <NavLink icon={RiCarLine} href="/anuncios">Veículos</NavLink>
                <NavLink icon={RiMessageLine} href="/dashboard">Dashboard</NavLink>
                {!isWideVersion && <Stack p={5} direction="column" alignItems="center"  width="100%" >
            
            <HStack py={5}>
            <a href="https://www.instagram.com/autocertocars/"rel="noreferrer" target="_blank">
                <Icon 
                fontSize="2xl" 
                color="gray.300"
                as={RiInstagramLine}
                transition="all 0.3s ease-in-out"
                cursor="pointer"
                _hover={{
                    color:"#D53F8C"
                }} 
                />
            </a>

            <a href="https://www.facebook.com/autocertocars/" rel="noreferrer" target="_blank">
                <Icon 
                fontSize="2xl" 
                color="gray.300" 
                as={RiFacebookBoxFill}
                transition="all 0.3s ease-in-out"
                cursor="pointer"
                _hover={{
                    color:"#3182CE"
                }}
                />
            </a>

            <a href="https://api.whatsapp.com/send?phone=5511963290492&text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20um%20ve%C3%ADculo."rel="noreferrer" target="_blank">
                <Icon fontSize="2xl" 
                color="gray.300" 
                as={RiWhatsappLine}
                transition="all 0.3s ease-in-out"
                cursor="pointer"
                _hover={{
                    color:"#38A169"
                }} 
                />
            </a>

            <a href="https://api.whatsapp.com/send?phone=5511963290492&text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20um%20ve%C3%ADculo."rel="noreferrer" target="_blank">
                <Icon as={SiTelegram} color="gray.300" fontSize="20" transition="all 0.3s ease-in-out" _hover={{color:"#00B5D8", transform:"rotateZ(360deg)"}}/></a>
            </HStack>

            <HStack>
            <Text color="yellow.400" fontSize="sm" align="center" fontWeight="light">Av. do Imperador, 4550 - São Miguel Paulista, São Paulo - SP</Text>
            </HStack>
            </Stack>}
            </VStack>
        

            {!!isWideVersion && <Stack p={5} direction="row" alignItems="center"  width="100%" >
            <a href="https://www.instagram.com/autocertocars/"rel="noreferrer" target="_blank">
                <Icon 
                fontSize="2xl" 
                color="gray.300"
                as={RiInstagramLine}
                transition="all 0.3s ease-in-out"
                cursor="pointer"
                _hover={{
                    color:"#D53F8C"
                }} 
                />
            </a>

            <a href="https://www.facebook.com/autocertocars/" rel="noreferrer" target="_blank">
                <Icon 
                fontSize="2xl" 
                color="gray.300" 
                as={RiFacebookBoxFill}
                transition="all 0.3s ease-in-out"
                cursor="pointer"
                _hover={{
                    color:"#3182CE"
                }}
                />
            </a>

            <a href="https://api.whatsapp.com/send?phone=5511963290492&text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20um%20ve%C3%ADculo."rel="noreferrer" target="_blank">
                <Icon fontSize="2xl" 
                color="gray.300" 
                as={RiWhatsappLine}
                transition="all 0.3s ease-in-out"
                cursor="pointer"
                _hover={{
                    color:"#38A169"
                }} 
                />
            </a>

            <Box flex="1" width="100px" height="1px" backgroundColor="gray.50"/>
            
            <Icon as={RiGpsLine}/><Text color="yellow.400" fontWeight="light">Av. do Imperador, 4550 - São Miguel Paulista, São Paulo - SP, 08050-000</Text>
            </Stack>}


            </Stack>
    )
}