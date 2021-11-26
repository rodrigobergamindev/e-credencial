import { Icon, Image, FormLabel, FormControl, FormErrorMessage, Grid, Box, Flex, VStack, 
    Heading, SimpleGrid, Divider, HStack, Button, Text, Input as ChakraInput, Select, Spinner} from "@chakra-ui/react";


import { Input } from "../../../components/Form/Input";
import  Header  from "../../../components/Header";
import  Siderbar  from "../../../components/Sidebar/index"
import Link from 'next/link'

import {useForm, SubmitHandler, useFieldArray, Control} from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.umd';


import { getSession } from "next-auth/client"
import { GetServerSideProps } from 'next'

import { insert } from '../../api/photos'
import { useRouter } from "next/router";
import {useState} from 'react'
import { RiAddLine, RiCheckFill, RiCheckLine, RiSubtractLine, RiCloseLine, RiUploadCloudLine} from "react-icons/ri";
import CurrencyInput from 'react-currency-input-field';
import InputMask from 'react-input-mask';
import {prisma} from '../../../../db'
import Head from 'next/head'

import imageCompression from 'browser-image-compression'
import axios from "axios";

type CreateCredencialFormData = {
    name: String;
    cpf: String;
    rg: String;
    ro: String;
    consagracao: String;
    taxa: String;
  }




  const createCredencialFormSchema = yup.object({
    name: yup.string().required('Nome obrigatório'),
    cpf: yup.string().required('CPF obrigatório'),
    rg: yup.string().required('RG obrigatório'),
    ro: yup.string().required('RO obrigatório'),
    consagracao: yup.date().required('Data de consagração obrigatória'),
    taxa: yup.string().required('Taxa obrigatória'),
    image: yup.mixed().required()
  })




