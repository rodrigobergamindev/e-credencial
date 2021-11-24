import type {NextApiRequest, NextApiResponse} from 'next';

import { deletePhoto } from '../photos'
import {prisma} from '../../../../db'






export default async (req: NextApiRequest, res: NextApiResponse) => {


    
    if(req.method !== "DELETE") {
        return res.status(405).json({ message: 'method not allowed'})
    }

    
        const anuncio = JSON.parse(req.body) 
        
        anuncio.image.map(async(image) => await deletePhoto(image))

        await prisma.anuncio.delete({
            where: { id: anuncio.id },
          })
        
         
        
        
  
    
    res.json({message: "Ok"})
    res.end()
}


