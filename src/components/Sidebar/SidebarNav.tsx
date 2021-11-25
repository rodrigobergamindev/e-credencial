import { Box, Stack } from "@chakra-ui/react";
import { RiCarLine, RiContactsLine, RiDashboardLine, RiGitMergeLine, RiInputMethodLine, RiPencilLine } from "react-icons/ri";
import NavLink from "./NavLink";
import NavSection from "./NavSection";
import {BsClipboardData} from 'react-icons/bs'
import {FaIdCard} from 'react-icons/fa'
import {AiOutlineMessage} from 'react-icons/ai'

export function SidebarNav() {
    return (
        <Stack spacing="12" align="flex-start">
                <Box>
                    <NavSection title="MENU">
                        <NavLink icon={RiDashboardLine} href="/dashboard">Dashboard</NavLink>
                        <NavLink icon={FaIdCard} href="/dashboard/credencial">Credencial</NavLink>
                        <NavLink icon={RiPencilLine} href="/dashboard/credencial/create">Emitir Credencial</NavLink>
                        <NavLink icon={AiOutlineMessage} href="/dashboard/mensagens">Mensagens</NavLink>
                    </NavSection>
                </Box>



            </Stack>
    )
}