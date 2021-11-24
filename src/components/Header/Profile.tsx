import {Flex, Text, Box, Avatar} from '@chakra-ui/react'
import { signOut } from 'next-auth/client'




export default function Profile () {
   
   
    return (
        <Flex align="center">
            

                    <Box mr="4" textAlign="right">
                        <Text>Luiz Fernandes Bergamin Júnior</Text>
                        <Text color="gray.300" fontSize="small">Administrador</Text>
                        <Text color="gray.300" fontSize="small">autocertomultimarcas@gmail.com</Text>
                        <Text as="button" color="yellow.400" fontSize="small" onClick={(): Promise<void> => signOut({ callbackUrl: 'https://www.autocertocars.com.br/'})}>Sair</Text>
                    </Box>
         

            <Avatar
                size="lg"
                name="Administrador"
                src="/img/avatar.jpg"
            >

            </Avatar>
            </Flex>
    )
}