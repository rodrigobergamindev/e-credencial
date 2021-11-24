import {AppProps} from 'next/app'
import { ChakraProvider, Icon, Spinner, Box, Text } from '@chakra-ui/react'
import { theme } from '../styles/theme'
import SidebarDrawerProvider from '../contexts/SidebarDrawerContext'
import {Provider as NextAuthProvider} from 'next-auth/client'


import {useRouter} from 'next/router'
import Head from 'next/head'



import Drawer from '../components/Menu/Drawer/index'
import {useState, useEffect} from 'react'


  
function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
 

  useEffect(() => {

    const handleRouteChange = () => {
      
      setLoading(true)
    
      }
  
  const handleRouteOff = () => {
    
      setLoading(false)
     
  }
  
  router.events.on('routeChangeStart', handleRouteChange)
  router.events.on('routeChangeComplete', handleRouteOff)

 
   
  },[])
  


  if(router.asPath.includes('dashboard') || router.asPath.includes('login')) {
   
    return (
      <NextAuthProvider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <SidebarDrawerProvider>
        <Head>
      <link rel="icon"  href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>

      {!!loading ? (
       <Box display="flex" justifyContent="center" alignItems="center" zIndex={99999} position="absolute" background="gray.900" height="100vh" width="100vw">
       <Text fontSize="2xl" color="gray.50">Carregando...</Text>
       <Spinner
        thickness="2px"
        speed="0.65s"
        emptyColor="gray.900"
        color="blue.400"
        size="lg"
        ml="1rem"
        />
       
     </Box>
     ) : 
     
     (
       <Component {...pageProps} />
      )}
        </SidebarDrawerProvider>
      </ChakraProvider>
      </NextAuthProvider>
    )
  }

  return (
    

    <ChakraProvider theme={theme}>
      <SidebarDrawerProvider>

      <Drawer/>
      <Head>
      <link rel="icon"  href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>
     
     
     {!!loading ? (
       <Box display="flex" justifyContent="center" alignItems="center" zIndex={99999} position="absolute" background="gray.50" height="100vh" width="100vw">
       <Text fontSize="2xl" color="gray.900">Carregando...</Text>
       <Spinner
        thickness="2px"
        speed="0.65s"
        emptyColor="gray.50"
        color="yellow.500"
        size="lg"
        ml="1rem"
        />
       
     </Box>
     ) : 
     
     (
       <Component {...pageProps} />
      )}
        
  
      </SidebarDrawerProvider>
    </ChakraProvider>
    
  )
}

export default MyApp
