import type {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '../../../../db'
import {getSession} from "next-auth/client"
import {insert} from '../photos'
import { IncomingForm } from "formidable";



const asyncParse = (req) =>
  new Promise((resolve, reject) => {

    const form = new IncomingForm({ multiples: true });

    form.parse(req, (err, fields, files) => {

      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

export default async (req: NextApiRequest, res: NextApiResponse) => {
   
    const session = await getSession({req})
    
    if(req.method !== "POST") {
        return res.status(405).json({ message: 'não ta vindo post'})
    }
        const result = await asyncParse(req);
        
        /**
         const data = JSON.parse(req.body)
        const nextYear = new Date(Date.now()).getFullYear() + 1
        const validade = new Date (new Date(Date.now()).setFullYear(nextYear))
        const createdBy = session.user.name

        const credencial = {...data, createdAt: new Date(Date.now()), validade, createdBy}
         */

        console.log(result)
        
        
       // await insert(avatar)
    res.json({message: "Ok"})
}


