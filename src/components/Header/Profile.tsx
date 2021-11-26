import {Flex, Text, Box, Avatar} from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/client'




export default function Profile () {
   
   const [session] = useSession()

   
    return (
        <Flex align="center">
            

                    <Box mr="4" textAlign="right">
                        <Text>Rodrigo Bergamin</Text>
                        <Text color="gray.300" fontSize="small">Departamento de Cadastro</Text>
                        <Text color="gray.300" fontSize="small">{!!session && session.user.email}</Text>
                        <Text as="button" color="yellow.400" fontSize="small" onClick={(): Promise<void> => signOut({ callbackUrl: 'http:/localhost:3000/'})}>Sair</Text>
                    </Box>
         

            <Avatar
                size="lg"
                name="Administrador"
                src={!!session && session.user.image}
            >

            </Avatar>
            </Flex>
    )
}