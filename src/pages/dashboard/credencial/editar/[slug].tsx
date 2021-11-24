import { Box, Flex, VStack, Heading, 
    SimpleGrid, Divider, HStack, Button, Textarea, Text, Image,
     Grid, Icon, FormLabel, FormControl, FormErrorMessage, Input as ChakraInput, Select, Spinner} from "@chakra-ui/react";


import { Input } from "../../../../components/Form/Input";
import  Header  from "../../../../components/Header";
import  Siderbar  from "../../../../components/Sidebar/index"
import Link from 'next/link'

import {useForm, SubmitHandler, useFieldArray, Control} from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.umd';
import {GetServerSideProps} from 'next'
import { getSession } from "next-auth/client"
import { deletePhoto, insert } from '../../../api/photos'
import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'

import InputMask from 'react-input-mask';
import CurrencyInput from 'react-currency-input-field';
import {RiAddLine, RiCheckLine, RiCloseLine, RiSubtractLine, RiUploadCloudLine} from "react-icons/ri";

import {prisma} from '../../../../../db'
import Head from 'next/head'

import imageCompression from 'browser-image-compression'



type CreateAnuncioFormData = {
    ano_fabricacao: string;
    marca: string;
    modelo: string;
    versao: string;
    numero_portas: string;
    cor: string;
    cores_internas: string;
    combustivel: string;
    carroceria: string;
    potencia: string;
    transmissao: string;
    quilometragem: string;
    condicao: string;
    valor: string;
    chave_copia: string;
    laudo_cautelar: string;
    manual_do_proprietario: string;
    opcionais: Opcional[];
    image: FileList;

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
    opcionais: yup.array().of(yup.object()).optional()       
  })




type ImagePreview = {
    preview: string | ArrayBuffer;
    file?: File;
}



export default function EditVehicle({anuncio, marcas}) {

    const router = useRouter()
  
    const imagesPreRender = anuncio.image.map(image => {
        const imagePreRender = {
            preview: image
        }
        return imagePreRender
    })


    const [imagesDeleted, setImagesDeleted] = useState([])
    const [imagesPreview, setImagesPreview] = useState<ImagePreview[]>(imagesPreRender)
    const [createMarca, setCreateMarca] = useState(false)
    const [opcionaisInit, setOpcionais] = useState(anuncio.opcionais)
    
    
    const {valor} = anuncio
    const valueFormatted =  parseFloat(valor.replace('.','').replace('R$','').replace(' ',''))
    


    

    const {register,handleSubmit, control, formState} = useForm({
        resolver: yupResolver(createAnuncioFormSchema)
    })

        
    const {fields, append, remove} = useFieldArray(
        {
            control, 
            name: "opcionais" as const
        }
        )



    const[winReady, setwinReady] = useState(false)

    useEffect(() => {
        setwinReady(true)
    }, [])

    const {errors} = formState
 

    const handleEditAnuncio: SubmitHandler<CreateAnuncioFormData> = async (values) => {
        
        const response = await handleUpload(imagesPreview)
        const images = response.map(image => {
            if(image.file) {
                delete image.file
            }
            return image.preview
        })
        
        if(values && images.length > 0) {
            const {opcionais} = values
            const newOpcionais = [...opcionaisInit,...opcionais.map(opcional => opcional.opcional)]
            const anuncioToUpdate = {...values, image: images, opcionais: newOpcionais, slug: anuncio.slug} 
            await saveAnuncio(anuncioToUpdate, imagesDeleted)
        }
        
       
        

    }
    

    async function saveAnuncio(anuncio, imagesDeleted) { 
        
        const anuncioToUpdate = {anuncio, imagesDeleted}
        const response = await fetch('/api/anuncios/update', {
                method: "PUT",
                body: JSON.stringify(anuncioToUpdate)
            })

                    
        if(!response.ok) {
            throw new Error(response.statusText)
        }

        if(response.ok) {
            router.push('/dashboard/anuncios')
        }
        
    }


    const handleUpload = async (images) => {
        
        
        const result = await insert(images)
                        
        if(result instanceof Error) {
            console.log(`${result.name} - ${result.message}`)
        }
        
        const response = await Promise.all(result)
        return response


    }


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

    
    async function handleRemoveImage(image) {

        
         if(image) {
            
            setImagesDeleted((prevImages) => [...prevImages,image])
            const newImages = imagesPreview.filter(newImage => newImage.preview != image.preview)
            setImagesPreview(newImages)
         }

        
        
    }


    const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      }


const handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    
    const files = Array.from(event.target.files)
    
    files.map(async (fileUnsized: File) => {
        if(fileUnsized.type.includes("image")) {
            const file = await imageCompression(fileUnsized, options)
            const reader = new FileReader()

         

            reader.readAsDataURL(file)

            reader.onloadend = () => {
            const preview = reader.result;
            const image = {preview, file}
            const imageAlreadyExistsInPreview = imagesPreview.find(image => image.preview === preview)

                if(!imageAlreadyExistsInPreview){
                    setImagesPreview((prevImages) =>  [...prevImages, image])
                }
                if(imageAlreadyExistsInPreview){
                    console.log("Não é possível carregar imagens iguais")
                }
        }
    }
        return null
    })
}



const handleCreateMarca = (event) => {
    if(event.target.value === 'adicionar') {
        openCreateMarca()
    }
}

function openCreateMarca() {
    setCreateMarca(true)
}

    


const handleRemoveOpcional = opcional => {
    const newOpcionais = opcionaisInit.filter(item => item !== opcional)
    setOpcionais(newOpcionais)
}



    return (
        <Box>
            <Head>
            <title>Editar Anúncio</title>
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
                    <Icon as={RiCheckLine} fontSize="40px"/> <Text ml={4}>Anúncio atualizado com sucesso!</Text>
                    </Flex>
                ) : (
                    <Box 
                as="form"
                flex="1" 
                borderRadius={8} 
                bg="gray.800" p={["6","8"]}
                onSubmit={handleSubmit(handleEditAnuncio)}
                >

                <Heading size="lg" fontWeight="normal">Editar Anúncio</Heading>

                <Divider my="6" borderColor="gray.700"/>


                <VStack spacing="8">
                <Heading size="sm" fontWeight="bold" color="gray.300" alignSelf="flex-start">INFORMAÇÕES DO VEÍCULO</Heading>
                    <SimpleGrid minChildWidth="240px" spacing={["6","8"]} width="100%">
                        
                        
                    <FormControl isInvalid={!!errors.marca}>
                        <FormLabel 
                        htmlFor="marca"
                        >
                            Marca
                        </FormLabel>
                        {createMarca ? (
                        <ChakraInput size="lg" name="marca" id="marca"  {...register('marca')} focusBorderColor="yellow.500" _hover={{bgColor: 'gray.900'}} variant="filled" bg="gray.900" type="text"/>
                        ) : (
                            <Select size="lg" id="marca" name="marca" variant="filled" bg="gray.900" focusBorderColor="yellow.500" {...register('marca')} defaultValue={anuncio.marca_name}  onChange={e => handleCreateMarca(e)}  _hover={{bgColor: 'gray.900'}}>
                                    {!!marcas && marcas.map((marca, index) => {
                                       
                                        return (
                                            <option key={marca.id} style={{backgroundColor:"#1F2029"}} value={`${marca.name}`}>{marca.name}</option>
                                        )
                                    })}
                                    <option style={{backgroundColor:"#1F2029"}} value="adicionar">Adicionar...</option>
                            </Select>
                        )
                        }

                          

                            {!!errors.marca && (
                                <FormErrorMessage>
                                {errors.marca.message}
                                </FormErrorMessage>
                             )}
                            
                              
                        </FormControl>


                        <Input name="modelo" label="Modelo" error={errors.modelo} {...register('modelo')} defaultValue={anuncio.modelo} />
                       
                        <FormControl isInvalid={!!errors.ano_fabricacao}>
                        <FormLabel 
                        htmlFor="ano_fabricacao"
                        >
                           Ano
                        </FormLabel>

                        <ChakraInput
                         {...register('ano_fabricacao')}
                        as={InputMask}
                        bgColor="gray.900" 
                        _hover={{bgColor: 'gray.900'}} 
                        focusBorderColor="yellow.400"  
                        variant="filled" 
                        name="ano_fabricacao" 
                        id="ano_fabricacao" 
                        type="text" 
                        size="lg"
                        mask="9999/9999"
                        defaultValue={anuncio.ano_fabricacao}
                        />
                      
                        {!!errors.ano_fabricacao && (
                                <FormErrorMessage>
                                {errors.ano_fabricacao.message}
                                </FormErrorMessage>
                             )}
                        
                       </FormControl>


                        <Input name="versao" label="Versão" error={errors.versao} {...register('versao')} defaultValue={anuncio.versao}/>
                        <Input name="numero_portas" label="Número de Portas" error={errors.numero_portas} {...register('numero_portas')} defaultValue={anuncio.numero_portas}/>
                        <Input name="cor" label="Cor" error={errors.cor} {...register('cor')} defaultValue={anuncio.cor}/>
                        <Input name="cores_internas" label="Cores Interiores" error={errors.cores_internas} {...register('cores_internas')} defaultValue={anuncio.cores_internas} />




                        <FormControl isInvalid={!!errors.combustivel}>
                        <FormLabel 
                        htmlFor="combustivel"
                        >
                            Combustível
                        </FormLabel>
                        <Select size="lg" name="combustivel" variant="filled" bg="gray.900" focusBorderColor="yellow.500"  _hover={{bgColor: 'gray.900'}} {...register('combustivel')} defaultValue={anuncio.combustivel}>
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
                        <Select size="lg" name="carroceria" variant="filled" bg="gray.900" focusBorderColor="yellow.500"  _hover={{bgColor: 'gray.900'}} {...register('carroceria')} defaultValue={anuncio.carroceria}>
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

                        <Input name="potencia" label="Potência" error={errors.potencia} {...register('potencia')} defaultValue={anuncio.potencia}/>
                        <FormControl isInvalid={!!errors.transmissao}>
                        <FormLabel 
                        htmlFor="transmissao"
                        >
                            Transmissão
                        </FormLabel>
                        <Select id="transmissao" size="lg" name="transmissao" variant="filled" bg="gray.900" focusBorderColor="yellow.500" {...register('transmissao')} defaultValue={anuncio.transmissao}  _hover={{bgColor: 'gray.900'}}>
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
                        defaultValue={anuncio.quilometragem}
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
                        <Select id="condicao" size="lg" name="condicao" variant="filled" bg="gray.900" focusBorderColor="yellow.500" {...register('condicao')} defaultValue={anuncio.condicao}  _hover={{bgColor: 'gray.900'}}>
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

                        <FormControl isInvalid={!!errors.valor}>
                            <FormLabel 
                            htmlFor="valor"
                            >
                                Valor
                            </FormLabel>
                            <HStack>
                        
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
                            defaultValue={valueFormatted}
                            />
                          </HStack>
                            {!!errors.valor && (
                                    <FormErrorMessage>
                                    {errors.valor.message}
                                    </FormErrorMessage>
                                 )}
                            
                           </FormControl>
                        
                        
                        
                    </SimpleGrid>

                    <Heading size="sm" fontWeight="bold" color="gray.300" alignSelf="flex-start">OUTRAS INFORMAÇÕES</Heading>
                    <SimpleGrid minChildWidth="240px" spacing={["6","8"]} width="100%">
                    

                    <FormControl isInvalid={!!errors.chave_copia}>
                        <FormLabel 
                        htmlFor="chave_copia"
                        >
                            Chave Cópia
                        </FormLabel>
                        <Select size="lg" id="chave_copia" name="chave_copia" variant="filled" bg="gray.900" focusBorderColor="yellow.500" {...register('chave_copia')}  _hover={{bgColor: 'gray.900'}} defaultValue={anuncio.chave_copia}>
                                    <option style={{backgroundColor:"#1F2029"}} value="Sim">Sim</option>
                                    <option style={{backgroundColor:"#1F2029"}} value="Não">Não</option>
                            </Select>

                            {!!errors.chave_copia && (
                                <FormErrorMessage>
                                {errors.chave_copia.message}
                                </FormErrorMessage>
                             )}
                            
                              
                        </FormControl>

                        <FormControl isInvalid={!!errors.laudo_cautelar}>
                        <FormLabel 
                        htmlFor="laudo_cautelar"
                        >
                            Laudo Cautelar
                        </FormLabel>
                        <Select size="lg" id="laudo_cautelar" name="laudo_cautelar" variant="filled" bg="gray.900" focusBorderColor="yellow.500" {...register('laudo_cautelar')} defaultValue={anuncio.laudo_cautelar}  _hover={{bgColor: 'gray.900'}} >
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
                        <Select size="lg" id="manual_do_proprietario" name="manual_do_proprietario" variant="filled" bg="gray.900" focusBorderColor="yellow.500" {...register('manual_do_proprietario')} defaultValue={anuncio.manual_do_proprietario}  _hover={{bgColor: 'gray.900'}}>
                                    <option style={{backgroundColor:"#1F2029"}} value="Sim">Sim</option>
                                    <option style={{backgroundColor:"#1F2029"}} value="Não">Não</option>
                            </Select>

                            {!!errors.manual_do_proprietario && (
                                <FormErrorMessage>
                                {errors.manual_do_proprietario.message}
                                </FormErrorMessage>
                             )}
                            
                              
                        </FormControl>
                        
        

                    </SimpleGrid>
                    
                    <SimpleGrid minChildWidth="240px" spacing={["6","8"]} width="100%">
                        
                            <Box>
                            <HStack  alignItems="center" mb={4}>
                            <Heading size="sm" mr={4} fontWeight="bold" color="gray.300" alignSelf="center">OPCIONAIS</Heading>
                            <Button size="sm" onClick={() => append({})} colorScheme="blue"><Icon fontSize="md" as={RiAddLine}/></Button>
                            </HStack>
                            <FormControl isInvalid={!!errors.opcionais}>
                            <Grid templateColumns="repeat(3,1fr)" minChildWidth="240px" gap={6} width="100%">
                            
                            {opcionaisInit.map((opcional,index) => {
                                return (
                                    <HStack align="center" mb={4} key={`${opcional}-${index}`}>
                                    <ChakraInput
                                           
                                            disabled={true}
                                            bgColor="gray.900" 
                                            _hover={{bgColor: 'gray.900'}} 
                                             focusBorderColor="yellow.400"  
                                            variant="filled" 
                                            type="text" 
                                            size="lg"
                                            defaultValue={opcional}
                                            />
                                            <Button size="md" onClick={() => handleRemoveOpcional(opcional)} colorScheme="red"><Icon fontSize="md" as={RiSubtractLine}/></Button>
                                            </HStack>
                                )
                            })}
                            
                                    
                                    {fields.map((item, index) => {
                                        
                                        return (
                                            <HStack align="center" mb={4} key={`${item.id}-${index}`}>
                                            <ChakraInput
                                            name={`opcionais.[${index}].opcional`} 
                                            {...register(`opcionais.${index}.opcional` as const)}
                                            bgColor="gray.900" 
                                            _hover={{bgColor: 'gray.900'}} 
                                             focusBorderColor="yellow.400"  
                                            variant="filled" 
                                            type="text" 
                                            size="lg"
                                            key={item.id}
                                            id={item.id}
                                            />
                                            <Button size="md" onClick={() => remove(index)} colorScheme="red"><Icon fontSize="md" as={RiSubtractLine}/></Button>
                                            </HStack>
                                        )
                                    })}
    
                                {!!errors.opcionais && (
                                    <FormErrorMessage>
                                    {errors.opcionais.map(error => console.log(error))}
                                    </FormErrorMessage>
                                 )}
                                
                                  
                            
                          </Grid>
                          </FormControl>
                          </Box>
                       
                            
                           
    
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
                        <Button onClick={() => handleRemoveAnuncio(anuncio)} colorScheme="red">Excluir</Button>
                    </HStack>
                </Flex>
                </Box>
                ))}

               
            </Flex>
        </Box>
    )
   
}


export const getServerSideProps: GetServerSideProps = async ({params, req}) => {

    const {slug} = params


    const data = await prisma.anuncio.findUnique({
        where: {
          slug: slug as string
        },
      })

      const dataMarcas = await prisma.marca.findMany()
    


    const anuncio = await JSON.parse(JSON.stringify(data))
    const marcas = await JSON.parse(JSON.stringify(dataMarcas))


 
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
        anuncio,
        marcas
        }
    }
}