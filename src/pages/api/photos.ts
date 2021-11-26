
import { storage } from '../../services/firebase'
import { ref, listAll, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { v4 as createId } from 'uuid';


type Photo = {
    name: string;
    url: Array<string>;
}

type Image = {
    preview: string | ArrayBuffer;
    file: File;
    name: String;
}



export const getAll = async () => {
    let list: Photo[] = [];

    const imagesFolder = ref(storage, "images");
    const photoList = await listAll(imagesFolder);

    for(let i in photoList.items) {
        let photoUrl = await getDownloadURL(photoList.items[i]);
        
        //list.push({
        //    name: photoList.items[i].name,
        //    url: photoUrl
        //});
    }

    return list;
}

export const insert = async (image: Image) => {

       
       
               
    const id = createId()
    const newFile = ref(storage, `images/${id}`);
            
    const upload = await uploadBytes(newFile, image.file);
    const photoUrl = await getDownloadURL(upload.ref);
            
    console.log(photoUrl)
    
    
}

export const deletePhoto = async (name: string) => {

    let photoRef = ref(storage, name);
  
    await deleteObject(photoRef);
    

}