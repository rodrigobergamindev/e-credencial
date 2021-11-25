import { Flex, Button, Stack} from '@chakra-ui/react'
import { Input } from '../../components/Form/Input'
import {useForm, SubmitHandler} from 'react-hook-form'
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import {GetServerSideProps} from 'next'

import { getSession, signIn, signOut } from 'next-auth/client'
import { useRouter } from "next/router";


type SignInFormData = {
  email: string;
  password: string;
}

const SignInFormSchema = yup.object({
  email: yup.string().required('E-mail obrigatório').email(),
  password: yup.string().required('Senha obrigatória')
})

export default function SignIn() {



  const {register, handleSubmit, formState} = useForm({resolver: yupResolver(SignInFormSchema)})


  const handleSignIn: SubmitHandler<SignInFormData> = async (values, event) => {
    //await new Promise(resolve => setTimeout(resolve,2000))

   
      const username = values.email
      const password =  values.password
    

     await signIn('credentials', { redirect: true, username, password, callbackUrl: 'http://localhost:3000/dashboard'})
    
  }

  const {errors} =  formState

  return (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">

      <Flex
        as="form"
        width="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDirection="column"
        onSubmit={handleSubmit(handleSignIn)}
      >

        <Stack spacing="4">
       
       <Input 
       name="email" 
       type="email" 
       label="E-mail" 
       error={errors.email}
       {...register('email')}/>

       <Input 
       name="password" 
       type="password" 
       label="Senha" 
       error={errors.password}
       {...register('password')}/>

      </Stack>

       <Button type="submit" mt="6" colorScheme="blue" size="lg" isLoading={formState.isSubmitting}> Entrar </Button>
       
      </Flex>
    </Flex>
  )
}

/** 
export const getServerSideProps: GetServerSideProps = async ({req}) => {

  const session = await getSession({req})
  
  if(session) {
    
      return {
          redirect: {
              destination: `/dashboard`,
              permanent: false
          }
      }
  }

  return {
    props: {}
  }
}
*/