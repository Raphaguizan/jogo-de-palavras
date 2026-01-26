// game-impostor.js
import { db } from "./firebase.js";
import {
    ref,
    set,
    get,
    onValue,
    update,
    push
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* ---------- STATE ---------- */

let playerName = "";
let roomCode = "";
let isHost = false;
let revealed = false;
let playerId = crypto.randomUUID();

/* ---------- UTIL ---------- */

function gerarNomeAleatorio() {
    const nomes = ["Gato", "Cachorro", "Dragão", "Ninja", "Pirata", "Fantasma"];
    return nomes[Math.floor(Math.random() * nomes.length)] + Math.floor(Math.random() * 100);
}

/* ---------- INIT ---------- */

function initImpostor() {
    const saved = localStorage.getItem("impostor_nome");
    playerName = saved || gerarNomeAleatorio();

    const input = document.getElementById("impostorNome");
    if (input) input.value = playerName;
}

/* ---------- LOBBY ---------- */

function salvarNome() {
    const input = document.getElementById("impostorNome");
    playerName = input.value.trim() || gerarNomeAleatorio();
    localStorage.setItem("impostor_nome", playerName);
}

function criarSala() {
    salvarNome();
    isHost = true;
    roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();

    const roomRef = ref(db, `rooms/${roomCode}`);

    set(roomRef, {
        host: playerName,
        started: false,
        players: {
            [playerId]: {
                name: playerName,
                impostor: false
            }
        }
    });

    entrarSalaUI();
    escutarSala();
}

function entrarSala() {
    salvarNome();
    isHost = false;

    roomCode = document.getElementById("codigoInput").value.trim().toUpperCase();
    if (!roomCode) return alert("Digite o código da sala");

    const playerRef = ref(db, `rooms/${roomCode}/players/${playerId}`);

    set(playerRef, {
        name: playerName,
        impostor: false
    });

    entrarSalaUI();
    escutarSala();
}

function entrarSalaUI() {
    document.getElementById("codigoSala").textContent = roomCode;
    document.getElementById("hostArea").style.display = isHost ? "block" : "none";
    document.getElementById("playerArea").style.display = isHost ? "none" : "block";
    go("impostor-game");
}

/* ---------- JOGO ---------- */

function iniciarPartida() {
    if (!window.palavras || window.palavras.length === 0) {
        alert("Nenhuma palavra carregada");
        return;
    }

    const palavra = window.palavras[
        Math.floor(Math.random() * window.palavras.length)
    ];

    const roomRef = ref(db, `rooms/${roomCode}`);

    get(ref(db, `rooms/${roomCode}/players`)).then(snapshot => {
        const players = Object.keys(snapshot.val());
        const impostorId = players[Math.floor(Math.random() * players.length)];

        const updates = {
            palavra,
            started: true
        };

        players.forEach(id => {
            updates[`players/${id}/impostor`] = id === impostorId;
        });

        update(roomRef, updates);
    });
}

/* ---------- LISTENERS ---------- */

function escutarSala() {
    const roomRef = ref(db, `rooms/${roomCode}`);

    onValue(roomRef, snapshot => {
        if (!snapshot.exists()) return;

        const data = snapshot.val();

        atualizarListaJogadores(data.players);

        if (data.started) {
            const meuEstado = data.players[playerId];
            if (!meuEstado) return;

            if (meuEstado.impostor) {
                mostrarMensagem("🚨 VOCÊ É O IMPOSTOR");
            } else {
                mostrarMensagem("🎨 PALAVRA: " + data.palavra);
            }
        }
    });
}

/* ---------- UI ---------- */

function atualizarListaJogadores(players) {
    const ul = document.getElementById("impostorPlayersList");
    if (!ul) return;

    ul.innerHTML = "";
    Object.values(players).forEach(p => {
        const li = document.createElement("li");
        li.textContent = p.name;
        ul.appendChild(li);
    });
}

function mostrarMensagem(texto) {
    const box = document.getElementById("impostorMensagem");
    box.textContent = texto;
    box.classList.remove("hidden");
    revealed = true;
    setTimeout(ocultarMensagem, 10000);
}

function ocultarMensagem() {
    document.getElementById("impostorMensagem").classList.add("hidden");
    revealed = false;
}

function toggleMensagem() {
    const box = document.getElementById("impostorMensagem");
    revealed = !revealed;
    box.classList.toggle("hidden", !revealed);
}

/* ---------- EXPOR PARA HTML ---------- */

Object.assign(window, {
    initImpostor,
    criarSala,
    entrarSala,
    iniciarPartida,
    ocultarMensagem,
    toggleMensagem
});
