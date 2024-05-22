import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYB35ZZz3rW-n-JkztffgRLxxHyfOxPYc",
  authDomain: "workplan-3eb09.firebaseapp.com",
  projectId: "workplan-3eb09",
  storageBucket: "workplan-3eb09.appspot.com",
  messagingSenderId: "708038431243",
  appId: "1:708038431243:web:0f91c87c08ad2c34996d0e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
