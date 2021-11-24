import { Checkbox, Divider, StackDivider, Button, Grid, List, ListItem, HStack, VStack, Heading, Stack, Box, Flex,Text, Icon, IconButton, Image as ChakraImage, useBreakpointValue} from '@chakra-ui/react'



import { GetStaticProps} from 'next'
import {useState} from 'react'


import Logo from '../../components/Home/Header/Logo'
import Image from 'next/image'
import {prisma} from '../../../db'
import SearchBox from '../../components/Home/Header/SearchBox'
import Link from 'next/link'
import { motion } from "framer-motion";
import Head from 'next/head'
import { RiArrowDownCircleFill, RiArrowDownSLine } from 'react-icons/ri'



export default function Anuncios({anuncios}) {
    if(!anuncios) return null

    const [anunciosToShow, setAnuncios] = useState(anuncios)
    const [novos, setNovos] = useState(false)
    const [seminovos, setSeminovos] = useState(false)


    const MotionGrid = motion(Grid)
    const MotionBox = motion(Stack)

    const isWideVersion = useBreakpointValue ({
        base: false,
        lg: true
      })

    const container = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            delayChildren: 0.5,
            staggerChildren: 0.3
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

   
  const filterBySearch = valueToSearch => {
    setAnuncios(anuncios)

    const search = valueToSearch.toUpperCase()
    
    if(search !== ''){
        
        const carrosSearched = anuncios.filter(anuncio => anuncio.name.toUpperCase().includes(search))
        setAnuncios(carrosSearched)
    }
  }



  const filterByCheckBox = event => {

    //NOVOS
    if(event.value === "Novos") {
        setNovos(event.checked)

        if(event.checked) {
            if(seminovos) {
                setAnuncios(anuncios)
            }
    
            if(!seminovos){
                
                const novos = anuncios.filter(anuncio => anuncio.condicao === "Novo")
                
                setAnuncios(novos)
            }
        }

        if(event.checked === false) {
            if(seminovos) {
                const seminovos = anuncios.filter(anuncio => anuncio.condicao === "Seminovo")
                
                setAnuncios(seminovos)
            }
    
            if(!seminovos){
                setAnuncios(anuncios)
            }
        }

        
    }

    //SEMINOVOS
    if(event.value === "Seminovos") {
        setSeminovos(event.checked)

        if(event.checked) {
            if(novos) {
                setAnuncios(anuncios)
            }
    
            if(!novos){
                const seminovos = anuncios.filter(anuncio => anuncio.condicao === "Seminovo")
                
                setAnuncios(seminovos)
            }
        }

        if(event.checked === false) {
            if(novos) {
                const novos = anuncios.filter(anuncio => anuncio.condicao === "Novo")

                setAnuncios(novos)
            }
    
            if(!novos){
                setAnuncios(anuncios)
            }
        }
        
    }
  }
  


    
    return (
        <Box as={Flex} w="100%" direction="column">
             <Head>
            <title>Veículos</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <Flex 
            align="center" 
            justify="center"
            width="100%"
            h="25rem"
           
            position="relative"
            direction="column"
            mt={["3.5rem","4.5rem"]}
            >
            
                
            <ChakraImage
                   as={Image}
                   src="/img/bg-veiculos.jpg"
                    alt="header"
                     layout="fill"
                     objectFit="cover"
                     width="100%"
                    height="100%"
                      priority
                     transition="all 0.3s ease-in-out"
                     border="solid"
                     filter="brightness(0.6)"
                     zIndex={-1}
                     />

            <VStack  justify="center" height="100%">
                <Box zIndex={333}>
                    <Logo size={!!isWideVersion ? 450 : 300}/>
                </Box>

            </VStack>

            <HStack px={6} justify="center" width="100%" py={["2rem",10]}>
              
                <Heading fontWeight="light" fontSize={["3xl","5xl"]} color="gray.200" p={3}>ESTOQUE</Heading>
   
            </HStack>

            </Flex>

          
            

            <Box mb={20} flex="1" as={Flex} direction="column" width="100%" backgroundColor="gray.900" alignItems="center" justifyContent="center" p={25}>

        


            {!!isWideVersion && <HStack px={4} py={3} borderLeft="10px solid" borderLeftColor="yellow.400" bg="gray.100"  width="100%" maxWidth="1400px"  justify="flex-start" align="center" spacing={10} mb={20}>
            <HStack align="center" color="gray.900" >
                <Text fontSize="lg">Filtrar por:</Text>

                <Checkbox size="lg" colorScheme="yellow" value="Novos" onChange={(e) => filterByCheckBox(e.target)}>
                    Novos
                </Checkbox>

                <Checkbox size="lg" colorScheme="yellow" value="Seminovos" onChange={(e) => filterByCheckBox(e.target)}>
                    Seminovos
                </Checkbox>
            </HStack>
            <SearchBox filter={filterBySearch} />

            <Text fontSize="2xl" color="gray.900" justifySelf="flex-end"><strong style={{color:"#D69E2E"}}>{anunciosToShow.length}</strong> veículos disponíveis</Text>
            </HStack>}


            {!isWideVersion && 
            <VStack spacing={30}  mb={20}>
                <SearchBox filter={filterBySearch} />
                <HStack p={4} align="center" color="gray.900" borderLeft="10px solid" borderLeftColor="yellow.400" bg="gray.100"  width="100%" maxWidth="1400px"  justify="flex-start" >
                <Text fontSize="md">Filtrar por:</Text>

                <Checkbox size="md" colorScheme="yellow" value="Novos" onChange={(e) => filterByCheckBox(e.target)}>
                    Novos
                </Checkbox>

                <Checkbox size="md" colorScheme="yellow" value="Seminovos" onChange={(e) => filterByCheckBox(e.target)}>
                    Seminovos
                </Checkbox>
                    </HStack>

            </VStack>
            }


            <MotionGrid variants={container} initial="hidden" animate="visible" templateColumns={["repeat(1,1fr)","repeat(4,1fr)"]} width="100%" height="100%" maxWidth="1400px" gap={7}>

            {anunciosToShow.map(anuncio => (
                <Link href={`/anuncios/${anuncio.slug}`} key={anuncio.id}>

                <MotionBox
                variants={item} 
                position="relative" 
                spacing={0} 
                height={["450px","450px" ]}
                alignItems="center" 
                justifyContent="flex-end" 
                overflow="hidden" 
                cursor="pointer"
                transition="all 0.3s ease-in-out"
                boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
                borderRadius="5px"
                >
                    
                    <ChakraImage
                    
                    src={anuncio.image[0]}
                    alt={anuncio.name}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                   
                    
                    filter={["brightness(1.1)","brightness(0.7)"]}
                    transition="all 0.3s ease-in-out"
                    _hover={{
                     transform: "scale(1.1)",
                     filter:"brightness(1.1)"
                 }}
                    />
                    
                    
                    <Stack bg="yellow.400" color="gray.900" zIndex={2} width="100%" direction="column" px={6} py={3} >
                             <Heading fontSize={["md","lg"]} fontWeight="bold" letterSpacing={2}>{anuncio.name.toUpperCase()}</Heading>
                             <Text fontSize={["md","lg"]}>{anuncio.versao}</Text>
                     
                             <Stack  direction="row" justifyContent="space-between">
                                  <Text fontSize={["md","lg"]} alignSelf="flex-end" fontWeight="light" >{anuncio.ano_fabricacao}</Text>
                              
                                 <Text fontSize={["md","lg"]} fontWeight="bold">{`${anuncio.valor},00`}</Text>
                             </Stack>
                             </Stack>
                </MotionBox>
                </Link>
            ))}
            </MotionGrid>
            </Box>

        </Box>
    )
}




export const getStaticProps: GetStaticProps = async (context) => {

    
    

    const data = await prisma.anuncio.findMany()

    const anuncios = await JSON.parse(JSON.stringify(data))
   
    return {
      props: {
         anuncios
      },
      revalidate: 5
    }
  }


  
