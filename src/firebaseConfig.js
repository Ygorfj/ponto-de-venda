import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Substitua os valores abaixo pelas informações do seu console Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAXpi69qyreS1TsXQptj97aEV5eNVLDKz4",
    authDomain: "ponto-de-venda-eeb67.firebaseapp.com",
    projectId: "ponto-de-venda-eeb67",
    storageBucket: "ponto-de-venda-eeb67.firebasestorage.app",
    messagingSenderId: "477728129242",
    appId: "1:477728129242:web:40abe76c64d30bcc4de5e3",
    measurementId: "G-VV2EHM61DH"
};

// Inicialização
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Disponibiliza globalmente para que suas funções no index.html continuem funcionando
window.db = getFirestore(app);
window.auth = getAuth(app);

// Utilitários de Auth expostos globalmente
window.firebaseAuth = {
    signIn: signInWithEmailAndPassword,
    signUp: createUserWithEmailAndPassword,
    signOut: signOut,
    onAuthStateChanged: onAuthStateChanged
};

// Utilitários de Firestore expostos globalmente
window.firebaseDb = {
    doc,
    setDoc,
    getDoc
};

console.log("🚀 Firebase SaaS Engine: Conectado e Funções Expostas");

