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

import {prisma} from '../../../../db'
import Head from 'next/head'

import imageCompression from 'browser-image-compression'


type CreateAnuncioFormData = {
    marca: string;
    modelo: string;
    ano_fabricacao: string;
    versao: string;
    numero_portas: string;
    cor: string;
    cores_internas: string;
    combustivel: string;
    carroceria: string;
    potencia: string;
    transmissao: string;
    quilometragem: string;
    valor: string;
    chave_copia: string;
    laudo_cautelar: string;
    manual_do_proprietario: string;
    opcionais: Opcional[];
    image: FileList;
    condicao: string;
  }

type ImagePreview = {
    preview: string | ArrayBuffer;
    file: File;
}

type Opcional = {
    opcional: string;
}




  const createAnuncioFormSchema = yup.object({
    marca: yup.string().required('Marca obrigatória'),
    ano_fabricacao: yup.string().required('Preencha com o ano do veículo'),
    modelo: yup.string().required('Modelo Obrigatório'),
    valor: yup.string().required('Informe o valor do veículo'),
    versao: yup.string().required('Preencha com a vesão'),
    cor: yup.string().required('Preencha com a cor'),
    combustivel: yup.string().required('Selecione uma opção'),
    carroceria: yup.string().required('Selecione uma opção'),
    chave_copia: yup.string().required('Selecione uma opção'),
    numero_portas: yup.string().required('Preencha com o número de portas'),
    cores_internas: yup.string().required('Preencha com as cores internas'),
    potencia: yup.string().required('Informe a potência do veículo'),
    transmissao: yup.string().required('Selecione uma opção'),
    quilometragem: yup.string().required('Informe a quilometragem do veículo'),
    manual_do_proprietario: yup.string().required('Selecione uma opção'),
    laudo_cautelar: yup.string().required('Selecione uma opção'),
    condicao: yup.string().required('Selecione uma opção'),
    image: yup.mixed(),
    opcionais: yup.array().of(yup.object({
        opcional: yup.string().required("Informe o opcional")
    }))
            
        
  })




