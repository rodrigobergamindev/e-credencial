import type {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '../../../../db'










export default async (req: NextApiRequest, res: NextApiResponse) => {
   

    
    if(req.method !== "POST") {
        return res.status(405).json({ message: 'não ta vindo post'})
    }

  
        
        const anuncioData = JSON.parse(req.body) 
        const name = `${anuncioData.marca} ${anuncioData.modelo}`
        const anuncio = {...anuncioData, slug: `${anuncioData.marca}-${anuncioData.modelo}-${anuncioData.versao}-${anuncioData.ano_fabricacao.replace('/','-')}`, name}

        const {marca} = anuncioData


        const marcaAlreadyExists = await prisma.marca.findUnique({
            where: {
              name: marca,
            },
          })
          
          if(marcaAlreadyExists) {
            await prisma.anuncio.create({
                data: {
                    ...anuncio,
                    marca: {
                        connect: {
                            id: marcaAlreadyExists.id
                        }
                    }
                }
               })
          }

          if(marcaAlreadyExists === null){
              
            const createMarca = await prisma.marca.create({
                data: {
                    name:marca
                }
               })

              if(createMarca) {
                await prisma.anuncio.create({
                    data: {
                        ...anuncio,
                        marca: {
                            connect: {
                                id: createMarca.id
                            }
                        }
                    }
                   })
              }
          }

        

  
        
    
    
    res.json({message: "Ok"})
}


