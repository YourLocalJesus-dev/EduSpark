import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBt_m_CWkMux5YfbAAEMLQ-TMifx9leuFI',
  authDomain: 'eduspark-da898.firebaseapp.com',
  projectId: 'eduspark-da898',
  storageBucket: 'eduspark-da898.appspot.com',
  messagingSenderId: '829792559692',
  appId: '1:829792559692:web:03a13f357bb54610130ae9'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const provider = new GoogleAuthProvider()

const googleSignUp = () => signInWithPopup(auth, provider)

export { auth, db, googleSignUp }