export default function CreateCredencial() {

    const[imagePreview, setImagePreview] = useState(null)
    const [loadingPreview, setLoadingPreview] = useState(false)

    const router = useRouter()

    const {register,control, handleSubmit, formState, watch} = useForm({
        resolver: yupResolver(createCredencialFormSchema)
    })


    const {errors} = formState
    
    
    const handleCreateCredencial: SubmitHandler<CreateCredencialFormData> = async (values) => {
        
        const credencial = {...values}
        await saveCredencial(credencial, imagePreview.file)
        
    }

    
    async function saveCredencial(credencial, image) { 
        
        let formData = new FormData()
        formData.append("image", image)
        formData.append("data", JSON.stringify(credencial))
   

       const response = await axios.post("http://localhost:3000/api/credencial/create", formData)
       
        console.log(response)
        
    }



    const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      }


    const handleImage =  async (event: React.ChangeEvent<HTMLInputElement>) => {
       
        
        
            const data = event.target.files[0]
           
            
            if(data.type.includes("image")) {
                const file = await imageCompression(data, options)
                const reader = new FileReader()
                
               
                reader.readAsDataURL(file)
                reader.onload = () => setLoadingPreview(true)
                reader.onloadend = async () => {
                
                    
                const preview = reader.result
                const image = {preview, file}
                
                setImagePreview(image)

                setTimeout(() => setLoadingPreview(false), 3000)
                
            }
            
            return null
            }
        
    }


        
    async function handleRemoveImage(image) {
        
        if(image) {
           const newImages = imagePreview.filter(newImage => newImage.file.name != image.file.name)
           setImagePreview(newImages)
        }

       
       
   }


    
   
    return (
        <Box>
            <Head>
            <title>Emitir Credencial</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Header/>
            
            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">

                <Siderbar/>

                
                    <Box 
                    as="form"
                    flex="1" 
                    borderRadius={8} 
                    bg="gray.800" p={["6","8"]}
                    onSubmit={handleSubmit(handleCreateCredencial)}
                    >
    
                    <Heading size="lg" fontWeight="normal">Emitir Credencial</Heading>
    
                    <Divider my="6" borderColor="gray.700"/>

                    <HStack>

                    <VStack mr={5} alignItems="center" justifyContent="center">
                    <Box border="1px dashed" width="250px" height="250px">
                        {!!imagePreview && <Image src={imagePreview.preview as string} width="100%" height="100%"/>}
                    </Box>

                 
                    <FormControl isInvalid={!!errors.image}>
                        <FormLabel 
                        htmlFor="image"
                        >
                          <Box alignSelf="center" justifySelf="center" width="100%" bg="blue.500" borderRadius="5px" p={2} display="flex" alignItems="center" justifyContent="center" cursor="pointer" transition="all 0.3s ease-in-out" _hover={{opacity: 0.88}}>
                              <Icon mr={3}  alignSelf="center" fontSize="2xl" as={RiUploadCloudLine}/>
                              <Text fontSize="lg">Escolher imagem</Text>
                              
                              </Box>
                              
                            
                        
                        </FormLabel>
                        <ChakraInput 
                            p={1}
                            {...register('image')} 
                            name="image" 
                            id="image" 
                            type="file" 
                            variant="filled"
                            multiple={false}
                            accept="image/jpeg, image/png, image/jpg, image/webp"
                            bgColor="gray.900"
                            display="none"
                           
                            _hover={{
                                bgColor: 'gray.900'
                            }}
                            size="lg" 
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleImage(event)}
                            />

                             {!!errors.image && (
                                <FormErrorMessage>
                                {errors.image.message}
                                </FormErrorMessage>
                             )}
                              
                        </FormControl>
                       
                    </VStack>

                    <VStack flex="1" spacing="8">
                    <Heading size="sm" fontWeight="bold" color="gray.300" alignSelf="flex-start">INFORMAÇÕES PESSOAIS</Heading>
                        <SimpleGrid minChildWidth="240px" spacing={["6","8"]} width="100%">
                            
                            

    
                            <Input name="name" label="Nome" error={errors.name} {...register('name')}/>

                            <FormControl isInvalid={!!errors.cpf}>
                            <FormLabel 
                            htmlFor="cpf"
                            >
                               CPF
                            </FormLabel>
    
                            <ChakraInput
                             {...register('cpf')}
                            as={InputMask}
                            bgColor="gray.900" 
                            _hover={{bgColor: 'gray.900'}} 
                            focusBorderColor="yellow.400"  
                            variant="filled"
                            placeholder="CPF"
                            name="cpf" 
                            id="cpf" 
                            type="text" 
                            size="lg"
                            mask="999.999.999-99"
                            
                            />
                          
                            {!!errors.cpf && (
                                    <FormErrorMessage>
                                    {errors.cpf.message}
                                    </FormErrorMessage>
                                 )}
                            
                           </FormControl>

                           <Input name="rg" label="RG" error={errors.rg} {...register('rg')}/>
                            
                          
    
                        </SimpleGrid>

                         
    
                        <Heading size="sm" fontWeight="bold" color="gray.300" alignSelf="flex-start">INFORMAÇÕES INSTITUCIONAIS</Heading>
                        <SimpleGrid minChildWidth="240px" spacing={["6","8"]} width="100%">
                            
                        <Input name="ro" label="RO" error={errors.ro} {...register('ro')}/>

                        <FormControl isInvalid={!!errors.consagracao}>
                            <FormLabel 
                            htmlFor="consagracao"
                            >
                                Data de Consagração
                            </FormLabel>
                            
                            <ChakraInput
                            {...register('consagracao')}
                            bgColor="gray.900" 
                            _hover={{bgColor: 'gray.900'}} 
                            focusBorderColor="yellow.400"  
                            variant="filled" 
                            name="consagracao" 
                            id="consagracao" 
                            type="date" 
                            size="lg"
                            />
                         
                            {!!errors.consagracao && (
                                    <FormErrorMessage>
                                    {errors.consagracao.message}
                                    </FormErrorMessage>
                                 )}
                            
                            </FormControl>

                            
                        <FormControl isInvalid={!!errors.taxa}>
                            <FormLabel 
                            htmlFor="taxa"
                            >
                                Taxa
                            </FormLabel>
                            
                            <ChakraInput
                             {...register('taxa')}
                            as={CurrencyInput}
                            bgColor="gray.900" 
                            _hover={{bgColor: 'gray.900'}} 
                            focusBorderColor="yellow.400"  
                            variant="filled" 
                            name="taxa" 
                            id="taxa" 
                            type="text" 
                            size="lg"
                            allowNegativeValue={false}
                            disableAbbreviations={true}
                            allowDecimals={false}
                            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                            />
                         
                            {!!errors.taxa && (
                                    <FormErrorMessage>
                                    {errors.taxa.message}
                                    </FormErrorMessage>
                                 )}
                            
                            </FormControl>
    
                        </SimpleGrid>
                    

                        <SimpleGrid minChildWidth="240px" spacing={["6","8"]} width="100%">
                        
                
                        
                </SimpleGrid>
                    </VStack>


                                
                   
                    </HStack>
                    <Flex mt="8" justify="flex-end">
                        <HStack spacing="4">
                        <Link href="/dashboard/credencial" passHref><Button colorScheme="whiteAlpha">Cancelar</Button></Link>
                            <Button type="submit" colorScheme="blue" isLoading={formState.isSubmitting}>Emitir</Button>
                        </HStack>
                    </Flex>
                    </Box>
              
                
            </Flex>
        </Box>
    )
}


export const getServerSideProps: GetServerSideProps = async({req}) => {


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
         session,
        }
    }
  }
  