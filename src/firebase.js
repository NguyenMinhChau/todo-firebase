import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyD-LtV4QMCuJmj2CDXCGYsXzTQM4wmAf6s',
    authDomain: 'todo-firebase-060822.firebaseapp.com',
    projectId: 'todo-firebase-060822',
    storageBucket: 'todo-firebase-060822.appspot.com',
    messagingSenderId: '336842297307',
    appId: '1:336842297307:web:0ed3831c8f1f764a0d61fe',
    measurementId: 'G-VQHPXSYB5L',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { db, auth, provider, storage };
