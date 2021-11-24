import { Box, Flex, Text} from '@chakra-ui/react'


import {prisma} from '../../db'
import Head from 'next/head'



export default function Home() {

  
    
    return (
    
      
        <Box as={Flex} w="100%" direction="column">
           <Head>
            <title>e-Credencial - Convenção OBPC SP</title>
            </Head>
            <Text>Em Construção</Text>
        </Box>
       
    )
}




