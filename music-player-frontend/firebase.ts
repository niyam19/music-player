import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAQNgRO0-sq_r9gvfcPmhxWvFzcamAddKc",
  authDomain: "music-player-dbf97.firebaseapp.com",
  projectId: "music-player-dbf97",
  storageBucket: "music-player-dbf97.firebasestorage.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };