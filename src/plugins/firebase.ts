import firebase from 'firebase';
export const firebaseConfig = require('config/firebaseConfig.json');

firebase.initializeApp(firebaseConfig);

export const ga = firebase.analytics();
export const auth = firebase.auth();
export const db = firebase.firestore();
export const functions = firebase.functions();
