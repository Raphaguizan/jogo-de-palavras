// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Config do seu projeto
export const firebaseConfig = {
  apiKey: "AIzaSyAHU2DrkqE65-kUKucOL-n3jRPEwmySUCU",
  authDomain: "jogo-de-palavras-38016.firebaseapp.com",
  projectId: "jogo-de-palavras-38016",
  storageBucket: "jogo-de-palavras-38016.firebasestorage.app",
  messagingSenderId: "55508656547",
  appId: "1:55508656547:web:868910b7cd67262a667a16"
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
