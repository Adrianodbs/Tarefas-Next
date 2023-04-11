import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDO-6LE00b-Z_AXLzYYvyWnDv-Epw3xoPQ",
  authDomain: "tarefasplus-23e66.firebaseapp.com",
  projectId: "tarefasplus-23e66",
  storageBucket: "tarefasplus-23e66.appspot.com",
  messagingSenderId: "925128072537",
  appId: "1:925128072537:web:cd29219e39d2be4b618048"
};


const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore()

export {db}