import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore"
import { firebaseApp } from ".."


const firestore = getFirestore(firebaseApp)

export default firestore