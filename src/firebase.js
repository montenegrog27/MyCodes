import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeft3lvanlWLy6LZV-b94EcQBndmxAUqw",
  authDomain: "mycodes-cd126.firebaseapp.com",
  projectId: "mycodes-cd126",
  storageBucket: "mycodes-cd126.appspot.com",
  messagingSenderId: "414617389821",
  appId: "1:414617389821:web:d8d1c3b65cd611d0c74c94",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
