import { Image, Stack } from "@chakra-ui/react"
import Link from 'next/link'

interface LogoProps {
    size: number;
    logo?: string;
}

export default function Logo ({size, logo}: LogoProps) {
    return (
        <Link href="/"  passHref>
        <Stack direction="row" cursor="pointer">
            
            <Image
                maxWidth={size}
                w="100%"
                objectFit="contain"
                src={!logo ? '/img/logo.png' : logo}
                alt="logo"
                 
            />
        </Stack>
        </Link>
    )
}