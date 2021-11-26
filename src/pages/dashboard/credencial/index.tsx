import { Box, Flex, Heading, Button, Icon, Table, Thead, Tr, Th, Td, Tbody, Text, useBreakpointValue } from "@chakra-ui/react";
import { RiAddLine, RiCloseLine, RiPencilLine } from "react-icons/ri";
import  Header  from "../../../components/Header/index"
import  Siderbar  from "../../../components/Sidebar/index";
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import {useState} from 'react'



import { getSession } from "next-auth/client"
import { motion } from "framer-motion";
import { useRouter } from "next/router";


import {prisma} from '../../../../db'
import Head from 'next/head'




export default function AnuncioList() {
    
    const container = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
          }
        }
      };
      
      const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1
        }
      };

      const MotionTable = motion(Table)
      const MotionTr = motion(Tr)


    
    const router = useRouter()

    
    


    async function handleRemoveAnuncio(anuncio) {

        const response = await fetch('/api/anuncios/delete', {
            method: "DELETE",
            body: JSON.stringify(anuncio)
        })
        
        
        if(!response.ok) {
            throw new Error(response.statusText)
        }

        if(response.ok) {
            router.push('/dashboard/anuncios')
        }
        
    }

    
   
    
    
/** 
        const carValues = initialValues.map(anuncio => (
            parseFloat(anuncio.valor.replace('.','').replace('R$','').replace(' ',''))
          ))

       
        const totalStock = carValues.reduce((total, valorAtual) => {
            return total + valorAtual
            }, 0)
    
        
 */    

      
    const isWideVersion = useBreakpointValue ({
        base: false,
        lg: true
    })

   
    return (
        <Box>
            <Head>
            <title>Credenciais</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Header/>
            
            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">

                <Siderbar/>

                <Box flex="1" borderRadius={8} bg="gray.800" p="8">

                    <Flex mb="8" justify="space-between" align="center">
                        
                        <Heading size="lg" fontWeight="normal">Credenciais</Heading>

                        <Flex  justify="flex-end" align="center" alignSelf="flex-end" justifySelf="flex-end" >

                        <Text color="yellow.400" fontWeight="bold" fontSize="20px">
                            Total: 125 ativas - 30 vencidas
                            </Text>
                        <Link href="/dashboard/anuncios/create" passHref><Button as="a" ml={10} size="sm" fontSize="sm" colorScheme="blue" leftIcon={<Icon as={RiAddLine} fontSize="20"></Icon>}>Criar novo</Button></Link>

                        </Flex>
                    </Flex>
                
                <MotionTable
                colorScheme="whiteAlpha"
                initial="hidden"
                animate="visible"
                variants={container}
                >
                    <Thead>
                        <MotionTr variants={item}>
                            <Th px={["4","4","6"]} width="8">
                               EMISSÃO
                            </Th>

                            <Th>
                                RO
                            </Th>

                            <Th>
                                NOME
                            </Th>

                            <Th> Data de Criação</Th>

                            <Th> Emitido por</Th>

                            <Th width="8">
                                
                            </Th>

                            <Th width="8">
                                
                            </Th>
                        </MotionTr>
                    </Thead>
                    <Tbody>
              
               
                        
                    <MotionTr variants={item}>
                        <Td px={["4","4","6"]}>
                        <Text fontWeight="bold" fontSize="sm" color="gray.300">19/06/2021</Text>
                        </Td>

                        <Td>
                            
                            <Text fontWeight="bold" fontSize="sm">1234</Text>
                         
                        </Td>

                        <Td>
                            <Link href={`/dashboard/anuncios/editar/1234`} passHref>
                            <Box  cursor="pointer">
                                <Text fontWeight="bold" fontSize="sm">José da Silva</Text>
                                {!!isWideVersion && <Text fontWeight="bold" fontSize="sm" color="gray.300">
                                    Presbítero
                                    </Text>}
                            </Box>
                            </Link>
                        </Td>


                        

                        {!!isWideVersion && <Td> {new Date(Date.now()).toLocaleDateString('pt-BR', {
                                     day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                    })}</Td>}

                        <Td>
                            <Text fontWeight="bold" fontSize="sm">Rodrigo Bergamin</Text>
                        </Td>
                        <Td>
                        {!!isWideVersion && <Link href={'/dashboard/anuncios/editar/123443'} passHref><Button as="a" size="sm" fontSize="sm" colorScheme="blue" leftIcon={<Icon as={RiPencilLine} fontSize="20"></Icon>}>Editar</Button></Link>}
                        
                        </Td>
                        <Td>
                        {!!isWideVersion && <Button onClick={() => console.log('botão de remover')} size="sm" fontSize="sm" colorScheme="red" leftIcon={<Icon as={RiCloseLine} fontSize="20"></Icon>}>Remover</Button>}
                        </Td>
                        
                    </MotionTr>
                
                
                </Tbody>
                </MotionTable>

                
                </Box>

            </Flex>
        </Box>
    )
}


/**export const getServerSideProps: GetServerSideProps = async({req}) => {

    const data_anuncios = await prisma.anuncio.findMany()

    const initialValues = await JSON.parse(JSON.stringify(data_anuncios))
    
    const session = await getSession({req})
   
 
    if(!session) {
        return {
            redirect: {
                destination: `/login`,
                permanent: false
            }
        }
    }

    
    return {
      props: {
          initialValues
        },
    }
  }
  */