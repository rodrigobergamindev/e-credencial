
import { Image, Stack } from "@chakra-ui/react"
import Link from 'next/link'

export default function Logo () {
    return (
        <Link href="/" passHref>
        <Stack cursor="pointer" direction="row">
            <Image
                boxSize="250px"
                objectFit="contain"
                src="/img/logo.png"
                alt="logo"
                
            />
        </Stack>
        </Link>
    )
}