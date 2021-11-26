import type {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '../../../../db'
import {getSession} from "next-auth/client"


export default async (req: NextApiRequest, res: NextApiResponse) => {
   
    const session = await getSession({req})
    
    if(req.method !== "POST") {
        return res.status(405).json({ message: 'não ta vindo post'})
    }

        const data = JSON.parse(req.body)
        const nextYear = new Date(Date.now()).getFullYear() + 1
        const validade = new Date (new Date(Date.now()).setFullYear(nextYear))
        const createdBy = session.user.name

        const credencial = {...data, createdAt: new Date(Date.now()), validade, createdBy}

        console.log(credencial)
    res.json({message: "Ok"})
}


