import type {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '../../../../db'
import { deletePhoto } from '../photos'







export default async (req: NextApiRequest, res: NextApiResponse) => {
   
   
    
    
    if(req.method !== "PUT") {
        return res.status(405).json({ message: 'method not allowed'})
    }

  

        const anuncioData = JSON.parse(req.body)
        const anuncioToUpdate = anuncioData.anuncio 
        const name = `${anuncioToUpdate.marca} ${anuncioToUpdate.modelo}`
        const newAnuncio = {...anuncioToUpdate, name}

        const {marca} = anuncioToUpdate
        
        const marcaAlreadyExists = await prisma.marca.findUnique({
          where: {
            name:marca,
          }
        })

        if(marcaAlreadyExists) {
          const update = await prisma.anuncio.update({
              where: {
                  slug: anuncioToUpdate.slug,
              },
                data: {
                  ...newAnuncio,
                  marca: {
                    connect: {
                        id: marcaAlreadyExists.id
                    }
                }
                }
            })

        if(update){
          anuncioData.imagesDeleted.map(async(image) => await deletePhoto(image.preview))
        }

        }

        if(marcaAlreadyExists === null){

          const createMarca = await prisma.marca.create({
            data: {
                name:marca
            }
           })

           const update = await prisma.anuncio.update({
            where: {
              slug: anuncioToUpdate.slug,
            },
            data: {
              ...newAnuncio,
              marca: {
                connect: {
                    id: createMarca.id
                }
            }
            }
          })

          if(update){
            
            anuncioData.imagesDeleted.map(async(image) => await deletePhoto(image))
          }
        }

        
    
    
    res.json({message: "Ok"})
}


