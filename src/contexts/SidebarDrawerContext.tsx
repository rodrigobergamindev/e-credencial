import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/hooks";
import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect } from "react";




interface SidebarDrawerProviderProps {
    children: ReactNode;
}

type SideBarDrawerContextData = UseDisclosureReturn

const SidebarDrawerContext = createContext({} as SideBarDrawerContextData);


export default function SidebarDrawerProvider({children} : SidebarDrawerProviderProps) {

    const disclosure = useDisclosure()
    const router = useRouter()


    useEffect(() => {
        disclosure.onClose()
    }, [router.asPath])
    return (
        <SidebarDrawerContext.Provider value ={disclosure}>
            {children}
        </SidebarDrawerContext.Provider>
    )
}

export const useSidebarDrawer = () => useContext(SidebarDrawerContext)