export default function CreateVehicle() {

    const router = useRouter()

    const {register,control, handleSubmit, formState, watch} = useForm({
        resolver: yupResolver(createAnuncioFormSchema)
    })



    const {fields, append, remove} = useFieldArray(
        {
            control, 
            name: "opcionais" as const
        }
        )

    const {errors} = formState


    

    const [imagesPreview, setImagesPreview] = useState<ImagePreview[]>([])
    const [createMarca, setCreateMarca] = useState(false)
    const [loadingPreview, setLoadingPreview] = useState(false)
    
    const handleCreateAnuncio: SubmitHandler<CreateAnuncioFormData> = async (values) => {
        
        
        const response = await handleUpload(imagesPreview)
        const {opcionais} = values
        const newOpcionais = opcionais.map(opcional => opcional.opcional)
        
        const images = response.map(image => {
            if(image.file) {
                delete image.file
            }
            return image.preview
        })

        if(images.length > 0){
            
            const anuncio = {...values, image: images, opcionais: newOpcionais}
            await saveAnuncio(anuncio)
        }

        

        
    }

    
    async function saveAnuncio(anuncio) { 
        
        const response = await fetch('/api/anuncios/create', {
            method: "POST",
            body: JSON.stringify(anuncio)
        })
        
        
        if(!response.ok) {
            console.log(response)
            throw new Error(response.statusText)
        }

        if(response.ok) {
            router.push('/dashboard/anuncios')
        }
    
        return await response.json()
    }


    const handleUpload = async (images) => {
        
        
        const result = await insert(images)
                        
        if(result instanceof Error) {
            console.log(`${result.name} - ${result.message}`)
        }
        const response = await Promise.all(result)
       
        return response
            
        


    }

    const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      }


    const handleImage =  async (event: React.ChangeEvent<HTMLInputElement>) => {
       
        const files = Array.from(event.target.files)
        
        files.map(async (fileUnsized: File) => {
            
            if(fileUnsized.type.includes("image")) {
                const file = await imageCompression(fileUnsized, options)
                const reader = new FileReader()
                
               
                reader.readAsDataURL(file)
                reader.onload = () => setLoadingPreview(true)
                reader.onloadend = async () => {
                
                    
                const preview = reader.result
                
               
                const image = {preview, file}
                
                const imageAlreadyExistsInPreview = imagesPreview.find(image => image.preview === preview)

                if(!imageAlreadyExistsInPreview){
                    setImagesPreview((prevImages) =>  [...prevImages, image])
                }
                if(imageAlreadyExistsInPreview){
                    console.log("Não é possível carregar imagens iguais")
                }

                setTimeout(() => setLoadingPreview(false), 3000)
                
            }
            
            return null
            }
        })
    }


        
    async function handleRemoveImage(image) {
        
        if(image) {
           const newImages = imagesPreview.filter(newImage => newImage.file.name != image.file.name)
           setImagesPreview(newImages)
        }

       
       
   }


  const handleCreateMarca = (event) => {
        if(event.target.value === 'adicionar') {
            openCreateMarca()
        }
   }

    function openCreateMarca() {
        setCreateMarca(true)
    }


    
    
    return (
        <Box>
            <Head>
            <title>Criar Anúncio</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Header/>
            
            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">

                <Siderbar/>

                {formState.isSubmitting ? (
                    <Flex
                    align="center"
                    justify="center"
                    flex="1"
                    height="100vh"
                    >
                    <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                  <Text ml={4}>Enviando dados...</Text>
                  </Flex>
                ) : (
                formState.isSubmitted ? (
                    <Flex
                    align="center"
                    justify="center"
                    flex="1"
                    height="100vh"
                    >
                    <Icon as={RiCheckLine} fontSize="40px"/> <Text ml={4}>Anúncio criado com sucesso!</Text>
                    </Flex>
                ) : (
                    <Box 
                    as="form"
                    flex="1" 
                    borderRadius={8} 
                    bg="gray.800" p={["6","8"]}
                    onSubmit={handleSubmit(handleCreateAnuncio)}
                    >
    
                    <Heading size="lg" fontWeight="normal">Criar Anúncio</Heading>
    
                    <Divider my="6" borderColor="gray.700"/>
    
    
                    <VStack spacing="8">
                    <Heading size="sm" fontWeight="bold" color="gray.300" alignSelf="flex-start">INFORMAÇÕES DO VEÍCULO</Heading>
                        <SimpleGrid minChildWidth="240px" spacing={["6","8"]} width="100%">
                            
                            

    
                            <Input name="modelo" label="Modelo" error={errors.modelo} {...register('modelo')}/>
    
    
                           
    
    
    
                            <Input name="versao" label="Versão" error={errors.versao} {...register('versao')}/>
                            <Input name="numero_portas" error={errors.numero_portas} label="Número de Portas" {...register('numero_portas')}/>
                            <Input name="cor" label="Cor" error={errors.cor} {...register('cor')}/>
                            <Input name="cores_internas" label="Cores Interiores" error={errors.cores_internas} {...register('cores_internas')} />
    
    
                            <FormControl isInvalid={!!errors.combustivel}>
                            <FormLabel 
                            htmlFor="combustivel"
                            >
                                Combustível
                            </FormLabel>
                            <Select size="lg" name="combustivel" variant="filled" bg="gray.900" focusBorderColor="yellow.500" defaultValue="Flex"  _hover={{bgColor: 'gray.900'}} {...register('combustivel')}>
                                        <option style={{backgroundColor:"#1F2029"}} value="Flex">Flex</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Gasolina">Gasolina</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Diesel">Diesel</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Híbrido">Híbrido</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Elétrico">Elétrico</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="GNV">GNV</option>
                                </Select>
    
                                {!!errors.combustivel && (
                                    <FormErrorMessage>
                                    {errors.combustivel.message}
                                    </FormErrorMessage>
                                 )}
                                
                                  
                            </FormControl>
                            
    
                            <FormControl isInvalid={!!errors.carroceria}>
                            <FormLabel 
                            htmlFor="carroceria"
                            >
                                Carroceria
                            </FormLabel>
                            <Select size="lg" name="carroceria" variant="filled" bg="gray.900" focusBorderColor="yellow.500" defaultValue="Hatch"  _hover={{bgColor: 'gray.900'}} {...register('carroceria')}>
                                        <option style={{backgroundColor:"#1F2029"}} value="Hatch">Hatch</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Compacto">Compacto</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="SUV">SUV</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Picape">Picape</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Sedan">Sedan</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Mini Van">Mini Van</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Van">Van</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Van de Painel">Van de Painel</option>
                                </Select>
    
                                {!!errors.carroceria && (
                                    <FormErrorMessage>
                                    {errors.carroceria.message}
                                    </FormErrorMessage>
                                 )}
                                
                                  
                            </FormControl>
    
                            <Input name="potencia" label="Potência" error={errors.potencia} {...register('potencia')}/>
                            
                            <FormControl isInvalid={!!errors.valor}>
                            <FormLabel 
                            htmlFor="valor"
                            >
                                Valor
                            </FormLabel>
                            
                            <ChakraInput
                             {...register('valor')}
                            as={CurrencyInput}
                            bgColor="gray.900" 
                            _hover={{bgColor: 'gray.900'}} 
                            focusBorderColor="yellow.400"  
                            variant="filled" 
                            name="valor" 
                            id="valor" 
                            type="text" 
                            size="lg"
                            allowNegativeValue={false}
                            disableAbbreviations={true}
                            allowDecimals={false}
                            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                            />
                         
                            {!!errors.valor && (
                                    <FormErrorMessage>
                                    {errors.valor.message}
                                    </FormErrorMessage>
                                 )}
                            
                           </FormControl>
    
                            <FormControl isInvalid={!!errors.transmissao}>
                            <FormLabel 
                            htmlFor="transmissao"
                            >
                                Transmissão
                            </FormLabel>
                            <Select id="transmissao" size="lg" name="transmissao" variant="filled" bg="gray.900" focusBorderColor="yellow.500" defaultValue="Manual"  _hover={{bgColor: 'gray.900'}} {...register('transmissao')}>
                                        <option style={{backgroundColor:"#1F2029"}} value="Manual">Manual</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Automatizado">Automatizado</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Automático">Automático</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Automático de Dupla Embreagem">Automático de Dupla Embreagem</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="CVT">CVT</option>
                                </Select>
    
                                {!!errors.transmissao && (
                                    <FormErrorMessage>
                                    {errors.transmissao.message}
                                    </FormErrorMessage>
                                 )}
                                
                                  
                            </FormControl>
    
                          
    
                            <FormControl isInvalid={!!errors.quilometragem}>
                            <FormLabel 
                            htmlFor="quilometragem"
                            >
                                Quilometragem
                            </FormLabel>
    
                            <ChakraInput
                             {...register('quilometragem')}
                            as={CurrencyInput}
                            bgColor="gray.900" 
                            _hover={{bgColor: 'gray.900'}} 
                            focusBorderColor="yellow.400"  
                            variant="filled" 
                            name="quilometragem" 
                            id="quilometragem" 
                            type="text" 
                            size="lg"
                            groupSeparator="."
                            disableAbbreviations={true}
                            allowNegativeValue={false}
                            />
                          
                            {!!errors.quilometragem && (
                                    <FormErrorMessage>
                                    {errors.quilometragem.message}
                                    </FormErrorMessage>
                                 )}
                            
                           </FormControl>
    
                           <FormControl isInvalid={!!errors.condicao}>
                            <FormLabel 
                            htmlFor="condicao"
                            >
                                Condição
                            </FormLabel>
                            <Select id="condicao" size="lg" name="condicao" variant="filled" bg="gray.900" focusBorderColor="yellow.500" defaultValue="Manual"  _hover={{bgColor: 'gray.900'}} {...register('condicao')}>
                                        <option style={{backgroundColor:"#1F2029"}} value="Novo">Novo</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Seminovo">Seminovo</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Usado">Usado</option>
                                </Select>
    
                                {!!errors.condicao && (
                                    <FormErrorMessage>
                                    {errors.condicao.message}
                                    </FormErrorMessage>
                                 )}
                                
                                  
                            </FormControl>
    
                        </SimpleGrid>
    
                        <Heading size="sm" fontWeight="bold" color="gray.300" alignSelf="flex-start">OUTRAS INFORMAÇÕES</Heading>
                        <SimpleGrid minChildWidth="240px" spacing={["6","8"]} width="100%">
                            
                            <FormControl isInvalid={!!errors.laudo_cautelar}>
                            <FormLabel 
                            htmlFor="laudo_cautelar"
                            >
                                Laudo Cautelar
                            </FormLabel>
                            <Select size="lg" id="laudo_cautelar" name="laudo_cautelar" variant="filled" bg="gray.900" focusBorderColor="yellow.500" defaultValue="Aprovado"  _hover={{bgColor: 'gray.900'}} {...register('laudo_cautelar')}>
                                        <option style={{backgroundColor:"#1F2029"}} value="Aprovado">Aprovado</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Reprovado">Reprovado</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Aprovado com apontamento">Aprovado com apontamento</option>
                                </Select>
    
                                {!!errors.laudo_cautelar && (
                                    <FormErrorMessage>
                                    {errors.laudo_cautelar.message}
                                    </FormErrorMessage>
                                 )}
                                
                                  
                            </FormControl>
                            
                                
                           <FormControl isInvalid={!!errors.manual_do_proprietario}>
                            <FormLabel 
                            htmlFor="manual_do_proprietario"
                            >
                                Manual do Proprietário
                            </FormLabel>
                            <Select size="lg" id="manual_do_proprietario" name="manual_do_proprietario" variant="filled" bg="gray.900" focusBorderColor="yellow.500" defaultValue="Sim"  _hover={{bgColor: 'gray.900'}} {...register('manual_do_proprietario')}>
                                        <option style={{backgroundColor:"#1F2029"}} value="Sim">Sim</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Não">Não</option>
                                </Select>
    
                                {!!errors.manual_do_proprietario && (
                                    <FormErrorMessage>
                                    {errors.manual_do_proprietario.message}
                                    </FormErrorMessage>
                                 )}
                                
                                  
                            </FormControl>
    
                            
                            <FormControl isInvalid={!!errors.chave_copia}>
                            <FormLabel 
                            htmlFor="chave_copia"
                            >
                                Chave Cópia
                            </FormLabel>
                            <Select size="lg" id="chave_copia" name="chave_copia" variant="filled" bg="gray.900" focusBorderColor="yellow.500" {...register('chave_copia')}  _hover={{bgColor: 'gray.900'}} defaultValue="Sim">
                                        <option style={{backgroundColor:"#1F2029"}} value="Sim">Sim</option>
                                        <option style={{backgroundColor:"#1F2029"}} value="Não">Não</option>
                                </Select>
    
                                {!!errors.chave_copia && (
                                    <FormErrorMessage>
                                    {errors.chave_copia.message}
                                    </FormErrorMessage>
                                 )}
                                
                                  
                            </FormControl>
                            
    
    
                        </SimpleGrid>
                        
                        <SimpleGrid minChildWidth="240px" spacing={["6","8"]} width="100%">

                            
                        </SimpleGrid>
    
                        <SimpleGrid minChildWidth="240px" spacing={["6","8"]} width="100%">
                        
                    
                            
                            <Box mt={6} display="flex" flexDirection="column"  p={1} gap={2}>
                            
                            
                            <FormControl isInvalid={!!errors.image}>
                            <FormLabel 
                            htmlFor="image"
                            >
                                
                                <Box p={4} display="flex" justifyContent="center" alignItems="center" >
                              <Box mr={5} maxWidth="240px" bg="blue.500" borderRadius="5px" p={2} display="flex" alignItems="center" justifyContent="center" cursor="pointer" transition="all 0.3s ease-in-out" _hover={{opacity: 0.88}}>
                                  <Icon mr={3}  alignSelf="center" w={7} h={7} as={RiUploadCloudLine}/>
                                  <Text fontSize="20px">Escolher imagens</Text>
                                  
                                  </Box>
                                  <Box>{imagesPreview.length === 0 ? <Text fontSize="20px">Envie no mínimo uma imagem</Text> : <Text fontSize="20px">{imagesPreview.length} imagens selecionadas</Text>}</Box>
                                  {!!loadingPreview && <HStack ml="1rem"><Spinner
                    thickness="2px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="md"
                  /></HStack>}
                                  </Box>
                            
                            </FormLabel>
                            <ChakraInput p={1} 
                                name="image" 
                                id="image" 
                                type="file" 
                                multiple
                                variant="filled"
                                accept="image/jpeg, image/png, image/jpg, image/webp"
                                bgColor="gray.900"
                                display="none"
                                {...register('image')}
                               
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

                                
                        
                            
                            
                            </Box>
                            
                    </SimpleGrid>
                    
                    </VStack>
    
                    <Flex mt="8" justify="flex-end">
                        <HStack spacing="4">
                        <Link href="/dashboard/anuncios" passHref><Button colorScheme="whiteAlpha">Cancelar</Button></Link>
                            <Button type="submit" colorScheme="blue" isLoading={formState.isSubmitting}>Salvar</Button>
                        </HStack>
                    </Flex>
                    </Box>
                ))}
                
            </Flex>
        </Box>
    )
}


/**export const getServerSideProps: GetServerSideProps = async({req}) => {


    const session = await getSession({req})

    const data = await prisma.marca.findMany()

    const initialValues = await JSON.parse(JSON.stringify(data))
   

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
          initialValues,
        }
    }
  }
  */