import { uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as storageRef } from "firebase/storage";
import { storage } from "@/firebase";

export async function uploadFile(file: File, fileName: string, targetUserID: string) {
    console.log("(firebase.uploadFile) FIREBASE_UPLOAD_FILE:", file);
  
    const store = storageRef(storage, `${targetUserID}/${fileName}`);
  
    // 'file' comes from the Blob or File API
    const snapshot = await uploadBytes(store, file);
    console.log('(firebase) Uploaded a blob or file!', file, snapshot);
  
    const url = await getDownloadURL(storageRef(storage, snapshot.ref.fullPath));
    console.log("(firebase.uploadFile) FIREBASE_DL_URL:", url);
  
    return url;
}